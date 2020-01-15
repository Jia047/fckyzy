/**
 * 获取所有的大学的信息 ==> 院校分数线、院校专业分数线
 */
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const common = require('../services/common/common')
const ParseUtil = require('../utils/parse-util')
const sleep = require('../utils/sleep')
const ucode = require('./ucode')
const log = require('../utils/log')

const BasePath = './data/collegeScoreLines'
const logger = log.getLogger({
    filename: 'colleges'
})

/**
 * 获取所有大学的id,
 */
async function collegeList() {
    // 总页数，默认是 145, 从 1 开始计数
    let totalPages = 146
    const params = { page: 1 }
    const options = {
        url: 'https://www.youzy.cn/tzy/search/colleges/collegeList',
        method: 'GET',
        params: params,
        headers: {
            // 需要设置省份的 cookie，不然会发生重定向到另一个网页进行省份设置
            'Cookie': 'Youzy2CCurrentProvince=%7B%22provinceId%22%3A848%2C%22provinceName%22%3A%22%E6%B2%B3%E5%8D%97%22%2C%22isGaokaoVersion%22%3Afalse%7D;'
        }
    }
    // 获取当前时间的总页数
    await axios(options).then(res => {
        const $ = cheerio.load(res.data)
        const tp = $('ul.pagination').find('strong').eq(0).text()
        // 得是数值才行
        if (!isNaN(tp)) {
            totalPages = tp + 1
        }
        logger.info('total page', totalPages);

    })

    for (let i = 1; i < totalPages; i++) {
        params.page = i

        await axios(options).then(res => {
            fs.writeFileSync(path.normalize(`${BasePath}/html/c_page_${i}.html`), res.data)
            logger.info(`crawl page_${i}`);

        }).catch(err => {
            logger.info(err.errno);
        })

        await sleep.millisecond(Math.floor(Math.random() * 10) * 200)
    }
    logger.info(`crawl page completely, total page ${totalPages}`);

}

/**
 * 解析html页面，获取大学的名称及其对应id
 */
function parseHtml(htmlFile, result) {
    try {
        const $ = cheerio.load(fs.readFileSync(htmlFile, { encoding: 'utf-8' }))
        $('a.name').each(function (index, element) {
            const tagA = $(this)['0']
            const cName = tagA.children[0].data
            const href = tagA.attribs['href']
            const cid = href.substring(href.lastIndexOf('=') + 1)
            result.push({
                cid: cid,
                cName: cName
            })
            logger.info(cName, cid);
        })

    } catch (err) {
        logger.error(htmlFile,err.errno);
    }
}

function parseHtmlDir() {
    const dir = path.normalize(`${BasePath}/html/`)
    if (fs.existsSync(dir)) {
        fs.readdir(dir, (err, files) => {
            const result = []
            files.forEach(file => {
                parseHtml(dir + file, result)
            })
            fs.writeFileSync(`${BasePath}/json/colleges.json`, JSON.stringify(result))
        })
    }
}

/**
 * 获取大学的 ucode，因为每个省份的批次线要求不一样，所以有一个 provinceId 参数
 */
/*
async function ucode(provinceId, collegeId) {
    return await axios({
        // 随便给个 p 参数即可
        url: 'https://ia-pv4y.youzy.cn/Data/ScoreLines/UCodes/QueryList?p=abc',
        method: 'POST',
        data: {
            data: common.youzyEpt({
                provinceId: provinceId,
                collegeId: collegeId
            })
        }
    }).then(res => {
        let ucode = 0
        const data = res.data.result
        if (data.length !== 0) {
            ucode = data[0].uCodeNum
            data.forEach(function (r) {
                var uCodeNumArr = r.uCodeNum.split('_').reverse()
                if (uCodeNumArr[0] == '0' && uCodeNumArr[1] == '0') {
                    uCode = r.uCodeNum
                }
            })
        }
        return ucode
    }).catch(err => {
        logger.info(`${provinceId}==${collegeId}===${err.errno}===${err.code}`);
    })
} */

/**
 * 爬取大学每年的分数线信息
 */
