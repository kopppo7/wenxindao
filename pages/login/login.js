// pages/login/login.js
import {
  decodePhone,
  updateUserMsg
} from "../../utils/api";
import {
  getLoginInfo,
  setLoginInfo
} from "../../utils/stoage"
import { login } from '../../utils/common'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        agreeStatus: true,
        useInfor: {
            phone: "",
            nickname: "",
            headimgurl: "",
            citys: "",
        }
    },

    clickAgree() {
        var that = this;
        console.log(that.data.agreeStatus);
        that.setData({
            agreeStatus: !that.data.agreeStatus
        })
    },
    getPhone(e) {
      wx.showLoading({
        title: '授权中...',
      })
        if (e.detail.errMsg == "getPhoneNumber:ok") {
          wx.login({
            success: function (res) {
              decodePhone({
                iv: e.detail.iv,
                encryptedData:e.detail.encryptedData,
                code:res.code
              }).then(res=>{
                if(res.data.ret==200){
                  login();
                  // var json =JSON.parse(res.data.data);
                  // var userInfo = getLoginInfo();
                  // if (userInfo != null&&userInfo!='') {
                  //   userInfo.phone = json.phoneNumber;
                  // } else {
                  //   userInfo = {
                  //     phone: json.phoneNumber,
                  //     wechatName: '',
                  //     headImg: ''
                  //   };
                  // }
                  // setLoginInfo(userInfo);
                  // if(userInfo.wechatName==''||userInfo.wechatName==null){
                  //   wx.redirectTo({
                  //     url: '/pages/auth/auth',
                  //   })
                  // }else{
                  //   updateUserMsg({
                  //     phone:json.phoneNumber,
                  //     nickname:userInfo.wechatName,
                  //     headimgurl:userInfo.headImg
                  //   }).then(up=>{
                  //     wx.hideLoading();
                  //     wx.redirectTo({
                  //       url: '/pages/index/index',
                  //     })
                  //   })
                  // }
                }else{
                  wx.hideLoading();
                  wx.showToast({
                    title: '授权失败，请稍后再试',
                    icon:'error'
                  });
                }
              })
            }
          })
        }
    },
    telLogin() {
        wx.navigateTo({
            url: '',
        })
    },
    lookSelf() {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this;
        if (wx.getStorageSync('tokenKey')) {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        } else {
          wx.getSetting({
              success(res) {
                  if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                      let user = {};
                      wx.getUserInfo({
                          success: function(res) {
                              console.log(res.userInfo)
                              user.nickname = res.userInfo.nickName
                              user.headimgurl = res.userInfo.avatarUrl
                              user.citys = res.userInfo.city
                              that.setData({
                                  useInfor: user
                              })
                          }
                      })
                  }
              }
          })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})