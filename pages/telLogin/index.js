import {
  sendCode,
  phoneLogin,
  updateUserMsg
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
    numArr: ['+86', '+87'],
    telphone: "",
    msg: "",
    activeNum: '+86',
    downTime: 60,
    disabled: false,
    codebtn: "获取验证码",
    code: "",
    key: "",
  },
  bindPickerChange(e) {
    this.setData({
      activeNum: this.data.numArr[e.detail.value]
    })
  },
  getMsg(e) {
    this.setData({
      msg: e.detail.value
    })
  },
  // 获取输入账号 
  testPhone: function (e) {
    let phone = e.detail.value;
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: "none",
        duration: 2000
      })
      return false;
    }
    this.setData({
      telphone: e.detail.value
    })
  },
  //发送验证码
  sendcode(res) {
    var phone = this.data.telphone;
    var time = 60;
    var that = this;
    sendCode({
      phone: phone
    }).then(res => {
      if (res.data.ret == 200) {
        wx.showToast({
          title: '验证码已发送.请注意接收',
          icon: "success"
        })

        var timers = setInterval(function () {
          time--;
          if (time > 0) {
            that.setData({
              codebtn: time + 's后重新获取',
              disabled: true
            });
          } else {
            that.setData({
              codebtn: '获取验证码',
              disabled: false
            });
            clearInterval(timers)
          }
        }, 1000)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none",
          duration: 2000
        })
      }
      this.setData({
        key: res.data.data,
      })
    })

  },
  // 登录处理
  login(e) {
    var phone = this.data.telphone
    var code = this.data.msg
    var key = this.data.key
    phoneLogin({
      phone,
      code,
      key
    }).then(res => {
      if (res.data.ret == 200) {
        var userInfo = getLoginInfo();
        if (userInfo != null && userInfo != '') {
          userInfo.phone = phone;
        } else {
          userInfo = {
            phone: phone,
            wechatName: '',
            headImg: ''
          };
        }
        setLoginInfo(userInfo);
        if (userInfo.wechatName == '' || userInfo.wechatName == null) {
          wx.redirectTo({
            url: '/pages/auth/auth',
          })
        } else if(wx.getStorageSync('roomPath')) {
            // 如果是好友房间邀请登录
            let roomPath = wx.getStorageSync('roomPath')
            wx.navigateTo({
              url: '/04zhutipaidui/tansuo/tansuo?askId=' + roomPath.askId + '&isMatch=' + roomPath.isMatch + '&isfriend=' + roomPath.isfriend + '&roomId=' + roomPath.roomId
            })
        } else {
          updateUserMsg({
            phone: phone,
            nickname: userInfo.wechatName,
            headimgurl: userInfo.headImg
          }).then(up => {
            wx.hideLoading();
            wx.redirectTo({
              url: '/pages/index/index',
            })
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none",
          duration: 2000
        })
      }
    })
  }
})