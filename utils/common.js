import {
  appletsLogin,
  getUserMsg,
  updateUserMsg
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
          wx.redirectTo({
            url: '/pages/index/index',
          })
        })
      }
    });
  } else {
    checkLogInfo(token,callback);
  }
}
export const checkLogInfo = (token,callback) => {
  getUserMsg(token).then(userInfo=>{
    if(userInfo.data.ret == 201 ) {
      wx.redirectTo({
        url: '/pages/auth/auth',
      })
      return;
      // userInfo.data={
      //   data:{
      //     wechatName:'体验用户',
      //     headImg:'',
      //   }
      // }
      // updateUserMsg({
      //   nickname:'体验用户',
      //   headimgurl:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.duoziwang.com%2Fuploads%2Fc160225%2F14563MJ1I0-14553.jpg&refer=http%3A%2F%2Fimg.duoziwang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1672299666&t=f4c4191bda572dcee5e726638aceac44',
      //   citys: ''
      // })
    }
    var user = {
      phone:userInfo.data.data.phone,
      wechatName: userInfo.data.data.wechatName,
      headImg : userInfo.data.data.headImg,
      yunToken : userInfo.data.data.yunToken,
      yunId : userInfo.data.data.yunId,
    };
    setLoginInfo(userInfo.data.data);
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