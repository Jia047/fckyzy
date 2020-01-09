const axios = require('axios')
const path = require('path')
const fs = require('fs')

const common = require('../services/common/common.service')
const ParseUtil = require('../utils/parse-util')

function sleep(ms) {
    return new Promise(resolved => setTimeout(resolved, ms))
}

/**
 * professionsData 专业信息密文 
 */
function parseData(professionsData, result) {
    let p
    for (let i = 0; i < professionsData; i++) {
        p = professionsData[i]
        result.push({
            year: p.year,
            courseType: p.courseType,
            batch: p.batch,
            batchName: p.batchName,
            uCode: p.ucode,
            chooseLevel: p.chooseLevel,
            lineDiff: p.lineDiff,
            majorCode: p.majorCode,
            professionName: ParseUtil.parseCN(p.professionName),
            professionCode: ParseUtil.parseCN(p.professionCode),
            remarks: p.remarks,
            maxScore: ParseUtil.parseNUM(p.maxScore),
            minScore: ParseUtil.parseNUM(p.minScore),
            avgScore: ParseUtil.parseNUM(p.avgScore),
            lowSort: ParseUtil.enterNum(p.lowSort),
            maxSort: p.maxSort,
            enterNum: ParseUtil.parseNUM(p.enterNum),
            countOfZJZY: p.countOfZJZY
        })
    }
}

async function query() {
    // 结果存储文件夹
    const resultDir = path.normalize(`${__dirname}/professions-score-lines/edata`)
    // 引入省份id和名字 大学id和名字
    const provinces = JSON.parse(fs.readFileSync('./province.json'))
    const colleges = JSON.parse(fs.readFileSync('./colleges/colleges.json'))

    for (let id in provinces) {
        // const id = '1'
        const courseType = 1 // 1-文科，0-理科
        const yearFrom = 2012
        const yearTo = 2018
        const provinceName = provinces[id]

        for (let i = 0; i < colleges.length; i++) {

            // 省份文件夹
            const provinceDir = path.normalize(`${resultDir}/provinceName`)
            if (!fs.existsSync(provinceDir)) {
                fs.mkdirSync(provinceDir)
            }

            for (let i = 0; i < colleges.length; i++) {

                const college = colleges[i]
                const cid = college.cid
                const cName = college.cName

                await ucode(id, cid).then(async res => {
                    uCode = res
                    if (uCode === 0 || uCode === undefined) {
                        return
                    }

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
                        // const result = []
                        // parseData(res.data.result, result)
                        // fs.writeFileSync(`${provinceDir}/${cid}.json`, JSON.stringify(result))
                        fs.writeFileSync(`${provinceDir}/${cid}.json`, JSON.stringify(res.data.result))
                    })

                })

                console.log(provinceName, '==>', cName, `剩 ${colleges.length - i - 1} 个`);
            }

            await sleep(Math.floor(Math.random() * 10) * 100)
        }
        console.log(provinceName, 'completely');

    }
}


// query()
