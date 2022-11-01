import config from 'config.js';
import http from 'http.js';

function handleURL(url) {
    return config.getDomain + url;
}


// 新增每日调频
export const addFm = function (data) {
    return http.post(handleURL('/askfm/addFm'), data);
};

// 查询自己每日调频记录
export const findByFmForUser = function (data) {
    return http.post(handleURL('/askfm/findByFmForUser'), data);
};


// 随机查询今日随机卡牌
export const getDayCard = function (data) {
    return http.get(handleURL('/askfm/getDayCard'), data);
};


// 检查文档是否合规
export const inspectText = function (data) {
    return http.post(handleURL('/askfm/inspectText'), data);
};


// 查询当天签到人数
export const dayForSignNumber = function (data) {
    return http.get(handleURL('/askfm/dayForSignNumber'), data);
};


// 查询本人连续签到次数
export const findByIsFlagNumber = function (data) {
    return http.get(handleURL('/askfm/findByIsFlagNumber'), data);
};
