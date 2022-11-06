import { login } from '../../../utils/common'
import {
  getHelpTypeList,
  getHelpList
} from "../../../utils/api";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        allTitle: [
        ],
        currentIndex: 0,
        questionList: [
        ]


    },
    //点击切换标题
    changeTitle(event) {
        let index = event.target.dataset.current;//当前点击标题的index
        var id = event.currentTarget.id
        this.setData({
            currentIndex: index
        })
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        });
        getHelpList({
          typeId:id
        }).then(res=>{
          this.setData({
            questionList:res.data.data
          })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      login(res=>{
        this.Init();
      })
    },
    Init(){
      getHelpTypeList().then(res=>{
        this.setData({
          allTitle:res.data.data
        });
        debugger
        getHelpList(res.data.data[0].id).then(list=>{
          this.setData({
            questionList:list.data.data
          })
        })
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
