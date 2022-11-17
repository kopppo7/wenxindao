// pages/telLogin/index.js
import {
  sendCode,
  phoneLogin
} from "../../utils/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numArr:['+86','+87'],
    telphone:"",
    msg:"",
    activeNum:'+86',
    downTime:60,
    disabled:false,
    codebtn:"获取验证码",
    code:"",
    key:"",
  },
  bindPickerChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      activeNum: this.data.numArr[e.detail.value]
    })
  },
  getMsg(e){
    this.setData({
      msg: e.detail.value
    })
  },
  // 获取输入账号 
  testPhone: function (e) {
    let phone = e.detail.value;
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon:"none",
        duration:2000
      })
      return false;
    }
    this.setData({
      telphone: e.detail.value
    })
  },
  //发送验证码
  sendcode(res){
    var phone=this.data.telphone;
    var time = 60;
    var that=this;
    sendCode({phone:phone}).then(res=>{
      if(res.data.ret==200){
        wx.showToast({
          title: '验证码已发送.请注意接收',
          icon:"success"
        })  
      
        var timers=setInterval(function () {
          time--;
          if (time>0){
            that.setData({
              codebtn:time+'s后重新获取',
              disabled:true
            });
          }else{
            that.setData({
              codebtn:'获取验证码',
              disabled:false
            });
            clearInterval(timers)
          }
        },1000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:"none",
          duration:2000
        })
      }
      this.setData({
        key:res.data.data,
      })
    })
    
  },
  // 登录处理
  login(e){
    var phone=this.data.telphone
    var code=this.data.msg
    var key=this.data.key
    phoneLogin({
      phone,
      code,
      key
    }).then(res=>{
      if(res.data.ret==200){
        wx.redirectTo({
          url: '/pages/index/index',
        })
     }else{
      wx.showToast({
        title: res.data.msg,
        icon:"none",
        duration:2000
      })
     }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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