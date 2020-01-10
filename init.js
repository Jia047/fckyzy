// 创建一些初始的文件夹，用来存放数据
const fs = require('fs')

const DATA = __dirname + '/crawl/data'
const PRE_FRACTION = `${DATA}/preFraction`
const COLLEGE_SCORE_LINES = `${DATA}/collegeScoreLines`
const PROFESSION_SCORE_LINES = `${DATA}/professionScoreLines`
const SCORE_LINES = `${DATA}/scoreLines`

const pre_html = `${PRE_FRACTION}/html`
const pre_json = `${PRE_FRACTION}/json`
const pre_dataDir = `${PRE_FRACTION}/data`
const pre_data_en = `${pre_dataDir}/encrypt`
const pre_data_de = `${pre_dataDir}/decrypt`

const col_html = `${COLLEGE_SCORE_LINES}/html`
const col_json = `${COLLEGE_SCORE_LINES}/json`

const sco_html = `${SCORE_LINES}/html`
const sco_json = `${SCORE_LINES}/json`

const DIRS = [
    PRE_FRACTION, COLLEGE_SCORE_LINES, PROFESSION_SCORE_LINES, SCORE_LINES,
   
    pre_html, pre_json, pre_dataDir, pre_data_en, pre_data_de,

    col_html, col_json,

    sco_html, sco_json,

]

DIRS.forEach(dir => {
    console.log(dir);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
})