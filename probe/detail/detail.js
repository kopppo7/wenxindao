import {
  getProDetail,
  getPayProbe,
  getProEvaList,
  submitScore,
  getExpId,
  sendAskInvite,
  findInviteById,
  receiveDetail,
  appletsLogin,
  getUserMsg,
  getMyProEvaList,
  getUserProbeIsFree
} from '../../utils/api'
import {
  getLoginInfo,
  setLoginInfo,
  getStoreConfigList
} from '../../utils/stoage'
import {
  formatTime
} from '../../utils/util'
import {
  getConfigList
} from '../../utils/common'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHavePhone:true,
    buyPopStatus: false,
    yearPopStatus: false,
    gwPopStatus: false,
    id: '',
    product: '',
    labels: [],
    evaluateList: [], // 评价列表
    score: 5, // 提交的评分
    evaluate: '', // 提交的评价
    page: 1,
    total: 0,
    isShowVoice: false,
    shareList: [],
    areadyShareList: [], // 已分享
    shareNum: 2,
    myProEvaList: [], // 我的感悟列表
    isFree: false, // 是否处于新人免费
  },
  
  // 获取我的感悟列表
  getMyProEvaList() {
    getMyProEvaList({
      page: 0,
      pageSize: 0,
      id: this.data.id,
      category: 0, // 类型(0:生命探索,1:主题派对)
    }).then((res) => {
      if(res.ret === 200) {
        this.setData({
          myProEvaList: res.data.data.list
        })
      }
    })
  },
  // 打开购买本探索弹窗
  openBuyPop() {
    if (!this.data.isHavePhone) {
      wx.showModal({
        title: '请登录授权进入下一步',
        success: function (auth) {
          if (auth.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }else{
      this.setData({
        buyPopStatus: true
      })
    }
  },
  // 关闭弹窗
  closePop() {
    this.setData({
      buyPopStatus: false,
      yearPopStatus: false,
      gwPopStatus: false
    })
  },
  closeVoice() {
    this.setData({
      isShowVoice: false
    })
  },
  // 打开购买本探索弹窗
  openYearPop() {
    this.setData({
      yearPopStatus: true
    })
  },
  // 打开感悟弹框
  openPercepPop() {
    this.setData({
      gwPopStatus: true
    })
  },
  // 获取评分
  change(e) {
    this.setData({
      score: e.detail
    })
  },
  // 获取评价内容
  getValue(e) {
    this.setData({
      evaluate: e.detail.value
    })
  },
  // 提交评价内容
  addPercep() {
    wx.showLoading({
      title: '提交中',
      mask: true,
    })
    if (!this.data.evaluate) {
      wx.showToast({
        title: '请填写内容',
        icon: 'none',
        duration: 2000
      })
      return
    }
    submitScore({
      score: this.data.score,
      evaluate: this.data.evaluate,
      objectId: this.data.id,
      category: 0, // 类型(0:生命探索,1:主题派对)
    }).then((res) => {
      wx.showToast({
        title: '提交成功',
      })
      wx.hideLoading()
      this.getEvaList()
      this.closePop()
      // 获取我的评价列表
      this.getMyProEvaList()
    })
  },
  // 关闭弹框
  closeYearPop() {
    this.setData({
      yearPopStatus: true
    })
  },
  // 语音参与须知
  showNotice() {
    this.setData({
      isShowVoice: true
    })
  },
  // 支付
  toPay() {
    let that = this
    wx.showLoading({
      title: '支付中',
      mask: true,
    })
    getPayProbe({
      id: that.data.product.id,
      types: 1
    }).then((res) => {
      wx.requestPayment({
        // 时间戳
        appId: res.data.data.appId,
        timeStamp: res.data.data.timeStamp,
        // 随机字符串
        nonceStr: res.data.data.nonceStr,
        // 统一下单接口返回的 prepay_id 参数值
        package: res.data.data.package,
        // 签名类型
        signType: res.data.data.signType,
        // 签名
        paySign: res.data.data.paySign,
        // 调用成功回调
        success() {
          wx.showLoading()
          wx.showToast({
            title: '付款成功',
            icon: 'success'
          })
          that.getDetail(that.data.product.id)
          that.closePop()
        },
        // 失败回调
        fail(err) {
          that.getDetail(that.data.product.id)
          that.closePop()
          wx.showLoading()
          wx.showToast({
            title: '付款失败',
            icon: 'error'
          })
        },
        // 接口调用结束回调
        complete() {}
      })

    })
  },
  // 继续探索
  toExplore() {
    if (this.data.product.userProbeId) {
      wx.redirectTo({
        url: '../play/play?id=' + this.data.product.userProbeId,
      })
    } else {
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

      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      getExpId({
        probeId: this.data.product.id,
        inFree: this.data.product.isPay === 1 ? "N" : "Y"
      }).then((res) => {
        wx.hideLoading()
        wx.redirectTo({
          url: '../play/play?id=' + res.data.data.id,
        })
      })
    }

  },

    // 我的感悟
    toSentiment() {
      wx.redirectTo({
        url: '../sentiment/sentiment?id=' + this.data.id,
      })
    },

  // 详情
  getDetail(id) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    getProDetail(id).then((res) => {
      wx.hideLoading()
      if (res.data.data.activity) {
        res.data.data.activity = res.data.data.activity.replace(/style/g, 'data').replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
          .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;height:auto" $1');
      }
      if (res.data.data.introduce) {
        res.data.data.introduce = res.data.data.introduce.replace(/style/g, 'data').replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
          .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;height:auto" $1');
      }
      if (res.data.data.powerExpiratTime == '长期') {
        res.data.data.powerExpiratTime = '限时免费中'
      } else {
        let dateTime = formatTime(new Date(res.data.data.powerExpiratTime.replace(/-/g, '/')));
        res.data.data.powerExpiratTime = '到期时间为 ' + dateTime.year + '年' + dateTime.month + '月' + dateTime.day + '日';
      }
      this.setData({
        product: res.data.data,
        labels: res.data.data.labels ? res.data.data.labels.split(',') : []
      })
      // 如果类型是付费则查询isFree并赋值
      if(res.data.data.isPay === 1) {
        // 查询是否超出免费次数
        this.getIsFree()
      } else {
        this.setData({
          isFree: false
        })
      }
    })
  },
  // 评价
  getEvaList() {
    getProEvaList({
      page: this.data.page,
      pageSize: 20,
      id: this.data.id,
      category: 0, // 类型(0:生命探索,1:主题派对)
    }).then((res) => {
      // this.setData({
      //   evaluateList: res.data.data,
      // })
      if (this.data.page == 1) {
        this.data.evaluateList = res.data.data.list;
      } else {
        this.data.evaluateList.concat(res.data.data.list);
      }
      this.setData({
        evaluateList: this.data.evaluateList,
        total: res.data.data.total
      })
      wx.stopPullDownRefresh()
      wx.hideLoading();
    })
  },
  // 获取邀请详情
  getReceiveDetail(shareId, id) {
    receiveDetail(shareId, id).then((res) => {
      let list = []
      if (res.data.data) {
        for (let i = 0; i < this.data.shareNum; i++) {
          if (i < res.data.data.length) {
            list[i] = res.data.data[i]
          } else {
            list[i] = {
              rname: '',
              headImg: ''
            }
          }
        }
      } else {
        list = [{
          rname: '',
          headImg: ''
        }, {
          rname: '',
          headImg: ''
        }, {
          rname: '',
          headImg: ''
        }, {
          rname: '',
          headImg: ''
        }]
      }

      this.setData({
        areadyShareList: res.data.data ? res.data.data : [],
        shareList: list
      })
    })
  },
  /* 
    处理分享人数
  */
  handleShareNum() {
    let shareNumObj = {}
    getStoreConfigList().forEach(item => {
      if(item.configKey === 'share.user.num') {
        shareNumObj = item
      }
    })
    this.setData({
      shareNum: shareNumObj.configValue
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.scene) {
      options.id = options.scene;
    }
    this.setData({
      id: options.id,
      shareId: options.shareId || 0
    })
    // this.data.shareId||
    if(!wx.getStorageSync('tokenKey')){
      var that = this;
      wx.login({
        success: function (res) {
          var obj = {
            code: res.code,
            role: 1
          };
          appletsLogin(obj).then(res => {
            wx.setStorageSync('tokenKey', res.data.data.token)
            getUserMsg(res.data.data.token).then(userInfo => {
              if (userInfo.data.data.phone == null || userInfo.data.data.wechatName == null) {
                findInviteById(that.data.shareId).then(res => {
                  if (res.data.data.status == 0) {
                    wx.navigateTo({
                      url: '/probe/invitation/index?shareId=' + that.data.shareId + '&id=' + that.data.id,
                    })
                  }
                })
              } else {
                setLoginInfo(userInfo.data.data)
              }
            }).then(res => {
              getConfigList(wx.getStorageSync('tokenKey'))
              // 获取我的评价列表（需要 token）
              that.getMyProEvaList()
              that.handleShareNum()
            })
          })
        }
      });

    }else{
      getUserMsg(wx.getStorageSync('tokenKey')).then(userInfo => {
        if(!userInfo.data.data.phone){
          this.setData({
            isHavePhone:false
          })
        }
        // 获取我的评价列表（需要 token）
        this.getMyProEvaList()
        this.handleShareNum()
      });
    }
  },
  onShow() {
    var that = this;
    // if (that.data.shareId) {
      
    // }
    that.getDetail(that.data.id)
    that.getReceiveDetail(that.data.shareId, that.data.id)
    that.getEvaList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.data.page = 1;
    this.getEvaList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.evaluateList.length < this.data.total) {
      this.data.page += 1;
      this.getEvaList();
    }
  },

  
  // 获取是否超出免费次数
  getIsFree() {
    getUserProbeIsFree(wx.getStorageSync('tokenKey')).then(res => {
      this.setData({
        isFree: res.data
      })
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: async function (option) {
    console.log(option);
    if (!this.data.isHavePhone) {
      wx.showModal({
        title: '请登录授权进入下一步',
        success: function (auth) {
          if (auth.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }else{
      var shareId = '';
      if (option.target && option.target.dataset.type == 'liebian') {
        await sendAskInvite(this.data.id).then(res => {
          shareId = res.data.data.id
        })
      }
      var shareObj = {
        path: 'probe/detail/detail?id=' + this.data.id + '&shareId=' + shareId,
        imageUrl: this.data.product.shareImgUrl,
        title: '话题很赞，一起探索《' + this.data.product.title + '》吧',
        desc: '这是开启心灵对话的派对之旅'
      }
      return shareObj;
    }
  }
})
