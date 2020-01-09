/**
 * 提前批
 */

define(['jquery', 'services/base', 'services/common/common'], function ($, baseService,commonService) {
    var service = {};

    //查询提前批顶部筛选条件数据
    service.queryFilter = function (input) {
        var letInput = {
            data: commonService.youzyEpt(input)
        }
        return baseService.dataPostFromBody('/TZY/PreFraction/QueryFilter', letInput)
    };

    //查询提前批数据
    service.query = function (input) {
        var letInput = {
            data: commonService.youzyEpt(input)
        }
        return baseService.dataPostFromBody('/TZY/PreFraction/Query', letInput)
    };

    //查询提前批数据
    service.queryWithApp = function (input) {
        var letInput = {
            data: commonService.youzyEpt(input)
        }
        return baseService.dataPostFromBody('/TZY/PreFraction/QueryWithApp', letInput)
    };

    //根据院校编号或关键词查询提前批数据
    service.queryByCollegeOrKeyWord = function (input) {
        var letInput = {
            data: commonService.youzyEpt(input)
        }
        return baseService.dataPostFromBody('/TZY/PreFraction/QueryByCollegeOrKeyWord', letInput)
    };

    //是否存在提前批数据
    service.isExist = function (collegeId, provinceId) {
        return baseService.dataPost(' /TZY/PreFraction/IsExist?collegeId=' + collegeId + '&provinceId=' + provinceId);
    };
    


    return service;

});