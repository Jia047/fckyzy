const axios = require('axios')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const async = require('async')

const common = require('../services/common/common')
const sleep = require('../utils/sleep')
const log = require('../utils/log')

const provinces = JSON.parse(fs.readFileSync('./json/province.json', 'utf-8'))

const BasePath = './data/scoreLines/'
const logger = log.getLogger({
    filename: 'scoreLines'
})

/**
 * axios 置
 */
axios.defaults.baseURL = 'https://ia-pv4y.youzy.cn'

/**
 * 爬取各个省份的分数线 html 页面
 * 不可用
 */
async function crawlHtml() {
    logger.info('crawl html')
    let provinceName, encryptCode
    for (id in provinces) {
        provinceName = provinces[id]
        p = common.youzyEpt({ provinceId: id, provinceName: provinceName, isGaokaoVersion: false })
        tcode = common.youzyEpt({ provinceId: parseInt(id) })
        await axios.get('/scorelines/pcl', {
            params: {
                p: p, // 真是坏坏的参数
                tcode: tcode,
                toUrl: '/scorelines/pcl'
            }
        }).then(res => {
            res && fs.writeFileSync(`${BasePath}/html/${provinceName}.html`, res.data)
        })

        logger.info('crawl', provinceName)
        await sleep.millisecond(Math.floor(Math.random() * 10) * 200)
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
        logger.error(err)
    }
}

function parseHtmlDir() {
    logger.info('parse html dir')
    const dir = path.normalize(BasePath + '/html/')

    if (!fs.existsSync(dir)) {
        logger.info("directory not exists", dir)
        return
    }
    fs.readdir(dir, (err, files) => {
        const result = []
        let file
        for(let i = 0; i < files.length; i++) {
            file = files[i]
            parseHtml(path.normalize(`${dir}/${file}`), result)
        }

        fs.writeFileSync(path.normalize(`${BasePath}/json/score-lines.json`), JSON.stringify(result))
    })
}

// 1. 先爬
// crawlHtml()
// 2. 再提
// parseHtmlDir()

async.series([crawlHtml, parseHtmlDir], (err, result) => {
    err && logger.error(err)
    logger.info(result)
})