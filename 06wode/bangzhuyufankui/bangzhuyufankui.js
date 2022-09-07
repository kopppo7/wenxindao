// 06wode/bangzhuyufankui/bangzhuyufankui.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        allTitle: [
            {id: 0, title: '程序错误'},
            {id: 1, title: '体验问题'},
            {id: 2, title: '新功能提议'},
            {id: 3, title: '其他'},
        ],
        currentIndex: 0,
        questionList: [
            {id: 0, title: '问题标题问题标题'},
            {id: 1, title: '问题标题问题标题'},
            {id: 2, title: '问题标题问题标题'},
            {id: 3, title: '问题标题问题标题'}
        ]


    },
    //点击切换标题
    changeTitle(event) {
        let index = event.target.dataset.current;//当前点击标题的index
        var id = event.currentTarget.id
        console.log(id);
        this.setData({
            currentIndex: index
        })
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
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
