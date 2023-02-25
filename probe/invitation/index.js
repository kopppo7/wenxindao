import {
  findInviteById,
  appletsLogin,
  getUserMsg,
  receiveInvite,
  decodePhone,
  updateUserMsg
} from '../../utils/api'
import {
  getLoginInfo,
  setLoginInfo
} from "../../utils/stoage"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigPopStatus: false,
    isAuth: false,
    bigCardImgUrl: '',
    id: '',
    shareId: '',
    fissionInfo: {},
    headImg: '',
    nickName: ''
  },
  openBig (e) {
    this.setData({
      bigPopStatus: true
    })
  },
  showAuth () {
    this.setData({
      isAuth: true
    })
  },
  closeAuth () {
    this.setData({
      isAuth: false
    })
  },
  closePopBig () {
    this.setData({
      bigPopStatus: false
    })
  },
  chooseAvatar (e) {
    var that = this;
    wx.uploadFile({
      url: 'https://wenxin.duomixiong.com/user/oss/upload/uploadFile',
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
  login () {
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
  },
  getPhone (e) {
    wx.showLoading({
      title: '授权中...',
      mask: true
    })
    let that = this
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function (res) {
          decodePhone({
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            code: res.code
          }).then(res => {
            if (res.data.ret == 200) {
              let json = JSON.parse(res.data.data);
              let userInfo = getLoginInfo();
              userInfo = {
                phone: json.phoneNumber,
                wechatName: that.data.nickName,
                headImg: that.data.headImg,
              };
              setLoginInfo(userInfo);
              updateUserMsg({
                phone: json.phoneNumber,
                nickname: userInfo.wechatName,
                headimgurl: userInfo.headImg
              }).then(up => {
                wx.hideLoading();
                that.confirmLogin()
              })
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '授权失败，请稍后再试',
                icon: 'error'
              });
            }
          })
        }
      })
    } else {
      wx.hideLoading();
    }
  },

  confirmLogin () {
    wx.showLoading({
      title: '接受邀请中...',
      mask: true
    })
    receiveInvite(this.data.shareId).then((res) => {
      wx.navigateBack()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      id: options.id,
      shareId: options.shareId
    })
    findInviteById(options.shareId).then(res => {
      this.setData({
        fissionInfo: res.data.data
      })
    })
    wx.login({
      success: function (res) {
        var obj = {
          code: res.code,
          role: 1
        };
        appletsLogin(obj).then(res => {
          wx.setStorageSync('tokenKey', res.data.data.token);
          getUserMsg(res.data.data.token).then(userInfo => {
            if (userInfo.data.data.phone != null && userInfo.data.data.wechatName != null) {
              wx.navigateBack();
            }
          })
        })
      }
    });
  }
})