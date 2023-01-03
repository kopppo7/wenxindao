// 03shenmingtansuo/tansuo/tansuo.js
import NERTC from '../../NERTC_Miniapp_SDK_v4.6.11'
import SDK from '../../NIM_Web_SDK_miniapp_v9.6.3'
import config from "../../utils/config";
import {
    createBaoRoom,
    startPlayRoom,
    kickingPlayer,
    openBaoRoomMate,
    findByAskPartyOne, complaintUser, dissolveGroup
} from "../api";
import yunApi from "../../utils/yun";
var nim = null;
var downTime = Math.random() * 10 + 5;
var downTime2 = Math.random() * 10;
var APP = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sharePopStatus: false,
        activityPopStatus: true, //活动提示
        matePopStatus: false, //匹配中
        waitStatus: false, //等待状态
        mixPopStatus: false, //至少两人开始派对
        timePopStatus: false, //倒计时
        kickPopStatus: false, //踢人
        kickPlayer: {}, //要踢的人
        passerPopStatus: false, //匹配路人
        roomSetPopStatus: false, //房间设置
        payMatching: false, //付费or匹配
        step: 0,
        waitTime: '10',
        chatroom: null,
        account: "",
        teamId: "",
        audioId: "",
        voiceStatus: 0,//1可以说话2开始点击0禁止说话
        activeStatus: true,//活动提示
        playerList: [],
        mesList: [],
        isfriend: false,
        roomData: {},
        timeOut1: null, //匹配房间倒计时
        isOwner: false,
        isBeginPlay: false,//是否开始游戏
        isReady: false,//是否准备
        askId: '',//主题ID
        themeDetail: {},
        personInd:'',
        showTousuPop:false, //显示投诉弹窗
        tousuTextarea:'',//投诉内容
        tousuImage:[],//投诉图片
        tousuResaon:'',//投诉理由
    },
    // 活动提示
    activityChange () {
        var active = this.data.activeStatus
        this.setData({
            activeStatus: !active
        })
    },
    closeActivityPop () {
        this.setData({
            activityPopStatus: false
        })
        if (this.data.activeStatus == true) {
            wx.setStorageSync('activeStatus', this.data.activeStatus)
        }
        this.initRoom()
    },
    concleActivityPop () {
        wx.navigateBack({
            delta: 1,
        })
    },
    // 活动提示end

    openSharePop () {
        var that = this;
        that.setData({
            sharePopStatus: true
        })
    },
    closePop () {
        var that = this;
        that.setData({
            sharePopStatus: false,
            activityPopStatus: false,
            matePopStatus: false,
            waitStatus: false,
            mixPopStatus: false,
            timePopStatus: false,
            kickPopStatus: false,
            passerPopStatus: false,
            showTousuPop:false
        })
    },
    // 连接成功
    onConnect () {
        console.log('连接成功111');
    },
    // // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
    onWillReconnect (obj) {
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
    },
    onDisconnect (error) {
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
    onError (error) {
        console.log(error);
    },
    initRoom () {
        var token = wx.getStorageSync('loginInfo').yunToken;
        var account = wx.getStorageSync('loginInfo').yunId;
        var that = this;
        console.log(wx.getStorageSync('roomData').ownerUserIm);
        console.log(account);
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
            ondisconnect: that.onDisconnect,
            onerror: that.onError,
            onteams: that.onTeams,
            onupdateteammember: that.onUpdateTeamMember,
            onAddTeamMembers: that.onAddTeamMembers,
            onRemoveTeamMembers: that.onRemoveTeamMembers,
            onmsg: that.onMsg
        });
        console.log(nim)

    },
    // 群组更新
    onTeams (e) {
        console.log('收到群组', e);
        var that = this;
        nim.getTeamMembers({
            teamId: that.data.teamId,
            done: that.getTeamMembersDone
        });
    },
    getUserDone (error, user) {
        console.log(error);
        console.log(user);
        console.log('获取用户资料' + (!error ? '成功' : '失败'));
    },
    getTeamMembersDone (error, obj) {
        console.log(error);
        console.log(obj);
        console.log('获取群成员' + (!error ? '成功' : '失败'));
        if (!error) {
            this.onTeamMembers(obj);
        }
    },
    // 群成员更新
    onTeamMembers (obj) {
        console.log('收到群成员', obj);
        var that = this
        var accounts = []
        APP.globalData.truePlayerList = APP.globalData.truePlayerList.concat(obj.members);
        APP.globalData.truePlayerList.forEach(item => {
            console.log(item.account);
            accounts.push(item.account)
        })
        nim.getUsers({
            accounts: accounts,
            sync: true,
            done: that.getUsers
        });
    },
    getUsers (error, users) {
        var maxNum = this.data.roomData.maxNumber;
        if (APP.globalData.playerList[this.data.roomData.maxNumber - 1]?.account) {

        } else {
            APP.globalData.playerList[this.data.roomData.maxNumber - 1] = {};
            var members = APP.globalData.playerList
            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j < members.length; j++) {
                    if (!members[j]?.account) {
                        members[j] = users[i]
                        break
                    } else if (members[j]?.account == users[i]?.account) {
                        break
                    }
                }
            }
        }
        APP.globalData.playerList = members;
    },
    onUpdateTeamMember (teamMember) {
        console.log('群成员信息更新了', teamMember);

    },
    onAddTeamMembers (obj) {
        console.log('新人来了', obj);
        this.onTeamMembers(obj);
    },
    onRemoveTeamMembers (teamMember) {
        console.log('有人走了', teamMember.accounts[0]);
        var arr = APP.globalData.playerList;
        arr.forEach((item, index) => {
            if (item.account == teamMember.accounts[0]) {
                arr[index] = {}
            }
        })
        APP.globalData.playerList = arr

    },
    onDismissTeam (obj) {
        console.log('群解散了', obj);
    },
    onTransferTeam (team, newOrder, oldOrder) {
        console.log('移交群', team);
        console.log('移交群', newOrder);
        console.log('移交群', oldOrder);
    },
    // 收到消息
    onMsg (msg) {
        console.log('收到消息了', msg);
        // this.pushMsg(msg);
        switch (msg.type) {
            case 'custom':
                this.onCustomMsg(msg);
                break;
            case 'notification':
                // 处理群通知消息
                this.onTeamNotificationMsg(msg);
                break;
            // 其它case
            default:
                break;
        }
    },
    onCustomMsg () {

    },
    onTeamNotificationMsg (msg) {
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
                text: '加入派对',
                sysType: 'sys'
            }
            msgList.push(msgObj)
            getApp().globalData.mesList = msgList
        } else if (msg.attach.type == 'removeTeamMembers') {
            // 踢人出群
            var msgObj = {
                fromNick: msg.name,
                text: '被踢出派对',
                sysType: 'sys'
            }
            msgList.push(msgObj)
            getApp().globalData.mesList = msgList
            console.log(getApp().globalData.mesList);
        } else if (msg.attach.type == 'dismissTeam') {

        }
    },
    // 发送消息
    sendMsg (val) {
        console.log(val.detail.value);
        var that = this;
        console.log(this.data.teamId);
        var msg = nim.sendText({
            scene: 'team',
            to: that.data.teamId,
            text: val.detail.value,
            done: that.pushMsg
        });
        console.log('正在发送p2p text消息, ' + msg.idClient);
    },
    // 发送自定义消息
    sendCustomMsg (type, val) {
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
    pushMsg (error, msg) {
        console.log(error);
        console.log(msg);
        console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
        var msgList = APP.globalData.mesList
        if (msg.content) {
            var content = JSON.parse(msg.content)
            if (content.type == 1) {
                // 自定义消息type为1的时候 玩家准备
                var play = APP.globalData.playerList;
                play.forEach(item => {
                    if (item.account == msg.from) {
                        item.isReady = content.data.status
                    }
                })
                APP.globalData.playerList = play;
                console.log(APP.globalData.playerList);
            } else if (content.type == 2) {
                // 自定义消息type为2的时候 玩家是否轮到发言
                APP.globalData.playerList.forEach(item => {
                    if (item.account == msg.from) {
                        item.isActive = content.data.status
                    }
                })
            } else if (content.type == 3) {
                // 自定义消息type为3的时候 玩家是否在线
                APP.globalData.playerList.forEach(item => {
                    if (item.account == msg.from) {
                        item.isActive = content.data.status
                    }
                })
            } else if (content.type == 4) {
                // 自定义消息type为4的时候 为系统文字消息
                var msgObj = {
                    sysType:'sys',
                    text:content.data.value,
                }
                msgList.push(msgObj)
                APP.globalData.mesList = msgList
                console.log(APP.globalData.mesList);
            } else if (content.type == 5) {
                // 自定义消息type为5的时候 为系统发牌消息
                var msgObj = {
                    sysType:'sys',
                    cardList:content.data.cardList,
                }
                msgList.push(msgObj)
                APP.globalData.mesList = msgList
                console.log(APP.globalData.mesList);
            }
        } else {
            var msgObj = {
                fromNick: msg.fromNick,
                text: msg.text,
            }
            msgList.push(msgObj)
            APP.globalData.mesList = msgList
        }
    },
    // onDismissTeam () { },
    // 解散群
    dismissTeam () {
        dissolveGroup({
            id:53,
            token:'9f011c22-e886-4344-b450-ec546d52c0ba'
        })
    },
    dismissTeamDone (error, obj) {
        console.log(error);
        console.log(obj);
        console.log('解散群' + (!error ? '成功' : '失败'));
    },
    // 创建房间
    creatRoom () {
        let params = {
            askId: this.data.askId
        }
        var that = this;
        var roomData = wx.getStorageSync('roomData') || ''
        if (wx.getStorageSync('roomData')) {
            console.log('登陆过了');
            that.setData({
                teamId: roomData.imGroup,
                audioId: roomData.audioGroup,
                roomData: wx.getStorageSync('roomData')
            })
            // 是匹配还是包房
            if (wx.getStorageSync('roomData').matchType == 1) {
                that.initRoom()
            } else {
                that.setData({
                    matePopStatus: true,
                })
                that.getDownTime()
            }
        } else {
            createBaoRoom(params).then(res => {
                wx.setStorageSync('roomData', res.data.data)
                that.setData({
                    teamId: res.data.data.imGroup,
                    audioId: res.data.data.audioGroup,
                    roomData: res.data.data
                })
                // 是匹配还是包房
                if (wx.getStorageSync('roomData').matchType == 1) {
                    that.initRoom()
                } else {
                    that.setData({
                        matePopStatus: true,
                    })
                    that.getDownTime()
                }
            })
        }
    },
    getDownTime (downtimes) {
        var time1 = 0;
        var that = this;
        if (downtimes) {
            // var time = setInterval(() => {
            //     if (downtimes <= 1) {
            //         that.setData({
            //             timePopStatus: false,
            //         })
            //         clearInterval(time)
            //     } else {
            //         downtimes--
            //         if (downtimes < 10) {
            //             downtimes = '0' + downtimes
            //         }
            //         that.setData({
            //             waitTime: downtimes
            //         })
            //     }
            // }, 1000);
        } else {
            // var time = setInterval(() => {
            //     if (time1 > 9) {
            //         that.setData({
            //             matePopStatus: false,
            //         })
            //         clearInterval(time)
            //         this.initRoom()
            //     } else {
            //         time1++
            //         if (time1 < 10) {
            //             time1 = '0' + time1
            //         }
            //         that.setData({
            //             waitTime: time1
            //         })
            //     }
            // }, 1000);
        }
    },
    handleReady () {
        this.setData({
            isReady: !this.data.isReady
        })
        this.sendCustomMsg(1, {status:this.data.isReady})
    },
    handleInviFriend () {

    },
    handleInviRoad () {
        this.setData({
            passerPopStatus: true
        })
    },
    handleInviRoadDone () {
        var that = this
        openBaoRoomMate({
            id: that.data.roomData.id
        }).then(res => {
            this.setData({
                passerPopStatus: false
            })
        })
    },
    handleBegin () {
        var num = 0;
        var that = this;
        var userIm = []
        this.data.playerList.forEach(item => {
            if (item.account) {
                userIm.push(item.account)
                num++
            }
        })
        if (num > 1) {
            //开始游戏
            startPlayRoom({
                roomId: that.data.roomData.id,
                userIm
            }).then(res => {
                this.setData({
                    isBeginPlay: true,
                    voiceStatus: 1,
                    timePopStatus: true,
                    personInd:0
                })
                that.sendCustomMsg(4,{text:'派对游戏开始，发牌中...'})
                that.getDownTime(10)
                this.setData({
                    step:1
                })
            })
        } else {
            this.setData({
                mixPopStatus: true
            })
        }
    },
    // 踢人
    handleKick (e) {
        console.log(this.data.account);
        console.log(this.data.roomData.ownerUserIm);
        if (this.data.roomData.ownerUserIm == this.data.account && e.currentTarget.dataset.item.account != this.data.account) {
            this.setData({
                kickPopStatus: true,
                kickPlayer: e.currentTarget.dataset.item
            })
        } else {
            console.log('不能踢自己或者你不是房主');
        }
    },
    handleKickDone () {
        var that = this;
        kickingPlayer({
            yunId: that.data.kickPlayer.account,
            roomId: that.data.roomData.id
        }).then(res => {
            this.setData({
                kickPopStatus: false,
                kickPlayer: {}
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {
        // this.creatRoom()
        var that = this;
        getApp().watch('playerList', that.watchBack);
        getApp().watch('mesList', that.watchBack);
        this.setData({
            isfriend: options.isfriend || false,
            askId: options.askId || ''
        })
        findByAskPartyOne({
            id: that.data.askId
        }).then(res => {
            console.log(res);
            let richText = res.data.data.detailsText
            res.data.data.detailsText = richText
                .replace(/\<img/gi, '<img style="width:100%;height:auto;"')
                .replace(/\<p/gi, '<p class="p_class"')
                .replace(/\<span/gi, '<span class="span_class"')
            that.setData({
                themeDetail: res.data.data
            })
            wx.setNavigationBarTitle({
                title: res.data.data.title
            })

        })
        console.log('this.data.theme', this.data.themeDetail);
        console.log(this.askId);
        if (wx.getStorageSync('activeStatus')) {
            this.setData({
                activityPopStatus: false
            })
            this.creatRoom()

            if (options.isfriend) {
            } else {
                // 倒计时等待
                this.getDownTime()
            }

        }
    },

    watchBack: function (name, value) {
        console.log('name==' + name);
        console.log(value);
        console.log(getApp().globalData.playerList);
        let data = {};
        data[name] = value;
        this.setData(data);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {
        // this.chatroom.destroy({
        //     done(err) {
        //         console.log('desctroy success', err)
        //     }
        // })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {

    },

    //投诉
    handleTousu:function () {
        this.setData({
            showTousuPop:true,
            tousuResaon:1
        })
    },
    //选择投诉理由
    radioChange:function (e) {
        this.setData({
            tousuResaon:e.detail.value
        })

    },
    //上传投诉图片
    callGetPic: function () {
        let that = this;

        if(this.data.tousuImage.length >= 4){
            wx.showToast({
                title: '最多上传9张图片',
                icon: 'none'
            })
            return false
        }

        wx.chooseImage({
            count: 4, // 最多上传4张
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                let tempFilePaths = res.tempFilePaths;
                console.log(res)
                wx.showLoading({
                    title: '正在上传...',
                    mask: true
                });
                that.uploadImg(tempFilePaths,0)
            }
        })
    },
    //上传图片
    uploadImg:function (tempFilePaths,index) {
        var that = this;
        let token = wx.getStorageSync('tokenKey');
        wx.uploadFile({
            url: config.getDomain + '/oss/upload/uploadFile',
            filePath: tempFilePaths[index],
            name: 'file',
            header: { "Content-Type": "multipart/form-data", 'token': token },
            formData: {
                'file': 'file'
            },
            success (res) {
                try {
                    var data = JSON.parse(res.data);
                    var image = that.data.tousuImage
                    if (data.ret == 200) {
                        image.push(data.data)
                        that.setData({
                            tousuImage: image
                        })
                        if (index === (tempFilePaths.length-1)){
                            wx.hideLoading();
                        } else {
                            that.uploadImg(tempFilePaths,(index+1))
                        }
                    }
                } catch {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none'
                    })
                }
            },
            fail () {
                wx.hideLoading();
            }
        })
    },
    //删除图片
    delPic:function (e) {
        var index = e.currentTarget.dataset.index
        var images = this.data.tousuImage
        images.splice(index,1)
        this.setData({
            tousuImage:images
        })
    },
    //输入投诉内容
    textInput:function (e) {
        this.setData({
            tousuTextarea:e.detail.value
        })
    },
    //提交投诉
    tousuSubmit:function () {
        var data = this.data
        console.log(data.kickPlayer)
        console.log(data.tousuResaon)
        console.log(data.tousuImage)
        console.log(data.tousuTextarea)
        console.log(APP.globalData.truePlayerList )
        var par = {
            content:data.tousuTextarea,
            roomId:data.roomData.id,
            imgUrl:data.tousuImage.join(','),
            type:data.tousuResaon,
            yunId:data.kickPlayer.account
        }
        complaintUser(par).then(res => {
            console.log(res)
        })
    },
    //去结尾畅聊
    toEnd:function () {
        wx.redirectTo({
            url: '/04zhutipaidui/fupan/index'
        })
    }
})
