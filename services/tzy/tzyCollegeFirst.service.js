/**
 * 智能推荐-专业优先
 */
// define(['jquery', 'services/config', 'services/base', 'services/tzy/tzyMajorFirst'],
//     function ($, config, baseService, tzyMajorFirst) {

//         var service = {};
const tzyMajorFirst = require('./tzyMajorFirst.service')
aesKeyFuture = function () {
    var key = [46, 67, 8, 9, 10, 11];
    return key.concat(tzyMajorFirst.aesKey());
};

aesKeyPast = function () {
    var key = [46, 67, 8, 9, 10, 11];
    return key.concat(tzyMajorFirst.aesKey());
};

aesKey = function () {
    var key = [11, 23, 32, 43, 45];
    return key.concat(tzyMajorFirst.aesKey());
};


module.exports = {
    aesKeyFuture: aesKeyFuture,
    aesKeyPast: aesKeyPast,
    aesKey: aesKey
}
    //     return service;

    // });