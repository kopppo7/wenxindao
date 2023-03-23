// components/rating/index.js
Component({

  /**
   * 组件的初始数据
   */
  data: {
    title: '',
    status: '',
    isShow: true
  },
  lifetimes: {
    // 页面创建时执行
    attached () {
      if (wx.getStorageSync('partyData')) {
        let partyData = wx.getStorageSync('partyData')
        this.setData({
          title: partyData?.themeDetail?.title,
          status: '正在进行中'
        })
      }else{
        this.setData({
          isShow:false
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backRoom () {
      let roomPath = wx.getStorageSync('roomPath')
      if (roomPath) {
        wx.navigateTo({
          url: '/04zhutipaidui/tansuo/tansuo?askId=' + roomPath.askId + 'isMatch' + roomPath.isMatch + 'isfriend' + roomPath.isfriend + 'roomId' + roomPath.roomId
        })
      }
    }
  }
})
