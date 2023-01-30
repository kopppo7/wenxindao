// pages/login/login.js
import {
  decodePhone,
  updateUserMsg,
  getUserMsg,
  appletsLogin 
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
        that.setData({
            agreeStatus: !that.data.agreeStatus
        })
    },
    getPhone(e) {
      if(!this.data.agreeStatus){
        wx.showToast({
          title: '请先阅读并勾选《用户服务协议》和《隐私协议保护协议》',
          icon:'none',
        })
        return;
      }
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
                  var json =JSON.parse(res.data.data);
                  var token = wx.getStorageSync('tokenKey');
                  getUserMsg(token).then(customer=>{
                    var userInfo = customer.data.data;
                    userInfo.phone = json.phoneNumber;
                    setLoginInfo(userInfo);
                    if(userInfo.wechatName==''||userInfo.wechatName==null){
                      wx.redirectTo({
                        url: '/pages/auth/auth',
                      })
                    }else{
                      updateUserMsg({
                        phone:json.phoneNumber,
                        nickname:userInfo.wechatName,
                        headimgurl:userInfo.headImg
                      }).then(up=>{
                        wx.hideLoading();
                        wx.redirectTo({
                          url: '/pages/index/index',
                        })
                      })
                    }
                  })
                } else{
                  wx.hideLoading();
                  wx.showToast({
                    title: '授权失败，请稍后再试',
                    icon:'error'
                  });
                }
              })
            }
          })
        }else{
          wx.hideLoading();
        }
    },
    telLogin() {
        wx.navigateTo({
            url: '/pages/telLogin/index',
        })
    },
    lookSelf() {
      wx.navigateTo({
        url: '/pages/index/index?look=casual',
      })
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
    }
})