// 02meiritiaopin/share/share.js
import {
    dayForSignNumber,
    findByIsFlagNumber,
    findByFmOne
} from "../../utils/fm";


Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardTime: "",
        cardCount: 0,
        pageId: "",
        nowDate:{},
        content:{}
    },
    findByFmOne() {
        let that = this;
        findByFmOne({id:this.data.pageId}).then(res => {
            console.log(res.data);
            that.setData({
              content : JSON.parse(res.data.data.contents),
              cardTime:res.data.data.addTime.substring(11,16),
              cardImg:res.data.data.cardUrl
            })
        })
    },
    dayForSignNumber() {
        let that = this;
        dayForSignNumber().then(res => {
            that.setData({
              nowDate: res.data.data.chinese
            })
        })
    },
    findByIsFlagNumber() {
      let that = this;
      findByIsFlagNumber().then(res => {
          that.setData({
            cardCount: res.data.data || 0
          })
      })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);
        this.setData({
            pageId: options.id
        })
        this.findByFmOne()
        this.dayForSignNumber()
        this.findByIsFlagNumber()
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