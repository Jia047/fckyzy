const common = require('../services/common/common')
// 字体解析
const word_map = require('./word-map')
const num_map = word_map.num_map
const cn_map = word_map.cn_map
// 
const rules = /&#x(.*?);/
const CHINESE = /[\u4e00-\u9fa5]/
// const CHARACTER = /[,，\.。()（）、/；;：:%〔〕“”&]/
const CHARACTER = /【(.*?)】/


function subStr(str) {
    str = str + ''
    return str.substring(0, str.length - 1)
}
function toUni(str) {
    return str.replace(/&#x/g, '')
}
/**
 * 解析中文密文
 */
function parseCN(encryptCN) {
    let result = ''
    if (encryptCN === undefined || encryptCN === '' || encryptCN.match('-')) {
        return result
    }
    // 先将密文转化为 &#x(.*); 形如 上;&#xc6bb;&#xc6bb;&#xc62b;&#xc66f;&#xc674;
    // 这里会将最后一个分号去掉，使用 slice(0, -1)
    const decryptCN = common.cnDeCrypt(subStr(encryptCN)).slice(0, -1)
    // 将 decryptCN 按【;】分割成数组，再将每个元素转化成 unicode 形式
    // 然后在映射表中找到对应的中文

    decryptCN.split('|').forEach(s => {
        // 如果本身就是中文，则不用进行映射转换
        // if (CHINESE.test(s)) {
        //     result += s
        // } else 
        if (CHARACTER.test(s)) {
            str = s.replace(/【|】/gm, '')

            result += str
        } else {
            result += cn_map[toUni(s)]
        }
    })
    return result;
}

/**
 * 解析数字密文，步骤类似于解析中文密文
 */
function parseNUM(encryptNUM) {
    let result = ''

    if (encryptNUM === undefined || encryptNUM === ''
        || encryptNUM === 0 || encryptNUM.match('-')) {
        return result
    }

    const decryptNUM = common.showNumber(subStr(encryptNUM)).slice(0, -1)
    decryptNUM.split(';').forEach(s => {
        result += num_map[toUni(s)]
    })

    return result
}

// 测试用例
// const s = '【低】|【于】|c7qsnl16|【.】|cp71krs9|【;】|【男】|tctq6ic7|【身】|'
// console.log(parseCN(s));


module.exports = {
    parseCN: parseCN,
    parseNUM: parseNUM
}