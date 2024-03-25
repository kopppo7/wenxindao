import {
  submitScore,
  getMyProEvaList
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    evaluateList: [], // 评价列表
    score: 5, // 提交的评分
    page: 1,
    total: 0,
    gwPopStatus: false,
    evaluate: '', // 提交的评价
    title: '给本次的生命探索引导打分',
    clickSentimentType: 'new', // 来自哪个按钮
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
    })
  },
  onShow() {
    const that = this
    that.getEvaList()
  },
  // 评价
  getEvaList() {
    getMyProEvaList({
      page: this.data.page,
      pageSize: 20,
      id: this.data.id,
      category: 0, // 类型(0:生命探索,1:主题派对)
    }).then((res) => {
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
  /* 
    点击编辑 icon，打开编辑弹框
  */
  openPop(e) {
    this.setData({
      gwPopStatus: true,
      clickSentimentType: e.target.dataset.type
    })
  },
  // 关闭弹窗
  closePop() {
    this.setData({
      gwPopStatus: false
    })
  },
  // 获取评分
  change(e) {
    this.setData({
      score: e.detail
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
    // clickSentimentType
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
    })
  },
  // 获取评价内容
  getValue(e) {
    this.setData({
      evaluate: e.detail.value
    })
  },
})
