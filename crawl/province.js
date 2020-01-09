/**
 * 解析省份html，取出省份及其对应的id
 */
const cheerio = require('cheerio')
const fs = require('fs')

const $ = cheerio.load(fs.readFileSync('./html/province.html'))

const provinces = {}
$('a.js-selectProvince').each(function (index, element) {
    const id = $(this).attr('data-numid')
    const name = $(this).attr('data-name')
    provinces[id] = name
})

fs.writeFileSync('./json/province.json', JSON.stringify(provinces))