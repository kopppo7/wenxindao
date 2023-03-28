// 07liebian/goumaixiwei/goumaixiwei.js
import {
    findByAskPartyOne,
    getPayParty
} from "../../07liebian/api";
import { getPayProbe } from "../../utils/api";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        themeId: '',
        detailObj: {},
        type: 2,
        isShowPop: false,
        only:0
    },
    initData () {
        findByAskPartyOne({ id: this.data.themeId }).then(res => {
            let obj = res.data.data;
            this.setData({
                detailObj: obj
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            themeId: options.id,
            only:options.only
        })
        if(options.only){
          this.setData({
            type:options.only*1
          })
        }
        this.initData()
    },
    //选择类型
    pickType: function (e) {
        console.log(e.currentTarget.dataset.type)
        this.setData({
            type: e.currentTarget.dataset.type * 1
        })
    },
    pay: function () {
        let that = this
        this.setData({
            isShowPop: false
        })
        // wx.showLoading({
        //     title: '支付中',
        //     mask: true,
        // })
        getPayParty({
            id: that.data.themeId * 1,
            types: that.data.type
        }).then((res) => {
            if (res.data.ret == 201) {
                wx.showToast({
                  title: res.data.msg,
                  icon:"none"
                })
            } else {
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
                            title: '付款成功',
                            icon: 'success'
                        })
                        setTimeout(function () {
                            wx.redirectTo({
                                url: '/04zhutipaidui/zhutijieshao/zhutijieshao?id=' + that.data.themeId,
                            })
                        }, 500)

                        // that.getDetail(that.data.product.id)
                        // that.closePop()
                    },
                    // 失败回调
                    fail (err) {
                        console.log(err)
                        // that.getDetail(that.data.product.id)
                        // that.closePop()
                        wx.showLoading()
                        wx.showToast({
                            title: '付款失败',
                            icon: 'error'
                        })
                    },
                    // 接口调用结束回调
                    complete () { }
                })
            }

        })
    },
    handleShowPop () {
        this.setData({
            isShowPop: true
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
