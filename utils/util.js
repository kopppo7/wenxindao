import {
  getLoginInfo
} from "./stoage"

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const obj = {
    year,
    month,
    day,
    hour,
    minute,
    second,
    allTime: [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return obj
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

const recordSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log('授权成功');
            },
            fail() {
              console.log('用户拒绝了授权请求');

              wx.showModal({
                title: '提示',
                content: '您未授权录音，功能将无法使用',
                showCancel: true,
                confirmText: "授权",
                confirmColor: "#52a2d8",
                success: function (res) {
                  if (res.confirm) {
                    //确认则打开设置页面（重点）
                    wx.openSetting({
                      success: (res) => {
                        if (!res.authSetting['scope.record']) {
                          //未设置录音授权
                          wx.showModal({
                            title: '提示',
                            content: '您未授权录音，功能将无法使用',
                            showCancel: false,
                            success: function (res) {
                              console.log('进入设置页面未打开录音权限');

                              wx.reLaunch({
                                url: '/pages/index/index',
                              })
                            },
                          })
                        } else {
                          console.log('进入设置页面打开了录音权限');
                        }
                      },
                      fail: function () {}
                    })
                  } else if (res.cancel) {
                    console.log('还是不进行授权');
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                  }
                },
                fail: function () {}
              })
            }
          });
        } else {
          console.log('已经获得了麦克风权限');
        }
      }
    });
  });
};

const verifyLogin = () => {
  var loginInfo = getLoginInfo();
  if (loginInfo.phone == '' || loginInfo.phone == null || loginInfo.phone == undefined) {
    wx.showModal({
      title: '请登录授权进入下一步',
      success: function (auth) {
        if (auth.confirm) {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      }
    })
    return;
  } else if (loginInfo.wechatName == '' || loginInfo.wechatName == null || loginInfo.wechatName == undefined) {
    wx.showModal({
      title: '当前未完善您的头像和昵称，请完善后进行体验',
      success: function (auth) {
        if (auth.confirm) {
          wx.redirectTo({
            url: '/pages/auth/auth',
          })
        }
      }
    })
    return;
  }
}

module.exports = {
  formatTime: formatTime,
  recordSetting: recordSetting,
  verifyLogin: verifyLogin
};