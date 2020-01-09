define(['jquery', 'services/config'], function ($, config) {

    var service = {};

    //原生 单参数形式post请求
    service.basePost = function (url) {
        var promise = $.ajax({
            type: 'post',
            url: url
        });
        return promise;
    }    

    //原生 input形式post请求
    service.basePostFromBody = function (url, input) {
        input = JSON.stringify(input);
        var promise = $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: input,
            url: url
        });
        return promise;
    }

    //Data数据端 单参数形式post请求
    service.dataPost = function (url) {
        var promise = $.ajax({
            type: 'post',
            url: config.getDataApi(url)
        });
        return promise;
    }

    //Data数据端 input形式post请求
    service.dataPostFromBody = function (url, input) {
        input = JSON.stringify(input);
        var promise = $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: input,
            url: config.getDataApi(url)
        });
        return promise;
    }

    return service;

})