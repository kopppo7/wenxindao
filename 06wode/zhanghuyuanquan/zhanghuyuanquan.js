// 06wode/zhanghuyuanquan/zhanghuyuanquan.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        telPopStatus: false,
        codePopStatus: false,


        countdown: 30,
        isShow: false,


        errorStatus: false,
        errorTxt: '手机号格式输入错误',

    },

    changeTel: function(){
        var that = this;
        that.setData({
            telPopStatus: true
        })
    },

    closePop: function(){
        var that = this;
        that.setData({
            telPopStatus: false
        })
    },




    //倒计时
    count:function(that){
        var interval = setInterval(function () {
            var countdown = that.data.countdown;
            if (countdown == 0) {
                that.setData({
                    isShow: true,
                    countdown: 30
                })
                clearInterval(interval)
            } else {
                countdown--;
                that.setData({
                    isShow: false,
                    countdown: countdown
                })
            }
        }, 1000)
    },
    //获取验证码
    send: function () {
        var that=this;
        wx.showToast({
            title: '验证码发送成功',
            icon: 'none',
            duration: 1000,
            success: function () {
                that.count(that)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // this.count(this)
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
