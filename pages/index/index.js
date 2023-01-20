import {
  login
} from '../../utils/common'
import {
  indexFlow
} from "../../utils/api";
import { getLoginInfo, setLoginInfo } from "../../utils/stoage"

//获取应用实例
const app = getApp();

Page({
  data: {
    lists: [],
    stopUse: false,
    phoneNumber: "999 9090",
    relieveTime: "",
    page: 1,
    list: [],
    total: 0,
    pagePara:''
  },
  callNum() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber,
    })
  },
  sure() {
    this.setData({
      stopUse: false
    })
  },
  onShow(){
    that.getData();
  },
  onLoad: async function (para) {
    this.setData({
      pagePara:para.look
    })
    if (wx.getStorageSync('loginInfo').relieveTime) {
      this.setData({
        relieveTime: wx.getStorageSync('loginInfo').relieveTime,
        stopUse: true
      })
    }
  },
  jump(e) {
    var loginInfo = getLoginInfo();
    if(loginInfo.phone==''||loginInfo.phone==null||loginInfo.phone==undefined){
      wx.showModal({
        title:'当前未授权手机号，请授权后进行体验',
        success:function(auth){
          if(auth.confirm){
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        }
      })
      return;
    }
    else if(loginInfo.wechatName==''||loginInfo.wechatName==null||loginInfo.wechatName==undefined){
      wx.showModal({
        title:'当前未完善您的头像和昵称，请完善后进行体验',
        success:function(auth){
          if(auth.confirm){
            wx.redirectTo({
              url: '/pages/auth/auth',
            })
          }
        }
      })
      return;
    }
    switch (e.currentTarget.dataset.type) {
      case 'my':
        wx.navigateTo({
          url: '/pages/my/index/index',
        })
        break;
      case "ztpd":
        wx.navigateTo({
          url: '/04zhutipaidui/index/index',
        })
        break;
      case "mrtp":
        wx.navigateTo({
          url: '/02meiritiaopin/index/index',
        })
        break;
      case "smts":
        wx.navigateTo({
          url: '/probe/index/index',
        })
        break;
    }
  },

  getData() {
    indexFlow({
      page: this.data.page,
      pageSize: 10
    }).then(res => {
      if (this.data.page == 1) {
        this.data.list = res.data.data.list;
      } else {
        this.data.list.concat(res.data.data.list);
      }
      this.setData({
        list: this.data.list,
        total: res.data.data.total
      })
      wx.stopPullDownRefresh()
    }).catch(err => {
      wx.showToast({
        title: '网络异常，请稍后重试',
        icon: 'error'
      })
      wx.hideLoading();
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.data.page = 1;
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.list.length < this.data.total) {
      this.data.page += 1;
      this.getData();
    }
  }
});
