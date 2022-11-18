import {
  appletsLogin,
  getUserMsg
} from "./api";
import { formatTime } from "./util";
import { getLoginInfo, setLoginInfo } from "./stoage"

export const login = (callback) => {
  let token = wx.getStorageSync('tokenKey');
  if (token == '' || token == null || token == undefined) {
    wx.showLoading({
      title: '数据获取中...',
      icon: 'loading',
      mask: true
    });
    wx.login({
      success: function (res) {
        var obj = {
          code: res.code,
          role: 1
        };
        appletsLogin(obj).then(res => {
          wx.hideLoading();
          wx.setStorageSync('tokenKey', res.data.data.token)
          checkLogInfo( res.data.data.token,callback);
        })
      }
    });
  } else {
    checkLogInfo(token,callback);
  }
}
export const checkLogInfo = (token,callback) => {
  getUserMsg(token).then(userInfo=>{
    var user = {
      phone:userInfo.data.data.phone,
      wechatName: userInfo.data.data.wechatName,
      headImg : userInfo.data.data.headImg,
      yunToken : userInfo.data.data.yunToken,
      yunId : userInfo.data.data.yunId,
    };
    setLoginInfo(user);
    if(user.wechatName==''||user.wechatName==null||user.wechatName==undefined){
      wx.redirectTo({
        url: '/pages/auth/auth',
      })
      return;
    }
    else if(user.phone==''||user.phone==null||user.phone==undefined){
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return;
    }
    if (typeof callback == 'function') {
      callback(token);
    }
  })
}