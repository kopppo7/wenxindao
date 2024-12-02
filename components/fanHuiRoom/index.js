// components/rating/index.js
Component({

  /**
   * 组件的初始数据
   */
  data: {
  },
  properties: {
    backTitle: {
      type: String,
      value: ''
    },
    backStatus: {
      type: String,
      value: ''
    },
  },
  lifetimes: {
    // 页面创建时执行
    attached () {
      console.log('重新渲染了');
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backRoom () {
      let roomPath = wx.getStorageSync('roomPath')
      let partyData = wx.getStorageSync('partyData')
      if (roomPath) {
        wx.navigateTo({
          url: '/04zhutipaidui/tansuo/tansuo?askId=' + roomPath.askId + '&isMatch=' + roomPath.isMatch + '&isfriend=' + roomPath.isfriend + '&roomId=' + roomPath.roomId + '&title=' + partyData.themeDetail.title
        })
      }
    }
  }
})
