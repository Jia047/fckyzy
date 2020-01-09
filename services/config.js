//
//全局配置
//
// define([], function () {

var config = {
    isRelease: true,
    isEncrypt: true, //是否开启数据加密
    staticUrl: '',
    apiToB: '/ToB/',
    apiData: '/Data/'
};

getToBApi = function (apiUrl) {
    var soaHost = apiToB;
    var value = (soaHost.endsWith('/') ? soaHost : soaHost + '/') + (apiUrl.startsWith('/') ? apiUrl.substring(1, apiUrl.length) : apiUrl);
    return value;
}

getDataApi = function (apiUrl) {
    var soaHost = apiData;
    var value = (soaHost.endsWith('/') ? soaHost : soaHost + '/') + (apiUrl.startsWith('/') ? apiUrl.substring(1, apiUrl.length) : apiUrl);
    return value;
}

module.exports = {
    config: config,
    getToBApi: getToBApi,
    getDataApi: getDataApi
}

//     return config;

// });