import { apiLibraries } from '../../utils/api.js'

//获取应用实例
const app = getApp();

Page({
    data: {
        lists: []
    },
    onLoad: function () {

        // AJAX 演示接口使用演示
        apiLibraries({
            whatever: 'bulabula'
        }).then((response) => {
            // 根据状态码处理业务逻辑
            if (response.statusCode === 200) {
                this.setData({
                    lists: response.data
                })
            }
        }).catch((error) => {
            // 请求出错时执行
            console.log(error);
        }).finally(() => {
            // 无论请求状态如何，最后都会执行
            console.log('我请求完了')
        });

    }
});
