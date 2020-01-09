/**
 * 智能推荐-自主填报
 */
// define(['jquery', 'services/config', 'services/base'],
//     function ($, config, baseService) {

//         var service = {};

        aesKeyFri = function () {
            return [46, 67, 8, 9, 10, 11];
        };

        aesKeySat = function () {
            return [12, 13, 14, 15, 16];
        };

        aesKey = function () {
            return [46, 67, 8, 9, 10, 11];
        };

        module.exports = {
            aesKeyFri: aesKeyFri,
            aesKey: aesKey,
            aesKeySat: aesKeySat
        }

    //     return service;

    // });