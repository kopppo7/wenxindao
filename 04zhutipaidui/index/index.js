import {
  getAskPartyList,
  findByAskPartyOne,
  categoryList,
  checkRoomStatus2
} from "../api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    themeList: [],
    listParams: {
      types: 1,
      page: 0,
      pageSize: 10,
    },
    tabParams: {
      category: 1,
    },
    activeIndex: 0,
    // 组件的数据
    isShowModel: false,
    backTitle: '',
    backStatus: ''
  },

  initData() {
    this.getTabList()
  },
  // 查看房间状态
  checkRoomStatus() {
    if (wx.getStorageSync('roomPath')) {
      checkRoomStatus2({
        roomId: wx.getStorageSync('partyData').roomId || wx.getStorageSync('roomData').id
      }).then(res => {
        // 0正常,1房间不存在,2房间已经解散,3对话已经开始,请勿打扰,4对话已经满员,请勿打扰
        if (res.data.data.type == 1 || res.data.data.type == 2) {
          this.setData({
            isShowModel: false
          })
          this.claerRoomStorage()
        } else {
          let partyData = wx.getStorageSync('partyData')
          this.setData({
            backTitle: partyData?.themeDetail?.title,
            backStatus: '正在进行中',
            isShowModel: true
          })
        }
      })
    } else {
      this.setData({
        isShowModel: false
      })
      this.claerRoomStorage()
    }
  },
  // 清除房间缓存
  claerRoomStorage() {
    wx.removeStorageSync('roomData')
    wx.removeStorageSync('isLinShiFangZhu')
    wx.removeStorageSync('roomPath')
    wx.removeStorageSync('partyData')
    wx.removeStorageSync('activeStatus')
  },
  getThemeList() {
    getAskPartyList(this.data.listParams).then(res => {
      this.setData({
        themeList: res.data.data.list
      })
    })
  },
  getTabList() {
    categoryList(this.data.tabParams).then(res => {
      this.setData({
        tabList: res.data,
        'listParams.types': res.data[0].id,
      })
      this.getThemeList()
    })
  },
  changeTab(e) {
    console.log(e);
    this.setData({
      'listParams.types': e.currentTarget.dataset.tid,
      activeIndex: e.currentTarget.dataset.ind,
    })
    this.getThemeList()
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/04zhutipaidui/zhutijieshao/zhutijieshao?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    this.checkRoomStatus()
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