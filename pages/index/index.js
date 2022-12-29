import { login } from '../../utils/common'
import {
  indexFlow
} from "../../utils/api";

//获取应用实例
const app = getApp();

Page({
    data: {
        lists: [],
        stopUse:false,
        phoneNumber:"999 9090",
        relieveTime:"",
        page:1,
        list:[],
        total:0
    },
    callNum(){
      wx.makePhoneCall({
        phoneNumber: this.data.phoneNumber,
      })
    },
    sure(){
      this.setData({
        stopUse:false
      })
    },
    onLoad: async function () {
      var that = this;
      await login(function(){
        that.getData();
      });
      if (wx.getStorageSync('loginInfo').relieveTime) {
        this.setData({
          relieveTime:wx.getStorageSync('loginInfo').relieveTime,
          stopUse:true
        })
      }
    },
    goParty(){
      wx.showModal({
        title: '主题派对功能正在开发中...',
        showCancel:false
      })
    },
    
    getData(){
      indexFlow({
        page:this.data.page,
        pageSize:10
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
});
