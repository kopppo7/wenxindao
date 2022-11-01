import config from 'config.js';
import http from 'http.js';

function handleURL(url) {
    return config.getDomain + url;
}

// 接口地址命名加前缀 url，接口导出变量加前缀 api

// 登录相关

// 小程序登陆
export const appletsLogin = function (params) {
    return http.post(handleURL('/appletsLogin'), params);
};

// 同步小程序用户信息
export const updateUserMsg = function (params) {
    return http.post(handleURL('/updateUserMsg'), params);
};

// 获取当前登录人信息
export const getUserMsg = function (params) {
    return http.get(handleURL('/getUserMsg'), params);
};

// 用户退出
export const userLoginOut = function (params) {
    return http.get(handleURL('/userLoginOut'), params);
};

// 登录发送验证码
export const sendCode = function (params) {
    return http.get(handleURL('/sendCode'), params);
};

// 修改手机号绑定发送验证码
export const sendCodeForUpdate = function (params) {
    return http.get(handleURL('/sendCodeForUpdate'), params);
};

// 手机号登录
export const phoneLogin = function (params) {
    return http.get(handleURL('/phoneLogin'), params);
};

// 修改当前手机号
export const updatePhone = function (params) {
    return http.get(handleURL('/updatePhone'), params);
};

// 更改用户IM基础信息
export const updateImMsg = function (params) {
    return http.get(handleURL('/updateImMsg'), params);
};

