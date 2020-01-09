/**
 * 智能推荐-专业优先
 */
// define(['jquery', 'services/config', 'services/base', 'services/tzy/tzyManualFill'],
//     function ($, config, baseService, tzyManualFill) {

//         var service = {};
        const tzyManualFill = require('./tzyManualFill.service')

        aesKeyMon = function () {
            var key = [46, 67, 9, 9, 10, 11];
            return key.concat(tzyManualFill.aesKeyMon());
        };

        aesKey = function () {
            var key = [46, 67, 8, 9, 10, 11];
            return key.concat(tzyManualFill.aesKeySat());
        };

        aesKeyTus = function () {
            var key = [46, 67, 8, 11, 10, 11];
            return key.concat(tzyManualFill.aesKeyTus());
        };

        module.exports = {
            aesKeyMon: this.aesKeyMon,
            aesKey: aesKey,
            aesKeyTus: aesKeyTus
        }
    //     return service;

    // });