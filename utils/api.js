import config from 'config.js';
import http from 'http.js';

function handleURL(url) {
    return config.getDomain + url;
}

// 接口地址命名加前缀 url，接口导出变量加前缀 api

// 此为演示接口，需要新增接口时仿照这个在下面新增即可
const urlLibraries = handleURL('/libraries.min.json');
export const apiLibraries = function (params) {
    return http.fetch(urlLibraries, params);
};
