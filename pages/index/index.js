import { login } from '../../utils/common'

//获取应用实例
const app = getApp();

Page({
    data: {
        lists: []
    },
    onLoad: function () {
      login();
    },

});
