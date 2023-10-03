import {
  login
} from '../../utils/common'
import {
  indexFlow,
  getUserMsg,
  appletsLogin
} from "../../utils/api";
import {
  getLoginInfo,
  setLoginInfo
} from "../../utils/stoage"

//获取应用实例
const app = getApp();

Page({
  data: {
    privacyContractName: '《问心岛隐私保护指引》',
    showPrivacy: false,
    lists: [],
    stopUse: false,
    phoneNumber: "999 9090",
    relieveTime: "",
    page: 1,
    list: [],
    total: 0,
    pagePara: ''
  },
  // 打开隐私协议页面
  openPrivacyContract() {
    const _ = this
    wx.openPrivacyContract({
        fail: () => {
            wx.showToast({
                title: '遇到错误',
                icon: 'error'
            })
        }
    })
  },
// 拒绝隐私协议
exitMiniProgram() {
  // 直接退出小程序
  wx.exitMiniProgram()
},
// 同意隐私协议
handleAgreePrivacyAuthorization() {
  const _ = this
  _.setData({
      showPrivacy: false
  })
},
getPrivacyAgreementDataFn(){ //查询隐私协议
  console.log(11111)
  if (wx.getPrivacySetting) {
    console.log(333333)
      wx.getPrivacySetting({
          success: res => {
            console.log(66666)
            console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
            if (res.needAuthorization) {
              // 需要弹出隐私协议
              this.setData({
                showPrivacy: true
              })
            } else {
              console.log("77777777")
              // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用隐私接口
  // this.goStore()
            }
          },
          fail: () => {
            console.log(55555)
          },
        })
        console.log(44444)
  }else{
      // this.goStore()
      console.log(2222)
  }
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
  onShow() {
    this.getPrivacyAgreementDataFn()
    this.getData();
    var user = getLoginInfo();
    if (user == '') {
      wx.login({
        success: function (res) {
          var obj = {
            code: res.code,
            role: 1
          };
          appletsLogin(obj).then(tk => {
            wx.setStorageSync('tokenKey', tk.data.data.token);
            getUserMsg(tk.data.data.token).then(userInfo => {
              setLoginInfo(userInfo.data.data);
            });
          })
        }
      });
    }else{
      getUserMsg(wx.getStorageSync('tokenKey')).then(userInfo => {
        setLoginInfo(userInfo.data.data);
      });
    }
  },
  onLoad: async function (para) {
    this.setData({
      pagePara: para.look
    })
    if (wx.getStorageSync('loginInfo')&&wx.getStorageSync('loginInfo').relieveTime) {
      this.setData({
        relieveTime: wx.getStorageSync('loginInfo').relieveTime,
        stopUse: true
      })
    }
  },
  jump(e) {
    var loginInfo = getLoginInfo();
    // if (loginInfo.phone == '' || loginInfo.phone == null || loginInfo.phone == undefined) {
    //   wx.showModal({
    //     title: '请登录授权进入下一步',
    //     success: function (auth) {
    //       if (auth.confirm) {
    //         wx.redirectTo({
    //           url: '/pages/login/login',
    //         })
    //       }
    //     }
    //   })
    //   return;
    // } else 
    if (loginInfo.wechatName == '' || loginInfo.wechatName == null || loginInfo.wechatName == undefined) {
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
        // wx.showModal({
        //   title: '主题派对正在开发中，敬请期待...',
        //   showCancel:false
        // })
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
  details(e){
    if(e.currentTarget.dataset.category==0||e.currentTarget.dataset.category==4||e.currentTarget.dataset.category==3||e.currentTarget.dataset.category==5){
      wx.navigateTo({
        //url: '/pages/my/fmdetail/fmdetail?id='+e.currentTarget.dataset.id+'&from=index',
        url:'/02meiritiaopin/index/index'
      })
    }else if(e.currentTarget.dataset.category==1){
      wx.navigateTo({
        url: '/probe/detail/detail?id='+e.currentTarget.dataset.id+'',
      })
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
        this.data.list = this.data.list.concat(res.data.data.list);
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
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var shareObj = {
      imageUrl: 'https://file.wxdao.net/2023-05/19edb398-123b-4d1c-8442-627a277a18ea.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      title: '到这里激活内心的力量'
    };
    return shareObj;
  },
  onShareTimeline() {
    var shareObj = {
      imageUrl: 'https://file.wxdao.net/2023-05/19edb398-123b-4d1c-8442-627a277a18ea.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      title: '到这里激活内心的力量'
    };
    return shareObj;
  },

});
