// 03shenmingtansuo/tansuo/tansuo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sharePopStatus: false,
        activityPopStatus: false,//活动提示
        matePopStatus: false,     //匹配中
        waitStatus:false,  //等待状态
        mixPopStatus:false,  //至少两人开始派对
        timePopStatus:false, //倒计时
        kickPopStatus:true, //踢人
        passerPopStatus:true, //匹配路人
        step: 0,
        waitTime:'00:23'
    },
    openSharePop(){
        var that = this;
        that.setData({
            sharePopStatus: true
        })
    },
    closePop(){
        var that = this;
        that.setData({
            sharePopStatus: false,
            activityPopStatus:false,
            matePopStatus:false,
            waitStatus:false,
            mixPopStatus:false,
            timePopStatus:false,
            kickPopStatus:false,
            passerPopStatus:false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
