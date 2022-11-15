// 03shenmingtansuo/zhutijieshao/zhutijieshao.js
import{ getProDetail, getPayProbe , getProEvaList, submitScore } from '../../utils/api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buyPopStatus: false,
        yearPopStatus: false,
        gwPopStatus: false,
        id: '',
        categoryId: '',
        product: '',
        labels: [],
        evaluateList: [], // 评价列表
        score:5, // 提交的评分
        evaluate: '' // 提交的评价
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
    change(e){
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
        debugger
        wx.showLoading({
            title: '提交中',
            mask:true,
        })
        if(!this.data.evaluate){
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
            category: this.data.categoryId,
        }).then((res) => {
            wx.hideLoading()
            this.getEvaList(this.data.id, this.data.categoryId)
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
        url: '../voince/index?detail=' + this.data.product.voiceNotice ,
      })
    },
    // 支付
    toPay(){
        let that = this
        wx.showLoading({
          title: '支付中',
          mask:true,
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
            success () {
              wx.showLoading()
              wx.showToast({
                title:'付款成功',
                icon:'success'
              })
              that.getDetail(that.data.product.id)
              that.closePop()
            },
            // 失败回调
            fail (err) {
              that.getDetail(that.data.product.id)
              that.closePop()
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
    
    // 详情
    getDetail(id) {
      wx.showLoading({
        title: '加载中',
        mask:true,
      })
      getProDetail(id).then((res) => {
        wx.hideLoading()
        this.setData({
          product: res.data.data,
          labels: res.data.data.labels ? res.data.data.labels.split(',') : []
        })
      })
    },
    // 评价
    getEvaList(id,categoryId) {
        getProEvaList({
            page:1,
            pageSize:20,
            id: id,
            category: categoryId,
        }).then((res) => {
          this.setData({
            evaluateList: res.data.data,
          })
        })
      },
      // 提交评价
      submitPercep() {

      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      if(options.id) {
        this.setData({
          id: options.id,
          categoryId: options.categoryId
        })
        this.getDetail(options.id)
        this.getEvaList(options.id,options.categoryId)
      }

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
