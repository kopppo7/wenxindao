const _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
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
    nickName: '',
    headImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
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
  chooseAvatar (e) {
    var that = this;
    wx.uploadFile({
      url: 'https://wenxin.wxdao.net/user/oss/upload/uploadFile',
      filePath: e.detail.avatarUrl,
      name: 'file',
      header: {
        "token": wx.getStorageSync('tokenKey')
      },
      success: function (res) {
        var uploadRet = JSON.parse(res.data);
        if (uploadRet.ret == 200) {
          that.setData({
            headImg: uploadRet.data
          })
        } else {
          wx.showToast({
            title: '头像上传失败',
          })
        }
      }
    })
  },
  getNick (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  getNickChange (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  randomUserInfo () {
    let min = 0,
      max = _charStr.length - 1,
      _str = '';
    let len = 7;
    //循环生成字符串
    for (var i = 0, index; i < len; i++) {
      index = this.RandomIndex(min, max, i);
      _str += _charStr[index];
    }
    // this.setData({
    //   nickName: "wenxin" + _str,
    //   headImg: "https://wenxin-file.oss-cn-beijing.aliyuncs.com/system/images/avatar0.jpg"
    // })
    let nickName = "wxd" + _str;
    let headImg = "https://wenxin-file.oss-cn-beijing.aliyuncs.com/system/images/avatar0.jpg";
    var token = wx.getStorageSync('tokenKey');
    wx.showLoading({
      title: '随机生成头像昵称..',
    })
    var yao_qing_op = null;
    if(wx.getStorageSync('yao_qing_option')){
      yao_qing_op = JSON.parse(wx.getStorageSync('yao_qing_option'));
    }
    getUserMsg(token).then(customer => {
      var userInfo = customer.data.data;
      userInfo.wechatName = nickName;
      userInfo.rname = nickName;
      userInfo.headImg = headImg;
      updateUserMsg({
        nickname: nickName,
        headimgurl: headImg
      }).then(res => {
        if (res.data.ret != 200) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          setLoginInfo(userInfo);
          if (userInfo.phone == '' || userInfo.phone == null) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else if(yao_qing_op) {
            wx.navigateTo({
              url: `/04zhutipaidui/yao_qing/index?askId=${yao_qing_op.askId}&roomId=${yao_qing_op.roomId} `,
            })
          } else {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    })
  },
  RandomIndex (min, max, i) {
    let index = Math.floor(Math.random() * (max - min + 1) + min),
      numStart = _charStr.length - 10;
    //如果字符串第一位是数字，则递归重新获取
    if (i == 0 && index >= numStart) {
      index = RandomIndex(min, max, i);
    }
    //返回最终索引值
    return index;
  },
  getUserInfo (e) {
    if (!this.data.headImg) {
      wx.showToast({
        title: '请先上传头像',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.nickName) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var token = wx.getStorageSync('tokenKey');
    var yao_qing_op =null;
    if(yao_qing_op){
      yao_qing_op = JSON.parse(wx.getStorageSync('yao_qing_option'));
    }
    getUserMsg(token).then(customer => {
      var userInfo = customer.data.data;
      userInfo.wechatName = this.data.nickName;
      userInfo.rname = this.data.nickName;
      userInfo.headImg = this.data.headImg;
      updateUserMsg({
        nickname: this.data.nickName,
        headimgurl: this.data.headImg
      }).then(res => {
        if (res.data.ret != 200) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          setLoginInfo(userInfo);
          if (userInfo.phone == '' || userInfo.phone == null) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else if(yao_qing_op) {
            wx.navigateTo({
              url: `/04zhutipaidui/yao_qing/index?askId=${yao_qing_op.askId}&roomId=${yao_qing_op.roomId} `,
            })
          } else {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    })
  }
})