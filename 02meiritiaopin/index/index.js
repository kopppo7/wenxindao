// 02meiritiaopin/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        playPopStatus: false,
        bigPopStatus: false,
        tabs: ['每日意图', '要事规划', '复盘'],
        activeIndex: 0
    },
    openPlayPop() {
        var that = this;
        that.setData({
            playPopStatus: true
        })
    },
    openBig() {
        that.setData({
            bigPopStatus: true
        })
    },
    closePop() {
        var that = this;
        that.setData({
            playPopStatus: false,
            bigPopStatus: false
        })
    },
    changeTab(ind) {
        this.setData({
            activeIndex: ind,
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