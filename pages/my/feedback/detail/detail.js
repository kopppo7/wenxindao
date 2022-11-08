import {
  getHelpOne
} from "../../../../utils/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getHelpOne(options.id).then(res=>{
      this.setData({
        title:res.data.data.title,
        content:res.data.data.texts
      })
    })
  }
})