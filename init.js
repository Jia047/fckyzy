// 创建一些初始的文件夹，用来存放数据
const fs = require('fs')

const PRE_FRACTION = 'crawl/preFraction/'
const COLLEGE_SCORE_LINES = 'crawl/collegeScoreLines/'
const PROFESSION_SCORE_LINES = 'crawl/professionScoreLines/'
const SCORE_LINES = 'crawl/scoreLines/'

const pre_html = `${PRE_FRACTION}/html`
const pre_json = `${PRE_FRACTION}/json`
const pre_dataDir = `${PRE_FRACTION}/data`
const pre_data_en = `${pre_dataDir}/encrypt`
const pre_data_de = `${pre_dataDir}/decrypt`



const DIRS = [
    PRE_FRACTION, COLLEGE_SCORE_LINES, PROFESSION_SCORE_LINES, SCORE_LINES,
   
    pre_html, pre_json, pre_dataDir, pre_data_en, pre_data_de,


]

DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
})