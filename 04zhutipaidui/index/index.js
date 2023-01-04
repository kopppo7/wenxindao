import {
  getAskPartyList,
  findByAskPartyOne,
  categoryList
} from "../api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[],
    themeList:[],
    listParams:{
      types:1,
      page:0,
      pageSize:10,
    },
    tabParams:{
      category:1,
    },
    activeIndex:0
  },
  initData(){
    this.getTabList()
  },
  getThemeList(){
    getAskPartyList(this.data.listParams).then(res=>{
      this.setData({
        themeList:res.data.data.list
      })
    })
  },
  getTabList(){
    categoryList(this.data.tabParams).then(res=>{
      this.setData({
        tabList:res.data,
        'listParams.types':res.data[0].id,
      })
      this.getThemeList()
    })
  },
  changeTab(e){
    console.log(e);
    this.setData({
      'listParams.types':e.currentTarget.dataset.tid,
      activeIndex:e.currentTarget.dataset.ind,
    })
    this.getThemeList()
  },
  goDetail(e){
    wx.navigateTo({
      url: '/04zhutipaidui/zhutijieshao/zhutijieshao?id='+e.currentTarget.dataset.id,
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
