// 04zhutipaidui/yao_qing/index.js
import { checkRoomStatus, roomMatchingPlay } from "../api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRoomHide: false,
    isRoomBegin: false,
    isRoomFull: false,
    routeOptions: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.log(options);
    wx.setStorageSync('yao_qing_option',JSON.stringify(options))
    // options会返回主题ID和房间ID
    this.setData({
      routeOptions:options
    })
    if (options.roomId) {
      this.loadCheckRoomStatus(options.roomId)
    } else {
      this.setData({
        isRoomHide: true
      })
    }
  },
  loadCheckRoomStatus (roomId) {
    checkRoomStatus({ roomId }).then(res => {
      // 0正常,1房间不存在,2房间已经解散,3派对已经开始,请勿打扰,4派对已经满员,请勿打扰
      if (res.data.data.type == 0) {
        // 跳转到房间
        

      } else if (res.data.data.type == 1) {
        this.setData({
          isRoomHide: true
        })
      } else if (res.data.data.type == 2) {
        this.setData({
          isRoomHide: true
        })
      } else if (res.data.data.type == 3) {
        this.setData({
          isRoomBegin: true
        })
      } else if (res.data.data.type == 4) {
        this.setData({
          isRoomFull: true
        })
      }
    })
  },
  handleCancel () {
    // 取消的话返回派对详情
    wx.navigateTo({
      url: '/04zhutipaidui/zhutijieshao/zhutijieshao?id=' + this.data.routeOptions.askId,
    })
  },
  chongXinPiPei () {
    let that = this
    console.log(that.data.routeOptions);
    // 确定的话匹配房间并进入设置隐私页面
    roomMatchingPlay(this.data.routeOptions.askId).then(res => {
      console.log(res.data)
      if (res.data.ret === 201) {
        wx.navigateTo({
          url: '/07liebian/goumaixiwei/goumaixiwei?id=' + that.data.routeOptions.askId,
        })
      } else if (res.data.ret === 200) {
        wx.navigateTo({
          url: '/04zhutipaidui/setHouse/setHouse?id=' + that.data.routeOptions.askId + '&roomId=' + (res.data.id || res.data.data) + '&isMatch=1',
        })
      }
    })
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