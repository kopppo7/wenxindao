import {
  login
} from './utils/common'
App({
  onLaunch: function () {},
  globalData: {
    token: '',
    mesList: [],
    playerList: [],
    truePlayerList: [],
    // 顶部导航栏
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距顶部间距
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
  },
  // 监听全局变量变化
  watch: function (variate, method) {
    var obj = this.globalData;
    let val = obj[variate]; // 单独变量来存储原来的值
    Object.defineProperty(obj, variate, {
      configurable: false,
      enumerable: true,
      set: function (value) {
        val = value; // 重新赋值
        method(variate, value); // 执行回调方法
      },
      get: function () {
        // 在其他界面调用getApp().globalData.variate的时候，这里就会执行。
        return val; // 返回当前值
      }
    })
  },
  onLaunch: async function () {
    //await login()
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    console.log(systemInfo)
    console.log(menuButtonInfo)
    // 导航栏高度 = 状态栏高度 + 44(所有机型都适用)
    that.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuTop = menuButtonInfo.top;
    that.globalData.menuHeight = menuButtonInfo.height;
  },
  onShareTimeline() {

  },
});
console.log = __wxConfig.envVersion == 'develop' ? console.log : () => {};