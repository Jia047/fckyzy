// 创建一些初始的文件夹，用来存放数据
const fs = require('fs')

const DATA = __dirname + '/crawl/data'
const PRE_FRACTION = `${DATA}/preFraction`
const COLLEGE_SCORE_LINES = `${DATA}/collegeScoreLines`
const PROFESSION_SCORE_LINES = `${DATA}/professionScoreLines`
const SCORE_LINES = `${DATA}/scoreLines`
// 提前批
const pre_html = `${PRE_FRACTION}/html`
const pre_json = `${PRE_FRACTION}/json`
const pre_dataDir = `${PRE_FRACTION}/data`
const pre_data_en = `${pre_dataDir}/encrypt`
const pre_data_de = `${pre_dataDir}/decrypt`

// 大学录取分数线
const col_html = `${COLLEGE_SCORE_LINES}/html`
const col_json = `${COLLEGE_SCORE_LINES}/json`
const col_data = `${COLLEGE_SCORE_LINES}/data`
const col_data_en = `${col_data}/encrypt`
const col_data_de = `${col_data}/decrypt`

// 各省份每年的批次线
const sco_html = `${SCORE_LINES}/html`
const sco_json = `${SCORE_LINES}/json`

const DIRS = [
    PRE_FRACTION, COLLEGE_SCORE_LINES, PROFESSION_SCORE_LINES, SCORE_LINES,
   
    pre_html, pre_json, pre_dataDir, pre_data_en, pre_data_de,

    col_html, col_json, col_data, col_data_de, col_data_en,

    sco_html, sco_json,

]

DIRS.forEach(dir => {
    
    if (!fs.existsSync(dir)) {
        console.log(dir)
        fs.mkdirSync(dir)
    }
})