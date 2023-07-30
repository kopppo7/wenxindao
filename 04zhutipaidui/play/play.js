import SDK from '../../NIM_Web_SDK_miniapp_v9.6.3'
import {
  getRoomDetails,
} from "../api";
let pageIMInstance = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadOptions: {
      askId: '', //主题派对ID
      roomId: '', //房间ID
    }, //进入房间页面参数
    IMTeemInfo: {}, //IM当前游玩的群组信息
    roomData: {}, //房间基本信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      loadOptions: {
        askId: options.askId,
        roomId: options.roomId
      }
    })
    wx.showLoading({
      title: '正在加载房间信息...',
    })
    this.getRoomDetails(this.data.loadOptions.roomId);
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
  // 获取房间详情
  getRoomDetails(roomId) {
    var token = wx.getStorageSync('loginInfo').yunToken;
    var account = wx.getStorageSync('loginInfo').yunId;
    getRoomDetails({
      roomId: roomId
    }).then(res => {
      this.setData({
        roomData: {
          imGroup: res.data.data.imGroup,
          ownerUser: res.data.data.ownerUser,
          maxNumber: res.data.data.maxNumber,
          minNumber: res.data.data.minNumber,
          status: res.data.data.status
        }
      })
      let that = this;
      pageIMInstance = SDK.NIM.getInstance({
        debug: true, // 是否开启日志，将其打印到console。集成开发阶段建议打开。
        appKey: '820499c93e45806d2420d75aa9ce9846',
        account: account,
        token: token,
        db: true, //若不要开启数据库请设置false。SDK默认为true。
        onteammembers: this.onTeamMembers,
        // 连接成功
        onconnect: this.onConnect,
        // 钩子函数-初始化同步完成的回调
        onsyncdone: this.onsyncdone,
        //重新连接
        onwillreconnect: this.onWillReconnect,
        //断开连接
        ondisconnect: this.onDisconnect,
        onteams: function(teams){
          let team = teams.find(x=>x.teamId == that.data.roomData.imGroup);
        },
      })
    })
  },
  // 连接成功
  onConnect() {
    let that = this
    var account = wx.getStorageSync('loginInfo').yunId;
    // // 是匹配并且是房主那此时用户就是临时房主
    // if (this.data.isMatch && this.data.isOwner && !wx.getStorageSync('isLinShiFangZhu')) {
    //     this.setData({
    //         isLinShiFangZhu: true
    //     })
    // }
      pageIMInstance.getTeamMembers({
        teamId: that.data.roomData.imGroup,
        done: function(error,members){
        }
    });
    wx.hideLoading()
  },
  //重新连接
  onWillReconnect(obj) {
    wx.showLoading({
      title: '正在重新连接游戏...'
    })
  },
  onsyncdone() {
    pageIMInstance.getHistoryMsgs({
      scene: 'team',
      to: this.data.roomData.imGroup,
      done: function(log){
      },
      beginTime: 0,
      endTime: new Date().getTime()
    });
  },
  sendMsg(val){
    console.log(val.detail.value);
    var that = this;
    console.log(this.data.teamId);
    var msg = pageIMInstance.sendText({
        scene: 'team',
        to: this.data.roomData.imGroup,
        text: val.detail.value,
        done: that.pushMsg
    });
    this.setData({
        inputText: ''
    })
  },
  pushMsg(err,msg){
  },
  //断开连接
  onDisconnect(error) {
    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
    if (error) {
      switch (error.code) {
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          wx.showModal({
            title: '提示',
            content: '您已被房主踢出房间',
            success: function (params) {
              wx.navigateBack();
            },
            showCancel: false
          })
          break;
          // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
        case 417:
        default:
          wx.showModal({
            title: '异常',
            content: '聊天群组连接异常，请稍后重试',
            success: function (params) {
              wx.navigateBack();
            },
            showCancel: false
          })
          break;
      }
    }
  },

  // 群成员更新
  onTeamMembers(obj) {
    console.log('收到群成员', obj);
  },
})