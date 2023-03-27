// 03shenmingtansuo/zhutijieshao/zhutijieshao.js
import {
    findByAskPartyOne,
    evaluateList,
    insertEvaluate,
    createBaoRoom,
    roomMatchingPlay
} from "../api";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        yearPopStatus: false,
        gwPopStatus: false,
        themeId: '',
        detailObj: {},
        evalParams: {
            page: 1,
            pageSize: 1,
            category: 1
        },
        evalList: [],
        rating: 4,
        area: '',
        roomData: {},
        roomPath: {}
    },
    // 快速匹配
    openBuyPop (e) {
        var type = e.currentTarget.dataset.type
        var that = this;
        if(this.data.detailObj.isSeat==1||this.data.detailObj.isFree==1){
          roomMatchingPlay(that.data.themeId).then(res => {
              if (res.data.ret === 203) {
                  wx.navigateTo({
                      url: '/07liebian/goumaixiwei/goumaixiwei?id=' + this.data.themeId,
                  })
              } else if (res.data.ret === 200) {
                  wx.navigateTo({
                      url: '/04zhutipaidui/setHouse/setHouse?id=' + this.data.themeId + '&roomId=' + (res.data.id || res.data.data) + '&isMatch=1',
                  })
              }
          })
        }
        else if(this.data.detailObj.isFree==0&&this.data.detailObj.isSeat==0&&this.data.detailObj.isBao==1){
          wx.showModal({
            content:'您已购买私人派对是否继续购买单人匹配席位',
            confirmText:'确认',
            cancelText:'取消'
          })
        }
    },
    // 好友结伴
    friendTogether () {
        let params = {
            askId: this.data.themeId,
        }
        createBaoRoom(params).then(res => {
            if (res.data.ret === 201) {
                wx.navigateTo({
                    url: '/07liebian/goumaixiwei/goumaixiwei?id=' + this.data.themeId,
                })
            } else if (res.data.ret === 200) {
                wx.navigateTo({
                    url: '/04zhutipaidui/setHouse/setHouse?id=' + this.data.themeId + '&roomId=' + res.data.data.id + '&isfriend=1'
                })
            }
        })
    },
    // 关闭弹窗
    closePop () {
        var that = this;
        that.setData({
            buyPopStatus: false,
            yearPopStatus: false,
            gwPopStatus: false
        })
    },

    // 打开购买本探索弹窗
    openYearPop () {
        var that = this;
        that.setData({
            yearPopStatus: true
        })
    },
    openGwPop () {
        var that = this;
        that.setData({
            gwPopStatus: true
        })
    },

    change (e) {
        this.setData({
            rating: e.detail
        })
    },
    initData () {
        this.getDetail()
        this.getEvaluateList()
    },
    getDetail () {
        findByAskPartyOne({ id: this.data.themeId }).then(res => {
            let obj = res.data.data;
            obj.tips = obj.tips.split(' ');
            console.log(obj);
            let richText1 = obj.detailsText
            let richText2 = obj.flowText
            obj.detailsText = richText1
                .replace(/\<img/gi, '<img style="width:100%;height:auto;"')
                .replace(/\<p/gi, '<p class="p_class"')
                .replace(/\<span/gi, '<span class="span_class"')
            obj.flowText = richText2
                .replace(/\<img/gi, '<img style="width:100%;height:auto;"')
                .replace(/\<p/gi, '<p class="p_class"')
                .replace(/\<span/gi, '<span class="span_class"')
            this.setData({
                detailObj: obj
            })
        })
    },
    getEvaluateList () {
        evaluateList(this.data.evalParams).then(res => {
            this.setData({
                evalList: res.data.data.list
            })
        })
    },
    bindFormSubmit (e) {
        let params = {
            category: 1,
            objectId: this.data.themeId,
            score: this.data.rating,
            evaluate: e.detail.value.textarea,
        }
        insertEvaluate(params).then(res => {
            this.getEvaluateList()
            this.setData({
                gwPopStatus: false
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        console.log(options);
        if (options.open) {
            this.setData({
                gwPopStatus:true
            })
        }
        this.setData({
            themeId: options.id,
            'evalParams.id': options.id,
            roomData: wx.getStorageSync('roomData'),
            roomPath: wx.getStorageSync('roomPath'),
        })
        this.initData()
    },
    //返回游戏房间
    toRoom: function () {
        console.log(this.data.roomPath)
        var url = '/04zhutipaidui/tansuo/tansuo'
        var roomPath = this.data.roomPath
        for (const roomPathKey in roomPath) {
            url = url + '&' + roomPathKey + '=' + roomPath[roomPathKey]
        }
        url.replace('&', '?')
        console.log(url.replace('&', '?'))
        console.log(url)
        wx.redirectTo({
            url: url.replace('&', '?'),
        })


    },
    inputArea(e){
        console.log(e.detail.value.length);
        if (e.detail.value.length >= 500) {
            wx.showToast({
                title: '最多输入500个字',
                icon: 'none'
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {

    }
})
