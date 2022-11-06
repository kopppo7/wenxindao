// pages/login/login.js
import {
  updateUserMsg,
  getUserMsg
} from "../../utils/api";
import {
  getLoginInfo,
  setLoginInfo
} from "../../utils/stoage"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },
  getUserInfo(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (e) => {
        updateUserMsg({
          nickname: e.userInfo.nickName,
          headimgurl: e.userInfo.avatarUrl,
          citys: e.userInfo.city
        }).then(res => {
          var userInfo = getLoginInfo();
          if (userInfo != null&&userInfo!='') {
            userInfo.wechatName = e.userInfo.nickName;
            userInfo.headImg = e.userInfo.avatarUrl
          } else {
            userInfo = {
              phone: '',
              wechatName: e.userInfo.nickName,
              headImg: e.userInfo.avatarUrl
            };
          }
          setLoginInfo(userInfo);
          if(userInfo.phone==''||userInfo.phone==null){
            wx.redirectTo({
              url: '/pages/auth/login',
            })
          }
        })
      }
    })
    
  }
})