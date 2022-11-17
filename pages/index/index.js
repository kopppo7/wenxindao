import { login } from '../../utils/common'

//获取应用实例
const app = getApp();

Page({
    data: {
        lists: [],
        stopUse:false,
        phoneNumber:"999 9090",
        relieveTime:""
    },
    callNum(){
      wx.makePhoneCall({
        phoneNumber: this.data.phoneNumber,
      })
    },
    sure(){
      this.setData({
        stopUse:false
      })
    },
    onLoad: async function () {
      await login();
      if (wx.getStorageSync('loginInfo').relieveTime) {
        this.setData({
          relieveTime:wx.getStorageSync('loginInfo').relieveTime,
          stopUse:true
        })
      }
    },

});
