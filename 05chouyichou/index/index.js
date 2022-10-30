// 05chouyichou/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentItemId: 1,
        imgUrls:[
            {url:'https://wenxin-file.oss-cn-beijing.aliyuncs.com/system/images/pump-img.png'},
            {url:'https://wenxin-file.oss-cn-beijing.aliyuncs.com/system/images/pump-img.png'},
            {url:'https://wenxin-file.oss-cn-beijing.aliyuncs.com/system/images/pump-img.png'}
        ]
    },
    swiperChange:function(e){
        var currentItemId = e.detail.currentItemId;
        this.setData({
            currentItemId: currentItemId
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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