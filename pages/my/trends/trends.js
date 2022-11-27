import { login } from '../../../utils/common'
import {
  findMyTrends
} from "../../../utils/api";
import {
  getLoginInfo
} from "../../../utils/stoage"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: [
            {
                title: '全部',
                num: 0
            },
            {
                title: '每日调频',
                num: 53
            },
            {
                title: '生命探索',
                num: 3
            },
            {
                title: '主题派对',
                num: 24
            }
        ],
        cur_tab: 0,
        showPop: false,
        page:1,
        list:[],
        total:0
    },
    // 切换tab
    changeCurTab: function (e) {
        this.setData({
            cur_tab: e.currentTarget.dataset.index
        })
    },
    // 显示弹窗
    openPop: function () {
        this.setData({
            showPop: true
        })
    },
    // 隐藏弹窗
    closePop: function () {
        this.setData({
            showPop: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      login(res=>{
        this.getData();
      })
    },
    getData(){
      wx.showLoading({
        title: '加载中...',
      });
      findMyTrends({
        page:this.data.page,
        pageSize:20
      }).then(res=>{
        for(var i=0;i<res.data.data.list.length;i++){
          res.data.data.list[i].data = JSON.parse(res.data.data.list[i].contents);
        }
        if(this.data.page==1){
          this.data.list = res.data.data.list;
        }else{
          this.data.list.concat(res.data.data.list);
        }
        this.setData({
          list:this.data.list,
          total:res.data.data.total
        })
        console.log(this.data.list)
        wx.stopPullDownRefresh()
        wx.hideLoading();
      }).catch(err=>{
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon:'none'
        })
        wx.hideLoading();
      })
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

})
