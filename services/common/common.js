// //优志愿业务通用service
// define('common.service',['jquery', 'services/config', 'services/common/youzyEpt', 'services/tzy/tzyCollegeFirst'],
//     function ($, configService, youzyEptService, tzyCollegeFirst) {

// var service = {};

//返回当前高考年
// service.getGaokaoyear = function () {
//     var currentYear = new Date().getFullYear();
//     var currentMonth = new Date().getMonth() + 1;
//     var currentDay = new Date().getDate();
//     if (currentMonth >= 8) {
//         var oldDate = new Date(Date.parse(currentYear + '/08/15'));
//         var newDate = new Date(Date.parse((currentYear + '/' + currentMonth + '/' + currentDay)));
//         if (newDate >= oldDate) {
//             currentYear = currentYear + 1;
//         }
//     }
//     return currentYear;
// };
/**
 * 请求加密方法
 */
const configService = require('../config')
const youzyEptService = require('./youzyEpt')
const tzyCollegeFirst = require('../tzy/tzyCollegeFirst.service')

youzyEpt = function (data) {
    if (configService.isEncrypt == false) {
        return JSON.stringify(data);
    } else {
        var text = JSON.stringify(data);
        var textBytes = youzyEptService.utils.utf8.toBytes(text);
        var aesCtr = new youzyEptService.ModeOfOperation.ctr(tzyCollegeFirst.aesKey(), new youzyEptService.Counter(5));
        var encryptedBytes = aesCtr.encrypt(textBytes);
        var encryptedHex = youzyEptService.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    }
}

/**
 * number encrypt
 */
eval(function (p, a, c, k, e, d) {
    e = function (c) {
        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) d[e(c)] = k[c] || e(c);
        k = [function (e) {
            return d[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1;
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p;
}('4 5=3(2){4 1="";2.7("|").6(3(0){0=0.b(/[c-d]/8,"");1+="&#9"+0+";"});a 1}', 14, 14, 'value|number|myNumbers|function|var|showNumber|forEach|split|ig|x|return|replace|g|t'.split('|'), 0, {}))

/**
 * cn encrypt
 */
var _cnDeCrypt = function (zlVjhiyMm1) {
    var YB2 = "";
    zlVjhiyMm1['\x73\x70\x6c\x69\x74']("\x7c")['\x66\x6f\x72\x45\x61\x63\x68'](function ($lvd3) {
        if ($lvd3['\x73\x65\x61\x72\x63\x68'](/【(.*?)】/) != -1) {
            // YB2 += $lvd3['\x72\x65\x70\x6c\x61\x63\x65']("\u3010", "")['\x72\x65\x70\x6c\x61\x63\x65']("\u3011", "") + "\x3b"
            // YB2 += $lvd3['\x72\x65\x70\x6c\x61\x63\x65'] + "\x3b"
            YB2 += $lvd3 + "\x7c"
        } else {
            $lvd3 = $lvd3['\x72\x65\x70\x6c\x61\x63\x65'](/[g-t]/ig, "");
            YB2 += "\x26\x23\x78" + $lvd3 + "\x7c"
        }
    });
    return YB2
}

// service.currentGaokaoyear = service.getGaokaoyear();
// service.cnDeCrypt = service._cnDeCrypt;
// service.showNumber = service.showNumber;

module.exports = {
    showNumber: showNumber,
    cnDeCrypt: _cnDeCrypt,
    youzyEpt: youzyEpt
}
    //     return service;

    // });