// 04zhutipaidui/fupan/index.js
import {createBaoRoom, findByAskPartyOne, likeTeammate, quitRoom} from "../api";
import SDK from "../../NIM_Web_SDK_miniapp_v9.6.3";
import yunApi from "../../utils/yun";

var nim = null;
var APP = getApp();
var timeout = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        playerList: [],//玩家列表
        msgList: [],
        sec: 60,
        roomData:{},
        teamId:'',
        audioId:'',
        isOwner:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.creatRoom()
        this.countDown()
    },
    // 创建房间
    creatRoom() {
        var that = this;
        var roomData = wx.getStorageSync('roomData') || ''
        console.log('登陆过了');
        that.setData({
            teamId: roomData.imGroup,
            audioId: roomData.audioGroup,
            roomData: wx.getStorageSync('roomData')
        })
        that.initRoom()
    },
    //初始化房间
    initRoom() {
        var token = wx.getStorageSync('loginInfo').yunToken;
        var account = wx.getStorageSync('loginInfo').yunId;
        var that = this;
        if (wx.getStorageSync('roomData').ownerUserIm == account) {
            that.setData({
                // 是否是房主
                isOwner: true,
                nim: nim,
                account: wx.getStorageSync('loginInfo').yunId
            })
        } else {
            that.setData({
                nim: nim,
                account: wx.getStorageSync('loginInfo').yunId
            })
        }
        nim = SDK.getInstance({
            debug: false, // 是否开启日志，将其打印到console。集成开发阶段建议打开。
            appKey: '820499c93e45806d2420d75aa9ce9846',
            account: account,
            token: token || '',
            db: false, //若不要开启数据库请设置false。SDK默认为true。
            onteammembers: that.onTeamMembers,
            // privateConf: {}, // 私有化部署方案所需的配置
            onconnect: that.onConnect,
            onwillreconnect: that.onWillReconnect,
            onerror: that.onError,
            onteams: that.onTeams,
            onupdateteammember: that.onUpdateTeamMember,
            onAddTeamMembers: that.onAddTeamMembers,
            onRemoveTeamMembers: that.onRemoveTeamMembers,
            onmsg: that.onMsg
        });
        var accounts = []
        APP.globalData.truePlayerList.forEach(item => {
            accounts.push(item.account)
        })

        nim.getUsers({
            accounts: accounts,
            sync: true,
            done: that.getUsers
        });
    },


    // 群组更新
    onTeams(e) {
        console.log('收到群组', e);
        var that = this;
        nim.getTeamMembers({
            teamId: that.data.teamId,
            done: that.getTeamMembersDone
        });
    },
    getUserDone(error, user) {
        console.log(error);
        console.log(user);
        console.log('获取用户资料' + (!error ? '成功' : '失败'));
    },
    getTeamMembersDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('获取群成员' + (!error ? '成功' : '失败'));
        if (!error) {
            this.onTeamMembers(obj);
        }
    },
    // 群成员更新
    onTeamMembers(obj) {
        console.log('收到群成员', obj);
        var that = this


    },
    getUsers(error, users) {
        var list = users
        list.map(item => {
            item.zan = 0
            item.isZan = false
        })
        this.setData({
            playerList: list
        })
        console.log(list)
    },
    onUpdateTeamMember(teamMember) {
        console.log('群成员信息更新了', teamMember);

    },
    onAddTeamMembers(obj) {
        console.log('新人来了', obj);
        this.onTeamMembers(obj);
    },
    onRemoveTeamMembers(teamMember) {
        console.log('有人走了', teamMember.accounts[0]);
        var arr = APP.globalData.playerList;
        arr.forEach((item, index) => {
            if (item.account == teamMember.accounts[0]) {
                arr[index] = {}
            }
        })
        APP.globalData.playerList = arr

    },
    onDismissTeam(obj) {
        console.log('群解散了', obj);
    },
    onTransferTeam(team, newOrder, oldOrder) {
        console.log('移交群', team);
        console.log('移交群', newOrder);
        console.log('移交群', oldOrder);
    },
    // 收到消息
    onMsg(msg) {
        var text = JSON.parse(msg.text)
        var playerList = this.data.playerList

        if (text.type === 'add') {
            playerList[text.index].zan++
        } else {
            playerList[text.index].zan--
        }
        this.setData({
            playerList: playerList
        })
    },
    onCustomMsg() {

    },
    onTeamNotificationMsg(msg) {
        var msgList = APP.globalData.mesList
        msg.attach.users.forEach(item => {
            if (item.account == msg.attach.accounts[0]) {
                msg.name = item.nick
            }
        })
        if (msg.attach.type == 'addTeamMembers') {
            // 拉人入群
            var msgObj = {
                fromNick: msg.name,
                text: '加入对话',
                sysType: 'sys'
            }
            msgList.push(msgObj)
            getApp().globalData.mesList = msgList
        } else if (msg.attach.type == 'removeTeamMembers') {
            // 踢人出群
            var msgObj = {
                fromNick: msg.name,
                text: '被踢出对话',
                sysType: 'sys'
            }
            msgList.push(msgObj)
            getApp().globalData.mesList = msgList
            console.log(getApp().globalData.mesList);
        } else if (msg.attach.type == 'dismissTeam') {

        }
    },
    // 发送消息
    sendMsg(index, type) {
        var that = this;
        var msg = nim.sendText({
            scene: 'team',
            to: that.data.teamId,
            text: JSON.stringify({index: index, type: type}),
            done: that.pushMsg
        });
        console.log('正在发送p2p text消息, ' + msg.idClient);
    },
    // 发送自定义消息
    sendCustomMsg(type, val) {
        // console.log(val);
        // var that = this;
        // var content = {
        //     type: type,
        //     data: {
        //         status:val.status,
        //         value: val.text,
        //         cardList:val.list,
        //         audio:val.audio,
        //         video:val.video,
        //         img:val.imgUrl
        //     }
        // };
        // var msg = nim.sendCustomMsg({
        //     scene: 'team',
        //     to: that.data.teamId,
        //     content: JSON.stringify(content),
        //     done: that.pushMsg
        // });
        // console.log('正在发送自定义消息, ' + msg.idClient);
    },
    pushMsg(error, msg) {
        var text = JSON.parse(msg.text)
        var playerList = this.data.playerList

        if (text.type === 'add') {
            playerList[text.index].zan++
        } else {
            playerList[text.index].zan--
        }
        this.setData({
            playerList: playerList
        })
    },
    // onDismissTeam () { },
    // 解散群
    dismissTeam() {
        nim.dismissTeam({
            teamId: "7357056590",
            done: yunApi.dismissTeamDone
        });
    },
    dismissTeamDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('解散群' + (!error ? '成功' : '失败'));
    },
    //点赞
    dianZan: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index
        var item = this.data.playerList[index]
        var playerList = this.data.playerList
        if (!item.isZan) {
            likeTeammate({
                roomId:that.data.roomData.id,
                yunId:item.account
            }).then(res => {
                if (res.code === 200){
                    that.sendMsg(index, 'add')
                    playerList[index].isZan = true
                }
            })



        } else {
            // this.sendMsg(index, 'reduce')
            // playerList[index].isZan = false
        }
        this.setData({
            playerList: playerList
        })


    },

    //倒计时
    countDown: function () {
        var that = this;
        timeout = setTimeout(function () {
            that.setData({
                sec:(that.data.sec-1)
            })
            if (that.data.sec > 0){
                that.countDown()
            } else {
                that.quit()
            }
        },1000)
    },
    //离开
    quit:function () {

        console.log(this.data.isOwner)
        if (this.data.isOwner){
            nim.dismissTeam({
                teamId: this.data.teamId,
                done: dismissTeamDone
            });
        } else {
            nim.leaveTeam({
                teamId: this.data.teamId,
                done: leaveTeamDone
            });
        }
        wx.redirectTo({
            url: '/pages/index/index',
        })
        // wx.removeStorageSync('activeStatus')
        // wx.removeStorageSync('roomData')


        function dismissTeamDone(error, obj) {
            console.log('解散群' + (!error?'成功':'失败'), error, obj);
        }
        function leaveTeamDone(error, obj) {
            console.log('主动退群' + (!error?'成功':'失败'), error, obj);
        }

        // nim.disconnect()
        // nim.destroy()
        // quitRoom({
        //     roomId:this.data.roomData.id
        // }).then(res => {
        //     if (res.code === 200){
        //
        //
        //     }
        // })
        clearTimeout(timeout)
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
        clearTimeout(timeout)
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

    },

    watchBack: function (name, value) {

        console.log('name==' + name);


        let data = {};
        data[name] = value;
        this.setData(data);
    },
})
