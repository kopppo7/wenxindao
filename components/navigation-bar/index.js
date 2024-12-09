const app = getApp()
Component({
  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
  },
  attached: function () {},
  methods: {
    triggerGoBack() {
      this.triggerEvent('goBack'); // 触发父组件的 goBack 事件
    }
  }
})