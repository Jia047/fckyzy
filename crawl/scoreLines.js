const axios = require('axios')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const common = require('../services/common/common.service')
const provinces = JSON.parse(fs.readFileSync('./province.json', 'utf-8'))
const BasePath = __dirname + '/score_lines'

/**
 * axios 配置
 */
axios.defaults.baseURL = 'https://ia-pv4y.youzy.cn'
axios.defaults.headers.common['Accept'] = '*/*'
axios.defaults.headers.common['User-Agent'] = 'PostmanRuntime/7.21.0'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'
axios.defaults.headers.common['Connection'] = 'close'

/**
 * 爬取各个省份的分数线 html 页面
 * 不可用
 */
async function crawlHtml() {
    let provinceName, encryptCode
    for (id in provinces) {
        provinceName = provinces[id]
        p = common.youzyEpt({provinceId: id, provinceName: provinceName, isGaokaoVersion: false})
        tcode = common.youzyEpt({ provinceId: parseInt(id) })
        await axios.get('/scorelines/pcl', {
            params: {
                p: p, // 真是坏坏的参数
                tcode: tcode,
                toUrl: '/scorelines/pcl'
            }
        }).then(res => {
            res && fs.writeFileSync(`${BasePath}/${provinceName}.html`, JSON.stringify(res.data))
        })

        console.log('crawl ==>', provinceName)

    }
}

/**
 * 解析html页面
 */
function parseHtml(htmlName, result) {

    try {
        const $ = cheerio.load(fs.readFileSync(htmlName))
        const basename = path.basename(htmlName)
        const province = basename.substring(0, basename.lastIndexOf('.'))
        $('table.pcl-list').each(function (index, element) {
            const trList = $(this).children('tbody').children('tr')
            const year = trList.eq(0).children('td').eq(0).text()
            // 批次线对象
            const pcls = {
                province: province,
                year: year,
                picis: []
            }

            let tds
            for (let i = 1; i < trList.length; i++) {
                tds = trList.eq(i).children('td')
                pcls.picis.push({
                    name: tds.eq(0).text(),
                    // 文科
                    wenke: tds.eq(1).text(),
                    // 理科
                    like: tds.eq(2).text()

                })
            }
            result.push(pcls)
        })
        
    } catch (err) {
        console.log(err)
    }
}

function parseHtmlDir(){
    const dir = path.normalize(__dirname + '/score_lines')
    if(!fs.existsSync(dir)){
        console.log("directory not exists", dir)
        return
    }
    fs.readdir(dir, (err, files) => {
        const result = []
        files.forEach(file => {
            if(path.extname(file) === '.html'){
                parseHtml(path.normalize(`${dir}/${file}`), result)
            }
        })
        fs.writeFile(path.normalize(`${dir}/score-lines.json`), JSON.stringify(result), err => console.log(err))
    })
}

// parseHtmlDir()
crawlHtml() 