async function queryScoreLines() {
    // 结果存储文件夹
    const resultDir = path.normalize(`${BasePath}/data/encrypt`)
    // 引入省份id和名字 大学id和名字
    const provinces = JSON.parse(fs.readFileSync('./json/province.json'))
    const colleges = JSON.parse(fs.readFileSync(`${BasePath}/json/colleges.json`))

    for (let id in provinces) {
        let provinceName = provinces[id]
        let result = []
        for (let i = 0; i < colleges.length; i++) {
            const college = colleges[i]
            const cid = college.cid
            const cName = college.cName

            await ucode.query(id, cid).then(async res => {
                const uCode = res
                logger.info(cid, cName, uCode);

                if (uCode !== 0 && uCode !== undefined) {
                    await axios({
                        url: 'http://ia-pv4y.youzy.cn/Data/ScoreLines/Fractions/Colleges/Query?p=abc',
                        method: 'POST',
                        data: {
                            data: common.youzyEpt({
                                provinceNumId: id,
                                ucode: uCode
                            })
                        }
                    }).then(res => {
                        result.push({
                            cid: cid,
                            cName: cName,
                            uCode: uCode,
                            provinceId: id,
                            scoreLines: res.data.result
                        })
                    }).catch(err => {
                        logger.error(`${cName} ${err.errno} ${err.code}`)
                    })
                    logger.info(provinceName, cName, `剩 ${colleges.length - i - 1} 个`);
                }
                // 通过 ucode 获取往年该大学在该省份的录取分数线
                await sleep.millisecond(Math.floor(Math.random() * 10) * 200)
            })
        }
        fs.writeFileSync(`${resultDir}/${provinceName}.json`, JSON.stringify(result))
        logger.info(provinceName, 'completely');
    }
}

/**
 * 解析密文 
 */
function parseData(collegeData, result) {
    const scoreLines = []
    let sl
    for (let i = 0; i < collegeData.scoreLines.length; i++) {
        sl = collegeData.scoreLines[i]
        scoreLines.push({
            year: sl.year,
            course: sl.course,
            batch: sl.batch,
            batchName: sl.batchName,
            uCode: sl.uCode,
            chooseLevel: sl.chooseLevel,
            lineDiff: sl.lineDiff,
            minScore: ParseUtil.parseNUM(sl.minScore),
            avgScore: ParseUtil.parseNUM(sl.avgScore),
            maxScore: ParseUtil.parseNUM(sl.maxScore),
            lowSort: ParseUtil.parseNUM(sl.lowSort),
            maxSort: ParseUtil.parseNUM(sl.maxSort),
            enterNum: ParseUtil.parseNUM(sl.enterNum),
            countOfZJZY: sl.countOfZJZY,
            prvControlLines: sl.prvControlLines
        })
    }
    // 有分数的大学再存储起来
    if (scoreLines.length > 0) {
        result.push({
            cid: collegeData.cid,
            cName: collegeData.cName,
            uCode: collegeData.uCode,
            provinceId: collegeData.provinceId,
            scoreLines: scoreLines
        })
    }
}

function parseDir() {
    // 结果存储文件夹
    const targetDir = path.normalize(`${BasePath}/data/decrypt`)
    const sourceDir = path.normalize(`${BasePath}/data/encrypt`)
    // 引入省份id和名字
    const provinces = JSON.parse(fs.readFileSync('./json/province.json'))

    let provinceName, collegeData, college, filePath
    let result
    for (let id in provinces) {
        result = []
        provinceName = provinces[id]
        filePath = path.normalize(`${sourceDir}/${provinceName}.json`)
        if (fs.existsSync(filePath)) {
            collegeData = JSON.parse(fs.readFileSync(filePath))
            for (let i = 0; i < collegeData.length; i++) {
                college = collegeData[i]
                parseData(college, result)
            }
            fs.writeFileSync(`${targetDir}/${provinceName}.json`, JSON.stringify(result))
        }
    }
}

// 1. 爬取各大学的id
// collegeList()
// 2. 解析网页代码，拿到各大学的id和名字
// parseHtmlDir()
// 3. 爬取大学每年的分数线信息
// queryScoreLines()
// 4. 数据解析
// parseDir()
