// 每个大学在每个省份都有一个对应的 ucode，这个文件就是把这些ucode下载下来
const axios = require('axios')
const fs = require('fs')

const common = require('../services/common/common')
const sleep = require('../utils/sleep')

const BasePath = './data/ucode'
const provinces = JSON.parse(fs.readFileSync('./json/province.json'))
const colleges = JSON.parse(fs.readFileSync('./data/collegeScoreLines/json/colleges.json'))

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
        console.log(`${provinceId}==${collegeId}===${err.errno}===${err.code}`);
    })
}

/**
 * 搞起
 */
async function collect() {

    let provinceName, college, code
    let result = []
    for (let id in provinces) {
        result = []
        provinceName = provinces[id]
    
        for (let i = 0; i < colleges.length; i++) {
            college = colleges[i]
            await ucode(id, college.cid).then(res => {
                code = res
                console.log(provinceName, college.cName, code);
                
                result.push({
                    cid: college.cid,
                    provinceId: id,
                    ucode: code
                })
            })

            await sleep.millisecond(Math.floor(Math.random() * 10) * 200)
        }

        fs.writeFileSync(`${BasePath}/${provinceName}.json`, JSON.stringify(result))
        console.log(`${provinceName} completely`);
        
    }
}
// 只有要爬取 ucode 的时候，才有必要调用 collec() 函数，平时注释掉
// collect()

module.exports = {
    query: ucode
}