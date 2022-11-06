import { login } from '../../../utils/common'
import {
  findByOrderList
} from "../../../utils/api";
Page({

    /**
     * 页面的初始数据
     */
    data: {
      page:1,
      list:[],
      total:0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      login(()=>{
        this.getData();
      })
    },
    getData(){
      wx.showLoading({
        title: '加载中...',
      });
      findByOrderList({
        page:this.data.page,
        pageSize:20
      }).then(res=>{
        if(this.data.page==1){
          this.data.list = res.data.data.list;
        }else{
          this.data.list.concat(res.data.data.list);
        }
        this.setData({
          list:this.data.list,
          total:res.data.data.total
        })
        wx.stopPullDownRefresh()
        wx.hideLoading();
      }).catch(err=>{
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon:'error'
        })
        wx.hideLoading();
      })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      this.data.page=1;
      this.getData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
      if(this.data.list.length<this.data.total){
        this.data.page+=1;
        this.getData();
      }
    }
})
