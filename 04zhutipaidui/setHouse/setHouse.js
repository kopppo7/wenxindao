// 04zhutipaidui/setHouse/setHouse.js
import {
    updateImMsg,
} from "../api";
import config from "../../utils/config";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        useMes: {},
        isShow: true,
        themeId:''
    },
    //上传本地图片
    radioChange(e) {
        console.log(e.detail.value);
        if (e.detail.value == 1) {
          this.setData({
            isShow:false
          })
        }else{
          this.setData({
            isShow:true
          })
        }
    },
    uploadImg: function(e) {
        if (this.data.isShow) {
            var that = this
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed', 'original'],
                sourceType: ['album', 'camera'],
                success(res) {
                    var tempFilePaths = res.tempFilePaths
                    for (var i = 0; i < tempFilePaths.length; i++) {
                        wx.uploadFile({
                            filePath: tempFilePaths[i],
                            url: config.getDomain + '/oss/upload/uploadFile',
                            name: 'file',
                            header: {
                                'Content-Type': 'multipart/form-data',
                                'token': wx.getStorageSync('tokenKey') || ''
                            },
                            success: function(res) {
                                console.log(JSON.parse(res.data));
                                that.setData({
                                    'useMes.headImg': JSON.parse(res.data).data
                                })
                            }
                        })
                    }
                }
            })
        }
    },
    formSubmit(e) {
        console.log(e.detail.value);
        let val = e.detail.value
        if (val.checkbox[0] == '1') {
          if (val.radio == '0') {
            if (!val.input) {
              wx.showToast({
                title: '请输入临时昵称',
                icon: 'none',
                duration: 1500
            })
            }else{
              let param = {
                  head: this.data.useMes.headImg,
                  nickname: val.input
              }
              updateImMsg(param).then(res => {
                  wx.navigateTo({
                      url: '/04zhutipaidui/tansuo/tansuo?id='+this.data.themeId,
                  })
              })
            }
          } else {
              wx.navigateTo({
                  url: '/04zhutipaidui/tansuo/tansuo?id='+this.data.themeId,
              })
          }
        } else {
            wx.showToast({
                title: '请选择遵守玩家规则',
                icon: 'none',
                duration: 1500
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(wx.getStorageSync('loginInfo'));
        if (wx.getStorageSync('loginInfo')) {
            this.setData({
                useMes: wx.getStorageSync('loginInfo')
            })
        }
        this.setData({
            themeId: options.id,
        })
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