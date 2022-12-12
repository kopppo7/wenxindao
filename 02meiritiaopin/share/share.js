// 02meiritiaopin/share/share.js
import {
  dayForSignNumber,
  findByIsFlagNumber,
  findByFmOne
} from "../../utils/fm";

import Wxml2Canvas from 'wxml2canvas'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardTime: "",
    cardCount: 0,
    pageId: "",
    nowDate: {},
    content: {},
    imgUrl: "",
    width: "",
    height: "",
    share: {
      title: '',
      query: ''
    }
  },
  findByFmOne() {
    let that = this;
    findByFmOne({
      id: this.data.pageId
    }).then(res => {
      var content = JSON.parse(res.data.data.contents);
      that.setData({
        content: JSON.parse(res.data.data.contents),
        cardTime: res.data.data.addTime.substring(11, 16),
        cardImg: content[0].imgUrl
      })
      that.drawMyCanvas()
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
  drawMyCanvas() {
    wx.showLoading()
    const that = this
    const query = wx.createSelectorQuery().in(this);
    query.select('#my-canvas').fields({ // 选择需要生成canvas的范围
      size: true,
      scrollOffset: true
    }, data => {
      let width = data.width;
      let height = data.height;
      console.log(data);
      that.setData({
        width,
        height
      })
      setTimeout(() => {
        that.startDraw()
      }, 1500);
    }).exec()
  },
  startDraw() {
    let that = this

    // 创建wxml2canvas对象
    let drawMyImage = new Wxml2Canvas({
      element: 'myCanvas', // canvas的id,
      obj: that, // 传入当前组件的this
      width: that.data.width,
      height: that.data.height,
      progress(percent) { // 进度
        // console.log(percent);
      },
      finish(url) { // 生成的图片
        wx.hideLoading()
        that.setData({
          imgUrl: url
        })
        console.log(url);
      },
      error(res) { // 失败原因
        console.log(res);
        wx.hideLoading()
      }
    }, this);
    let data = {
      // 获取wxml数据
      list: [{
        type: 'wxml',
        class: '.my_canvas .my_draw_canvas', // my_canvas要绘制的wxml元素根类名， my_draw_canvas单个元素的类名（所有要绘制的单个元素都要添加该类名）
        limit: '.my_canvas', // 要绘制的wxml元素根类名
        x: 0,
        y: 0
      }]
    }
    // 绘制canvas
    drawMyImage.draw(data, this);
  },
  savePoster() {
    const that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imgUrl,
      success: function () {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        });
      },
      fail(err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.saveImageToPhotosAlbum({
                      filePath: that.data.imgUrl,
                      success: function () {
                        wx.showToast({
                          title: '保存成功',
                          icon: 'success',
                          duration: 2000
                        })
                      },
                    })
                  } else {
                    wx.showToast({
                      title: '授权失败，请稍后重新获取',
                      icon: 'none',
                      duration: 1500
                    });
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  share1() {
    wx.showShareImageMenu({
      path: this.data.imgUrl
    })
  },
  share2() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      pageId: options.id
    })
    this.findByFmOne()
    this.dayForSignNumber()
    this.findByIsFlagNumber()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var shareObj = {
      path: '02meiritiaopin/share/share?id=' + this.data.pageId, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: this.data.cardImg, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      title: '问心岛'
    };
    return shareObj;
  },
  onShareTimeline() {
    var shareObj = {
      path: '02meiritiaopin/share/share?id=' + this.data.pageId, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: this.data.cardImg, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      title: '问心岛'
    };
    return shareObj;
  }
})