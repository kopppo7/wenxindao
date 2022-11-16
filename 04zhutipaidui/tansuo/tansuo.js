// 03shenmingtansuo/tansuo/tansuo.js
import Chatroom from '../../NIM_Web_Chatroom_miniapp_v9.6.3'
// import SDK from '../../NERTC_Miniapp_SDK_v4.6.11'
import SDK from '../../NIM_Web_SDK_miniapp_v9.6.3'
import {
    createBaoRoom,
} from "../api";
import yunApi from "../../utils/yun";
var nim = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sharePopStatus: false,
        activityPopStatus: false, //活动提示
        matePopStatus: false, //匹配中
        waitStatus: false, //等待状态
        mixPopStatus: false, //至少两人开始派对
        timePopStatus: false, //倒计时
        kickPopStatus: false, //踢人
        passerPopStatus: false, //匹配路人
        roomSetPopStatus: false, //房间设置
        step: 0,
        waitTime: '00:23',
        chatroom: null,
    },
    openSharePop() {
        var that = this;
        that.setData({
            sharePopStatus: true
        })
    },
    closePop() {
        var that = this;
        that.setData({
            sharePopStatus: false,
            activityPopStatus: false,
            matePopStatus: false,
            waitStatus: false,
            mixPopStatus: false,
            timePopStatus: false,
            kickPopStatus: false,
            passerPopStatus: false
        })
    },
    // 连接成功
    onConnect() {
        console.log('连接成功');
    },
    // // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
    onWillReconnect(obj) {
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
    },
    onDisconnect(error) {
        // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('丢失连接');
        console.log(error);
        if (error) {
            switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    break;
                    // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                case 417:
                    break;
                    // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    break;
                default:
                    break;
            }
        }
    },
    onError(error) {
        console.log(error);
    },
    onChatroomConnect(obj) {
        console.log('进入聊天室', obj);
        // 连接成功后才可以发消息
        var msg = chatroom.sendText({
            text: 'hello',
            done: function sendChatroomMsgDone(msgObj) {}
        })
    },
    onChatroomWillReconnect(obj) {
        // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连', obj);
    },
    onChatroomDisconnect(error) {
        // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('连接断开', error);
        if (error) {
            switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    break;
                    // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    break;
                default:
                    break;
            }
        }
    },
    onChatroomError(error, obj) {
        console.log('发生错误', error, obj);
    },
    onChatroomMsgs(msgs) {
        console.log('收到聊天室消息', msgs);
    },
    initRoom() {
        var token = wx.getStorageSync('loginInfo').yunToken;
        var account = wx.getStorageSync('loginInfo').yunId;
        console.log('token',token);
        nim = SDK.NIM.getInstance({
            debug: true, // 是否开启日志，将其打印到console。集成开发阶段建议打开。
            appKey: '7bee3b2342a67bdcf975ce177a142dee',
            account: account,
            token: token || '',
            db: true, //若不要开启数据库请设置false。SDK默认为true。
            // privateConf: {}, // 私有化部署方案所需的配置
            // onconnect: this.onConnect,
            // onwillreconnect: this.onWillReconnect,
            // ondisconnect: this.onDisconnect,
            // onerror: this.onError
            onteams: this.onTeams,
        });
        // var chatroom = Chatroom.getInstance({
        //     appKey: '7bee3b2342a67bdcf975ce177a142dee',
        //     account: account,
        //     token: token || '',
        //     chatroomId: 'chatroomId',
        //     chatroomAddresses: [
        //         'address1',
        //         'address2'
        //     ],
        //     onconnect: this.onChatroomConnect,
        //     onerror: this.onChatroomError,
        //     onwillreconnect: this.onChatroomWillReconnect,
        //     ondisconnect: this.onChatroomDisconnect,
        //     // 消息
        //     onmsgs: this.onChatroomMsgs
        // });
        this.setData({
            nim:nim,
            // chatroom

        })
        document.getElementById(FormData)
        console.log(nim);
    },
    onTeams(e){
        console.log('收到群组',e);
    },
    // 解散群
    dismissTeamDone(){
        nim.dismissTeam({
            teamId: '7243383886',
            done: yunApi.dismissTeamDone
        });
    },
    creatRoom(){
        let params = {
            askId:'9'
        }
        createBaoRoom(params).then(res=>{
            console.log('创建房间');
            this.initRoom()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // this.initRoom()
        this.creatRoom()
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
        // this.chatroom.destroy({
        //     done(err) {
        //         console.log('desctroy success', err)
        //     }
        // })
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