// pages/login/login.js
import {
    appletsLogin,
} from "../../utils/api";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        agreeStatus: true,
        useInfor: {
            phone: "",
            nickname: "",
            headimgurl: "",
            citys: "",
        }
    },

    clickAgree() {
        var that = this;
        console.log(that.data.agreeStatus);
        that.setData({
            agreeStatus: !that.data.agreeStatus
        })
    },
    getPhone(e) {

        console.log(e);
        let that = this
        that.encryptedData = e.detail.encryptedData
        that.iv = e.detail.iv
        that.wxLogin()
    },
    wxLogin(e) {
        console.log(e);
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    var obj = {
                        code: res.code,
                        role: 1
                    }
                    appletsLogin(obj).then(res => {
                        console.log(res.data.data.token);
                        try {
                            wx.setStorageSync('tokenKey', res.data.data.token)
                            wx.setStorage({
                                key: "tokenKey",
                                data: res.data.data.token,
                                success() {
                                    wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            })
                        } catch (e) {}

                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    telLogin() {
        wx.navigateTo({
            url: '',
        })
    },
    lookSelf() {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this;
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    let user = {};
                    wx.getUserInfo({
                        success: function(res) {
                            console.log(res.userInfo)
                            user.nickname = res.userInfo.nickName
                            user.headimgurl = res.userInfo.avatarUrl
                            user.citys = res.userInfo.city
                            that.setData({
                                useInfor: user
                            })
                        }
                    })
                }
            }
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