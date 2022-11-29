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
  getUserInfo(e) {
    updateUserMsg({
      nickname: '体验用户',
      headimgurl: 'https://img2.woyaogexing.com/2022/11/28/bf554d5b02b84477868eebae2ad48930.jpg',
      citys:''
    }).then(res => {
      var userInfo = getLoginInfo();
      if (userInfo != null&&userInfo!='') {
        userInfo.wechatName = '体验用户';//e.userInfo.nickName;
        userInfo.headImg = 'https://img2.woyaogexing.com/2022/11/28/bf554d5b02b84477868eebae2ad48930.jpg';//e.userInfo.avatarUrl
      } else {
        userInfo = {
          phone: '',
          wechatName: '体验用户',//e.userInfo.nickName,
          headImg:'https://img2.woyaogexing.com/2022/11/28/bf554d5b02b84477868eebae2ad48930.jpg'// e.userInfo.avatarUrl
        };
      }
      setLoginInfo(userInfo);
      if(userInfo.phone==''||userInfo.phone==null){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
    // wx.getUserProfile({
    //   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (e) => {
    //     updateUserMsg({
    //       nickname: e.userInfo.nickName,
    //       headimgurl: e.userInfo.avatarUrl,
    //       citys: e.userInfo.city
    //     }).then(res => {
    //       var userInfo = getLoginInfo();
    //       if (userInfo != null&&userInfo!='') {
    //         userInfo.wechatName = e.userInfo.nickName;
    //         userInfo.headImg = e.userInfo.avatarUrl
    //       } else {
    //         userInfo = {
    //           phone: '',
    //           wechatName: e.userInfo.nickName,
    //           headImg: e.userInfo.avatarUrl
    //         };
    //       }
    //       setLoginInfo(userInfo);
    //       if(userInfo.phone==''||userInfo.phone==null){
    //         wx.redirectTo({
    //           url: '/pages/login/login',
    //         })
    //       }
    //     })
    //   }
    // })
    
  }
})