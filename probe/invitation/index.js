import {
  findInviteById,
  appletsLogin,
  getUserMsg
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigPopStatus: false,
    isAuth:false,
    bigCardImgUrl: '',
    id:'',
    shareId:'',
    fissionInfo:{},
    headImg:'',
    nickName:''
  },
  openBig(e) {
    this.setData({
      bigPopStatus: true
    })
  },
  showAuth(){
    this.setData({
      isAuth:true
    })
  },
  closeAuth(){
    this.setData({
      isAuth:false
    })
  },
  closePopBig(){
    this.setData({
      bigPopStatus: false
    })
  },
  chooseAvatar(e){
    this.setData({
      headImg:e.detail.avatarUrl
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id:options.id,
      shareId:options.shareId
    })
    findInviteById(options.shareId).then(res=>{
      this.setData({
        fissionInfo:res.data.data
      })
    })
    wx.login({
      success: function (res) {
        var obj = {
          code: res.code,
          role: 1
        };
        appletsLogin(obj).then(res => {
          wx.setStorageSync('tokenKey', res.data.data.token);
          getUserMsg(res.data.data.token).then(userInfo=>{
            if(userInfo.data.data.phone!=null&&userInfo.data.data.wechatName!=null){
              wx.navigateBack();
            }
          })
        })
      }
    });
  }
})