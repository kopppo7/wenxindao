import config from '../utils/config';
import http from '../utils/http.js';

function handleURL(url) {
    return config.getDomain + url;
}


// (生命探索&主题派对）分类
export const categoryList = function (data) {
    return http.get(handleURL('/category/list'), data);
};
// 查询主题派对列表
export const getAskPartyList = function (data) {
    return http.post(handleURL('/askParty/getAskPartyList'), data);
};

// 查看主题派对详情
export const findByAskPartyOne = function (data) {
    return http.get(handleURL('/askParty/findByAskPartyOne'), data);
};

// 获取某个生命探索下的评价
export const evaluateList = function (data) {
    return http.post(handleURL('/probe/evaluateList'), data);
};

// 新增评价
export const insertEvaluate = function (data) {
    return http.post(handleURL('/probe/insertEvaluate'), data);
};
// 更改用户IM基础信息
export const updateImMsg = function (data) {
    return http.post(handleURL('/updateImMsg'), data);
};

