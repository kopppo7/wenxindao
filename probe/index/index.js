// 03shenmingtansuo/index/index.js
import{ getCateList , getCateDataList ,getPayProbe, getUserProbeIsFree } from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [],
    categoryId: '',
    list: [],
    page: 1,
    pageSize: 1000,
    total: 0,  // 总共多少数据
    isFree: false
  },
  // 切换分类
  change(e) {
    this.setData({
      categoryId: e.target.dataset.id,
      page: 1,
      list: []
    })
    this.getList()
  },
  // 获取数据
  getList(){
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    getCateDataList({
      page: this.data.page,
      pageSize: this.data.pageSize,
      categoryId: this.data.categoryId
    }).then((res) => {
      wx.hideLoading()
      // res.data.data[0].isPower = 1
      // res.data.data[0].progress = 20
      // isPower  progress specialPrice
      this.setData({
        list: res.data.data
      })
    })
  },
  toPay(e){
      let that = this
    wx.showLoading({
      title: '支付中',
      mask:true,
    })
    getPayProbe({
      id: e.target.dataset.id,
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
        success () {
          wx.showLoading()
          wx.showToast({
            title:'付款成功',
            icon:'success'
          })
          that.getList()
        },
        // 失败回调
        fail (err) {
          wx.showLoading()
          wx.showToast({
            title:'付款失败',
            icon:'error'
          })
        },
        // 接口调用结束回调
        complete () {}
    })

    })
  },
  // 调转详情
  toDetail(e) {
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
      + '&categoryId=' + this.data.categoryId
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // getCateList(0).then((res) => {
    //   this.setData({
    //     category: res.data,
    //     categoryId: res.data[0].id
    //   })
    //   this.getList()
    // })
    getCateList(0).then((res) => {
      this.setData({
        category: res.data,
        categoryId: res.data[0].id
      })
      this.getList()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 查询是否超出免费次数
    this.getIsFree()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})