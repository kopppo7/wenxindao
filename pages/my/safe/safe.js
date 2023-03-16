// 06wode/zhanghuyuanquan/zhanghuyuanquan.js
import {
  getLoginInfo
} from "../../../utils/stoage"
import {
  sendCodeForUpdate,userLoginOut,updatePhone,updateUserMsg,getUserMsg
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
        namePopStatus:false,
        nickName:'',
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
        wx.showLoading({
          title: '校验中...',
        })
        updatePhone({
          phone: this.data.phone,
          key: this.data.key,
          code: e.detail.value
        }).then((res) => {
          wx.hideLoading()
          if(res.data.ret==200){
            this.updateInfo()
            wx.showToast({
              title: '手机号更换成功',
            })
            this.setData({
              telPopStatus:false,
            })
          }else{
            wx.showToast({
              title: res.data.msg
            })
          }
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
    changeName:function(){
      let that = this;
      that.setData({
        namePopStatus: true,
        nickName:that.data.userInfo.rname
      })
    },
    updateName(){
      console.log(this.data.nickName)
      if(this.data.nickName==''||this.data.nickName==null){
        wx.showToast({
          title: '昵称不能为空',
        });
        return;
      }
      let obj = this.data.userInfo;
      obj.nickname=this.data.nickName;
      updateUserMsg(obj).then(res=>{
        if(res.data.ret==200){
          let user = this.data.userInfo;
          user.rname=this.data.nickName;
          user.wechatName=this.data.nickName;
          this.setData({
            userInfo:user,
            namePopStatus:false
          });
          wx.showToast({
            title: '昵称修改成功',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      })
    },
    // 关闭弹框狂
    closePop: function(){
        let that = this;
        that.setData({
            telPopStatus: false,
            namePopStatus:false
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
          if(res.data.ret==200){
            that.setData({
              key: res.data.data
            })
            that.count()
          }else{
            wx.showToast({
              title: res.msg,
            })
          }
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
      getUserMsg().then(res=>{
        this.setData({
          userInfo:res.data.data
        });
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
