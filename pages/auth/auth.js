// pages/login/login.js
import {
  updateUserMsg,
  getUserMsg,
  appletsLogin 
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
    nickName:'',
    headImg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.login({
      success: function (res) {
        var obj = {
          code: res.code,
          role: 1
        };
        appletsLogin(obj).then(res => {
          wx.setStorageSync('tokenKey', res.data.data.token);
        })
      }
    });
  },
  chooseAvatar(e){
    var that = this;
    wx.uploadFile({
      url:'https://www.wxdao.net/user/oss/upload/uploadFile',
      filePath:e.detail.avatarUrl,
      name:'file',
      header:{
        "token":wx.getStorageSync('tokenKey')
      },
      success:function(res){
        var uploadRet = JSON.parse(res.data);
        if(uploadRet.ret==200){
          that.setData({
            headImg:uploadRet.data
          })
        }else{
          wx.showToast({
            title: '头像上传失败',
          })
        }
      }
    })
  },
  getNick(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  getNickChange(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  getUserInfo(e) {
    if(!this.data.headImg) {
      wx.showToast({
        title: '请先上传头像',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!this.data.nickName) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 2000
      })
      return
    }
    updateUserMsg({
      nickname: this.data.nickName,
      headimgurl: this.data.headImg,
      citys:''
    }).then(res => {
      if(res.data.ret!=200){
        wx.showToast({
          title: res.data.msg,
        })
      }
      var userInfo = getLoginInfo();
      if (userInfo != null&&userInfo!='') {
        userInfo.wechatName = this.data.nickName;//e.userInfo.nickName;
        userInfo.headImg = this.data.headImg;//e.userInfo.avatarUrl
      } else {
        userInfo = {
          phone: '',
          wechatName: this.data.nickName,//e.userInfo.nickName,
          headImg:this.data.headImg// e.userInfo.avatarUrl
        };
      }
      setLoginInfo(userInfo);
      if(userInfo.phone==''||userInfo.phone==null){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
  }
})