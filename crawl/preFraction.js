const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const __async = require('async')

const common = require('../services/common/common')
const sleep = require('../utils/sleep')
const ParseUtil = require('../utils/parse-util')
const log = require('../utils/log')

const provinces = JSON.parse(fs.readFileSync('./json/province.json'))

const PRE_FRACTION_DIR = path.normalize(__dirname + '/data/preFraction/')
const logger = log.getLogger({
    filename: 'preFraction'
})

const PAGE_SIZE = 5
const OPTIONS = {
    method: 'POST',
    url: 'https://ia-pv4y.youzy.cn/Data/TZY/PreFraction/QueryWithApp',
}

/**
 * 抓取每个省份的提前批数据展示网页
 */
async function crawlHtml() {
    logger.info('crawl html')
    for (key in provinces) {
        let p = { "provinceId": key, "provinceName": provinces[key], "isGaokaoVersion": false }
        let encryptP = common.youzyEpt(p)
        let cookie = encodeURI(JSON.stringify(p))

        await axios({
            url: 'https://ia-pv4y.youzy.cn/preFraction/index',
            method: 'GET',
            headers: {
                // 后台应该是从 cookie 里获取用户的省份的
                'Cookie': `YouzyPV_currentProvince=${cookie}`
            },
            params: {
                'p': encryptP,
                'toUrl': '/preFraction/index'
            }
        }).then(res => {
            fs.writeFileSync(`./data/preFraction/html/${provinces[key]}.html`, res.data)
            logger.info(provinces[key], 'completely');

        }).catch(err => {
            logger.error(provinces[key], err.errno);
        })
    }
}

/**
 * 将省份的html文件进行解析，得到一个关于各批次的json对象
 * @param htmlFileName 要解析的 html 文件的路径【相对路径】或者【绝对路径】
 * @Param createFileName 生成的文件的路径【相对路径】或者【绝对路径】
 */
function parseHtml(htmlFileName, createFileName, provinceName, provinceId) {
    try {
        const $ = cheerio.load(fs.readFileSync(htmlFileName, 'utf-8'))

        const picis = []
        // 批次类别
        const subjectTypes = $('a.subjectType')
        for (let i = 0; i < subjectTypes.length; i++) {
            let pici = {}
            let colleges = []
            let preFractionNameWrap

            pici['province'] = provinceName
            pici['provinceId'] = provinceId
            pici['name'] = subjectTypes[i].attribs['title']

            preFractionNameWrap = $('.preFraction-name-wrap').eq(i)
            preFractionNameWrap.children('.preFraction-name').eq(0).children('ul').children('li').each(function (index, element) {

                const tagA = $(this).children('a')
                const pcxs = []
                const c = {
                    'pcid': tagA[0].attribs['data-id'],
                    'name': tagA.text(),
                    'pcxs': pcxs
                }
                preFractionNameWrap.children('.preFraction-name1').children('ul').eq(index).children('li').each(function (index, element) {
                    const tagA = $(this).children('a')
                    const pici = {
                        'typeId': tagA[0].attribs['data-id'],
                        'name': tagA.text()
                    }
                    pcxs.push(pici)
                })
                colleges.push(c)
            })

            pici['colleges'] = colleges

            picis.push(pici)
        }
        if (picis.length > 0) {
            fs.writeFileSync(createFileName, JSON.stringify(picis))
        }

    } catch (err) {
        logger.error(htmlFileName, err.errno);
    }
}

/**
 * 遍历目录，解析 .html 文件
 */
function parseHtmlDir() {
    logger.info('parse html dir')
    const htmlDir = path.normalize(__dirname + '/data/preFraction/html')
    const jsonDir = path.normalize(__dirname + '/data/preFraction/json')
    const provinces = JSON.parse(fs.readFileSync('./json/province.json'))

    fs.readdir(htmlDir, (err, files) => {
        files.forEach(file => {
            // 只拿文件名，不要后缀
            const provinceName = path.basename(file, '.html')
            let provinceId = 0
            for (let id in provinces) {
                if (provinces[id] === provinceName) {
                    provinceId = id
                    break
                }
            }

            const htmlFileName = path.normalize(htmlDir + `/${file}`)
            const createFileName = path.normalize(jsonDir + `/${provinceName}.json`)
            logger.info(htmlFileName)
            logger.info(createFileName)
            parseHtml(htmlFileName, createFileName, provinceName, provinceId)
        })
    })
}

/**
 * 构建一个查询对象 
 */
function bulidQueryObj(typeId, year, provinceId) {
    return {
        typeId: typeId,
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        provinceId: provinceId,
        year: year,
        course: -1
    }
}

