const axios = require('axios')
const path = require('path')
const fs = require('fs')
const async = require('async')

const common = require('../services/common/common')
const ParseUtil = require('../utils/parse-util')
const sleep = require('../utils/sleep')
const ucode = require('./ucode')
const log = require('../utils/log')

const BasePath = './data/professionScoreLines/'
const logger = log.getLogger({
    filename: 'profession'
})

async function query() {
    // 结果存储文件夹
    const resultDir = path.normalize(`${BasePath}/data/encrypt`)
    // 引入省份id和名字 大学id和名字
    const provinces = JSON.parse(fs.readFileSync('./json/province.json'))
    const colleges = JSON.parse(fs.readFileSync('./data/collegeScoreLines/json/colleges.json'))

    // yearFrom 和 yearTo 也可以是相同的，这样就是获取特定的一年
    // 比如 yearFrom =2019, yearTo =2019 是获取2019年的信息
    const yearFrom = 2012
    const yearTo = 2018
    // 1-文科，0-理科
    const courseType = 1
    const courseTypeStr = courseType === 1 ? '文科' : '理科'

    let provinceName, college, cid, cName
    let collegeProInfo = []
    for (let i = 0; i < colleges.length; i++) {
        collegeProInfo = []

        college = colleges[i]
        cid = college.cid
        cName = college.cName

        for (let provinceId in provinces) {
            provinceName = provinces[provinceId]

            await ucode.query(provinceId, cid).then(async res => {
                const uCode = res

                if (uCode !== 0 && uCode !== undefined) {
                    await axios({
                        url: 'http://ia-pv4y.youzy.cn/Data/ScoreLines/Fractions/Professions/Query?p=abc',
                        method: 'POST',
                        data: {
                            data: common.youzyEpt({
                                uCode: uCode,
                                // batch: 0,
                                courseType: courseType,
                                yearFrom: yearFrom,
                                yearTo: yearTo
                            })
                        }
                    }).then(res => {
                        if (res.data.result.length > 0) {
                            collegeProInfo.push({
                                provinceId: provinceId,
                                proInfo: res.data.result
                            })
                        }
                    }).catch(err => {
                        logger.error(cName, provinceName, err);

                    })
                }
            })

            logger.info(cName, courseTypeStr, provinceName, `剩 ${colleges.length - i - 1} 个`);
            await sleep.millisecond(Math.floor(Math.random() * 10) * 200)
        }
        if (collegeProInfo.length > 0) {
            fs.writeFileSync(`${resultDir}/${cid}.json`, JSON.stringify(collegeProInfo))
        }

        logger.info(cName, 'completely');
    }
logger.info('query completely');
}

/**
 * professionsData 专业信息密文 
 */
function parseData(professionsData, result) {
    let pd
    let proInfo = []
    for (let i = 0; i < professionsData.length; i++) {
        proInfo = []
        pd = professionsData[i]

        pd.proInfo.forEach(p => {
            proInfo.push({
                year: p.year,
                courseType: p.courseType,
                batch: p.batch,
                batchName: p.batchName,
                uCode: p.uCode,
                chooseLevel: p.chooseLevel,
                lineDiff: p.lineDiff,
                majorCode: p.majorCode,
                professionName: ParseUtil.parseCN(p.professionName),
                professionCode: ParseUtil.parseCN(p.professionCode),
                remarks: p.remarks,
                maxScore: ParseUtil.parseNUM(p.maxScore),
                minScore: ParseUtil.parseNUM(p.minScore),
                avgScore: ParseUtil.parseNUM(p.avgScore),
                lowSort: ParseUtil.parseNUM(p.lowSort),
                maxSort: p.maxSort,
                enterNum: ParseUtil.parseNUM(p.enterNum),
                countOfZJZY: p.countOfZJZY
            })
        })

        if (proInfo.length > 0) {
            result.push({
                provinceId: pd.provinceId,
                proInfo: proInfo
            })
        }
    }

}

function parseDir() {
    // 结果存储文件夹
    const targetDir = path.normalize(`${BasePath}/data/decrypt`)
    const sourceDir = path.normalize(`${BasePath}/data/encrypt`)

    let source
    let result = []
    fs.readdir(sourceDir, (err, files) => {
        if(err){
            logger.error(err)
        }
        files.forEach(file => {
            result = []
            source = JSON.parse(fs.readFileSync(`${sourceDir}/${file}`))

            parseData(source, result)
            if (result.length > 0) {
                fs.writeFileSync(`${targetDir}/${file}`, JSON.stringify(result))
            }
            logger.info(`parse ${file}`)
        })
    })
logger.info('parse dir completely');
}

// 1. 查数据
// query()

// 2. 数据解析
// parseDir()

async.series([query, parseDir], (err, result) => {
    err && logger.error(err)
    logger.info(result)
})