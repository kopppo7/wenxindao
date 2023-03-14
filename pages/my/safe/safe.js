// 06wode/zhanghuyuanquan/zhanghuyuanquan.js
import {
  getLoginInfo
} from "../../../utils/stoage"
import {
  sendCodeForUpdate,userLoginOut,updatePhone
} from "../../../utils/api";
import { login } from '../../../utils/common'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{
          headImg:'',
          wechatName:'',
          phone: ''
        },
        telPopStatus: false,
        codePopStatus: false,


        countdown: 10,
        interval:'', // 定时器
        sending:false, // 发送中
        code: '', // 短信验证码
        phone: '',
        key: '', // 接口返回的
        errorStatus: false,
        errorTxt: '手机号格式输入错误',

    },
    // 获取手机号
    getPhone(e) {
      this.setData({
        phone: e.detail.value
      })
    },
     // 获取验证码
     getCode(e) {
      this.setData({
        code: e.detail.value
      })
      if(e.detail.value.length == 6){
        updatePhone({
          phone: this.data.phone,
          key: this.data.key,
          code: e.detail.value
        }).then((res) => {
          updateInfo()
        })
      }
    },
    // 更新信息
    async updateInfo() {
      await login();
      let info = getLoginInfo();
      this.setData({
        userInfo:info
      });
    },
    // 更换手机号
    changeTel: function(){
        let that = this;
        that.setData({
            telPopStatus: true
        })
    },
    // 关闭弹框狂
    closePop: function(){
        let that = this;
        that.setData({
            telPopStatus: false
        })
    },
    // 关闭错误提示
    closeError() {
      this.setData({
        errorStatus: false
       })
    },
    //倒计时
    count:function(){
        this.setData({
          sending: true,
          codePopStatus:true,
          telPopStatus:false,
        })
        this.data.sending = true
        let that = this
        this.interval = setInterval(function () {
          let countdown = that.data.countdown;
          if(countdown > 1) {
            countdown--;
            that.setData({
                countdown: countdown
            })
          } else {
            that.setData({
              countdown: 60,
              sending: false
            })
            clearInterval(that.interval)
          }
        }, 1000)
    },
    //获取验证码
    send: function () {
        let that=this;
        if(!this.data.phone){
          wx.showToast({
            title: '请填写手机号',
            icon: 'none',
          })
          return
        }
        let pt = /^[1][3-9][\d]{9}/
        if(!pt.test(this.data.phone)){
          this.setData({
            errorStatus: true,
            errorTxt: '手机号格式输入错误'
          })
          return
        }
        sendCodeForUpdate({
          phone: this.data.phone
        }).then((res) => {
          debugger
          that.setData({
            key: res.data.data
          })
          that.count()
        })
    },
    // 退出登录
    lagout() {
      let that = this
      wx.showModal({
        title: '提示',
        content: '是否确定退出',
        success (res) {
          if (res.confirm) {
            userLoginOut().then((res) => {
              wx.redirectTo({
                url: '/pages/auth/auth',
              })
            })
          } else if (res.cancel) {
            
          }
        }
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // this.count(this)
        clearInterval(this.interval)
        let info = getLoginInfo();
        this.setData({
          userInfo:info
        });
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
