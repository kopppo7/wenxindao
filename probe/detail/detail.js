// 03shenmingtansuo/zhutijieshao/zhutijieshao.js
import {
  getProDetail,
  getPayProbe,
  getProEvaList,
  submitScore,
  getExpId
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    total: 0
  },
  // 打开购买本探索弹窗
  openBuyPop() {
    this.setData({
      buyPopStatus: true
    })
  },
  // 关闭弹窗
  closePop() {
    this.setData({
      buyPopStatus: false,
      yearPopStatus: false,
      gwPopStatus: false
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
      wx.hideLoading()
      this.getEvaList()
      this.closePop()
    })
  },
  // 关闭弹框
  closeYearPop() {
    this.setData({
      yearPopStatus: true
    })
  },
  // 语音参与须知
  toDetail() {
    wx.navigateTo({
      url: '../voince/index?detail=' + this.data.product.voiceNotice,
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
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      getExpId({
        probeId: this.data.product.id
      }).then((res) => {
        wx.hideLoading()
        wx.redirectTo({
          url: '../play/play?id=' + res.data.data.id,
        })
      })
    }

  },

  // 详情
  getDetail(id) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    getProDetail(id).then((res) => {
      wx.hideLoading()
      let info = wx.getSystemInfo()
      // debugger
      res.data.data.activity = res.data.data.activity.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
.replace(/<p>/ig, '<p style="font-size: 15px; line-height: 25px;">')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100px;height:auto" $1');

res.data.data.introduce = res.data.data.introduce.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
.replace(/<p>/ig, '<p style="font-size: 15px; line-height: 25px;">')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 200px;height:auto" $1');


      this.setData({
        product: res.data.data,
        labels: res.data.data.labels ? res.data.data.labels.split(',') : []
      })
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
  // 提交评价
  submitPercep() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getDetail(options.id)
      this.getEvaList()
    }

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
