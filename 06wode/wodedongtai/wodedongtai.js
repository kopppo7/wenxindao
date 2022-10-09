// 06wode/wodedongtai/wodedongtai.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: [
            {
                title: '全部',
                num: 0
            },
            {
                title: '每日调频',
                num: 53
            },
            {
                title: '生命探索',
                num: 3
            },
            {
                title: '主题派对',
                num: 24
            }
        ],
        cur_tab: 0,
        showPop: false,
    },
    // 切换tab
    changeCurTab: function (e) {
        this.setData({
            cur_tab: e.currentTarget.dataset.index
        })
    },
    // 显示弹窗
    openPop: function () {
        this.setData({
            showPop: true
        })
    },
    // 隐藏弹窗
    closePop: function () {
        this.setData({
            showPop: false
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
