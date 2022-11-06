import { login } from '../../utils/common'
import {
  getLoginInfo
} from "../../utils/stoage"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      headImg:'',
      wechatName:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    login(res=>{
      this.Init()
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  Init(){
    var info = getLoginInfo();
    this.setData({
      userInfo:info
    });
  }
})