async function crawlData() {
    logger.info('crawl data')
    const typeInfoDir = path.normalize(PRE_FRACTION_DIR + '/json/')
    const resultStoreDir = path.normalize(PRE_FRACTION_DIR + '/data/encrypt/')

    files = fs.readdirSync(typeInfoDir)
    let file
    for (let a = 0; a < files.length; a++) {
        file = files[a]
        let collegesResult = []
        const typeInfo = JSON.parse(fs.readFileSync(typeInfoDir + file))

        const provinceName = typeInfo[0].province
        const provinceId = typeInfo[0].provinceId
        // 请求头部添加省份信息的 cookie
        let p = { "provinceId": provinceId, "provinceName": provinceName, "isGaokaoVersion": false }
        let cookie = encodeURI(JSON.stringify(p))
        OPTIONS.headers = { 'Cookie': `YouzyPV_currentProvince=${cookie}` }

        // fenlei ==> 分类
        let fenlei, college, pcx
        for (let f = 0; f < typeInfo.length; f++) {
            fenlei = typeInfo[f]
            // 遍历该省份下的每一所大学
            for (let c = 0; c < fenlei.colleges.length; c++) {
                college = fenlei.colleges[c]
                // 遍历该类别的大学的每一个批次
                // pcx ==> 批次项，是个数组
                for (let p = 0; p < college.pcxs.length; p++) {
                    pcx = college.pcxs[p]
                    const typeId = pcx.typeId
                    // 参数构建与加密
                    const query = bulidQueryObj(typeId, 2019, provinceId)
                    const encryptQuery = common.youzyEpt(query)
                    OPTIONS.data = { 'data': encryptQuery }

                    await axios(OPTIONS).then(async res => {
                        const totalCount = res.data.result.totalCount

                        // 遵循网页请求的方式，分页请求，一次请求 五条
                        const maxPage = parseInt((totalCount / PAGE_SIZE) + 1)
                        if (maxPage > 0) {
                            for (let i = 1; i <= maxPage; i++) {
                                query.pageIndex = i
                                encryptData = common.youzyEpt(query)
                                OPTIONS.data = { 'data': encryptData }

                                await axios(OPTIONS).then(res => {
                                    const items = res.data.result.items

                                    // 将该批次的大学收集起来
                                    let item
                                    for (let b = 0; b < items.length; b++) {
                                        item = items[b]
                                        collegesResult = collegesResult.concat(item.colleges)
                                    }

                                })
                                logger.info(provinceName,fenlei.name,college.name, pcx.name, totalCount, `${i}/${maxPage}`);

                                await sleep.millisecond(Math.floor(Math.random() * 10) * 200)
                            }
                        }
                    }).catch(err => {
                        logger.error(provinceName, fenlei.name, college.name, err.errno)
                    })
                }
            }
            // 每个分类查询完就写入文件
            const dir = `${resultStoreDir}/${provinceName}`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            fs.writeFileSync(`${dir}/${fenlei.name}.json`, JSON.stringify(collegesResult))
        }
    }
}


function parseData(source, target) {
    source.forEach(c => {
        const college = {
            typeId: c.typeId,
            admissCode: ParseUtil.parseCN(c.admissCode),
            collegeId: c.collegeId,
            collegeName: ParseUtil.parseCN(c.collegeName),
            course: c.course,
            bzType: c.bzType,
            admissType: c.admissType,
            planNum: ParseUtil.parseNUM(c.planNum),
            cost: c.cost,
            learnYear: c.learnYear,
            remarks: ParseUtil.parseCN(c.remarks),
            marjors: []
        }
        // 解析专业
        c.majors.forEach(m => {
            const marjor = {
                marjorCode: m.majorCode,
                professionName: ParseUtil.parseCN(m.professionName),
                professionCode: ParseUtil.parseCN(m.professionCode),
                professionDesc: ParseUtil.parseCN(m.professionDesc),
                chooseSubject: m.chooseSubject,
                planNum: ParseUtil.parseNUM(m.planNum),
                cost: ParseUtil.parseCN(m.cost),
                learnYear: ParseUtil.parseCN(m.learnYear),
                remarks: ParseUtil.parseCN(m.remarks)
            }
            college.marjors.push(marjor)
        })
        target.push(college)
    })
}

function parseDir() {
    logger.info('parse dir')
    const sourceDir = path.normalize(PRE_FRACTION_DIR + '/data/encrypt/')
    const targetDir = path.normalize(PRE_FRACTION_DIR + '/data/decrypt/')

    const dirs = fs.readdirSync(sourceDir)
    dirs.forEach(dir => {
        const td = path.normalize(`${targetDir}/${dir}`)
        if (!fs.existsSync(td)) {
            fs.mkdirSync(td)
        }
        fs.readdir(`${sourceDir}/${dir}`, (err, files) => {
            if(err){
                logger.error(err.errno)
                return
            }
            files.forEach(file => {
                // 读取路径
                const sourceFilePath = path.normalize(`${sourceDir}/${dir}/${file}`)
                // 存储路径
                const targetFilePath = path.normalize(`${targetDir}/${dir}/${file}`)

                const source = JSON.parse(fs.readFileSync(sourceFilePath))
                const target = []
                parseData(source, target)

                if (target.length > 0) {
                    fs.writeFileSync(targetFilePath, JSON.stringify(target))
                }
                logger.info(`${dir}==${file}`);
                
            })
        })
    })
}


// 按照一下顺序分别执行函数
// 1. 先执行 crawl 方法，把网页爬下来
// crawlHtml()
// 2. 把爬下来的网页进行解析，拿到各学院各批次的 typeId
// parseHtmlDir()
// 3. 通过 typeId 获取各个批次的详细信息
// crawlData()
// 4. 把爬取下来的数据进行解密
// parseDir()

__async.series([crawlHtml, parseHtmlDir, crawlData, parseData], (err, result) => {
    err && logger.error(err.errno)
    logger.info(result)
})