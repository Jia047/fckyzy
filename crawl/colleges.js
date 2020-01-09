/**
 * 获取所有的大学的信息 ==> 院校分数线、院校专业分数线
 */
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const common = require('../services/common/common.service')


// const HOST = 'https://www.youzy.cn/'
// const COLLEGE_LIST = 'tzy/search/colleges/collegeList'

// axios.defaults.baseURL = HOST

/**
 * 获取所有大学的id,
 * 无法处理 302 响应码，现在还没想到解决办法
 */
/*async function crawlHtml() {
    await axios.get(COLLEGE_LIST, {
        params: {
            // page: 1
        }
    }).then(res => {
        console.log(res.data)
        console.log('cccc');

    }).catch(err => {
        console.log(err);

    })
} */

function sleep(ms){
  return new Promise((resolve)=>setTimeout(resolve,ms));
}

/**
 * 获取大学的 ucode，因为每个省份的批次线要求不一样，所以有一个 provinceId 参数
 */
async function ucode(provinceId, collegeId) {
    return await axios({
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
        console.log(`${provinceId}==${collegeId}===${err.errno}===${err.code}`);

    })
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
            console.log(cName, cid);
        })

    } catch (err) {
        console.log(err);
    }
}

function parseHtmlDir() {
    const dir = path.normalize(`${__dirname}/colleges/`)
    if (fs.existsSync(dir)) {
        fs.readdir(dir, (err, files) => {
            const result = []
            files.forEach(file => {
                if (path.extname(file) === '.html') {
                    parseHtml(dir + file, result)
                }
            })
            fs.writeFileSync(dir + 'colleges.json', JSON.stringify(result))
        })
    }
}

async function queryScoreLines() {
    // 结果存储文件夹
    const resultDir = path.normalize(`${__dirname}/colleges-score-lines`)
    // 引入省份id和名字 大学id和名字
    const provinces = JSON.parse(fs.readFileSync('./province.json'))
    const colleges = JSON.parse(fs.readFileSync('./colleges/colleges.json'))

    // 上海爬到一半有问题，先跳过
    const id = '848'
    let provinceName = provinces[id]
    let result = []
    for (let i = 0; i < colleges.length; i++) {
        let college = colleges[i]

        const cid = college.cid
        const cName = college.cName
        await ucode(id, cid).then(async res => {
            const uCode = res
            console.log(cid, cName, uCode);

            if (uCode === 0 || uCode === undefined) {
                return
            }
            // 通过 ucode 获取往年该大学在该省份的录取分数线
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
                console.log(`${cName}+++${err.errno}+++${err.code}`)
            })
            console.log(provinceName, '==>', cName, `剩 ${colleges.length - i - 1} 个`);
        })
        await sleep(Math.floor(Math.random() * 10) * 50)
    }

    fs.writeFileSync(`${resultDir}/${provinceName}.json`, JSON.stringify(result))
    console.log(provinceName, 'completely');
}

/**
 * 解析密文 
 */
function parseData(collegeData, result) {
    const r = {
        cid: collegeData.cid,
        cName: collegeData.cName,
        uCode: collegeData.uCode,
        provinceId: collegeData.id,
        scoreLines: []
    }

    let sl
    for (let i = 0; i < collegeData.scoreLines.length; i++) {
        sl = collegeData.scoreLines[i]
        r.scoreLines.push({
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

    result.push(r)
}

function parseDir(){
    // 结果存储文件夹
    const targetDir = path.normalize(`${__dirname}/colleges-score-lines/ddata`)
    const sourceDir = path.normalize(`${__dirname}/colleges-score-lines`)
    // 引入省份id和名字
    const provinces = JSON.parse(fs.readFileSync('./province.json'))

    const provinceName, collegeData, c 
    let result
    for(let id in provinces){
        result = []
        provinceName = provinces[i]
        collegeData = JSON.parse(fs.readFileSync(`${sourceDir}/${provinceName}.json`))
        for(let i = 0; i < collegeData.length; i++){
            c = collegeData[i]
            parseData(c, result)
        }
        fs.writeFileSync(`${targetDir}/${provinceName}.json`, JSON.stringify(result))    
    }
}

// ucode(1, 838).then(res => console.log(res) )

// parseHtmlDir()

queryScoreLines()
