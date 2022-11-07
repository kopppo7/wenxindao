// 03shenmingtansuo/zhutijieshao/zhutijieshao.js
import {
    findByAskPartyOne,
    evaluateList
  } from "../api";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        buyPopStatus: false,
        yearPopStatus: false,
        gwPopStatus: false,
        themeId:'',
        detailObj:{},
        evalParams:{
            page:1,
            pageSize:1,
            category:1
        },
        evalList:[]
    },
    // 打开购买本探索弹窗
    openBuyPop() {
        var that = this;
        that.setData({
            buyPopStatus: true
        })
    },
    // 关闭弹窗
    closePop() {
        var that = this;
        that.setData({
            buyPopStatus: false,
            yearPopStatus: false,
            gwPopStatus: false
        })
    },

    // 打开购买本探索弹窗
    openYearPop() {
        var that = this;
        that.setData({
            yearPopStatus: true
        })
    },
    openGwPop() {
        var that = this;
        that.setData({
            gwPopStatus: true
        })
    },

    change(e){
        console.log(e.detail)
    },
    initData(){
        this.getDetail()
        this.getEvaluateList()
    },
    getDetail(){
        findByAskPartyOne({id:this.data.themeId}).then(res=>{
            let obj = res.data.data;
            obj.tips = obj.tips.split(' ');
            console.log(obj);
            this.setData({
                detailObj:obj
            })
        })
    },
    getEvaluateList(){
        evaluateList(this.data.evalParams).then(res=>{
            this.setData({
                evalList:res.data.data
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);
        this.setData({
            themeId:options.id,
            'evalParams.id':options.id,
        })
        this.initData()
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
