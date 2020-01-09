//
//当前工作上下文
//
define(['jquery', 'cookie'], function ($) {

    var service = {};

    //省份信息
    if ($.cookie('YouzyPV_currentProvince') != undefined) {
        service.currentProvince = JSON.parse($.cookie('YouzyPV_currentProvince'));
    } else {
        service.currentProvince = {};
    }

    //设备来源信息
    if ($.cookie('YouzyPV_deviceFromSource') != undefined) {
        service.dfs = JSON.parse($.cookie('YouzyPV_deviceFromSource'));
    } else {
        service.dfs = {};
    }

    //用户信息
    if ($.cookie('YouzyPV_currentUser') != undefined) {
        service.currentLoginUser = JSON.parse($.cookie('YouzyPV_currentUser'));
    } else {
        service.currentLoginUser = {};
    }

    //用户成绩信息
    if ($.cookie('YouzyPV_currentScore') != undefined) {
        service.currentScore = JSON.parse($.cookie('YouzyPV_currentScore'));
    } else {
        service.currentScore = {};
    }

    return service;

});