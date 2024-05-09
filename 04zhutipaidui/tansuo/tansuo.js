// 03shenmingtansuo/tansuo/tansuo.js
import YunXinMiniappSDK from '../../NERTC_Miniapp_SDK_v4.6.11'
import SDK from '../../NIM_Web_SDK_miniapp_v9.6.3'
import config from "../../utils/config";
import {
    createBaoRoom,
    startPlayRoom,
    kickingPlayer,
    openBaoRoomMate,
    getRoomDetails, roomMatchingPlay,
    findByAskPartyOne, complaintUser, dissolveGroup, findByCard, addCardForRoom, quitRoom, likeTeammate, addRoomLog, inviteFriendsRoom, getIfFreeMy, insertEvaluate
} from "../api";
import { formatMsgList } from "../../utils/yun";
import { findByOrderList, getUserMsg } from "../../utils/api";

var nim = null;
var YunXinNertc = null;
var downTime = Math.random() * 10 + 5;
var downTime2 = Math.random() * 10;
var APP = getApp();
var timeInt = null
var timeout = null
var readyTimeout = null
var startTimeout = null
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
        kickPopType: '',
        kickPlayer: {}, //要踢的人
        passerPopStatus: false, //匹配路人
        roomSetPopStatus: false, //房间设置
        payMatching: false, //付费or匹配
        step: 0,
        changeStep: 0,
        waitTime: '00',
        chatroom: null,
        account: "",
        nickName: "",
        teamId: "",
        audioId: "",
        voiceStatus: 0,//1可以说话2开始点击0禁止说话
        inputStatus: 0,//1可以输入 0 禁止输入
        activeStatus: true,//活动提示
        mesList: [],
        isfriend: false,
        roomData: {},
        timeOut1: null, //匹配房间倒计时
        isOwner: false,
        isBeginPlay: false,//是否开始游戏
        isReady: false,//是否准备
        askId: '',//主题ID
        themeDetail: {},
        personInd: '',
        roomId: '',
        showTousuPop: false, //显示投诉弹窗
        tousuTextarea: '',//投诉内容
        tousuImage: [],//投诉图片
        tousuResaon: '',//投诉理由,
        show_speak_count_down: false,//显示发言倒计时
        show_think_count_down: false,//显示思考倒计时
        endId: '',
        scrollTo: 0,
        bottomHeight: 10,
        helpText: '',
        stepCardList: [],
        stepCardListCopy: [],
        stepCardListAll: [],
        canClickCard: true,
        bigPopStatus: false,
        selectImgUrl: '',
        isJump: false,//是否跳过
        jumpNum: 0,//跳过次数
        jumpPopStatus: false,
        jumpPopStatus2: false,
        jumpPopStatus3: false,
        jumpPopStatus4: false,
        jumpPopStatus5: false,
        stepList: [],//轮导航列表
        showOtherStep: false,//显示其他轮
        stepMsgList: [],//其他轮信息内容
        viewAccount: '',//查看用户发言
        contPasserPopStatus: false, //继续等待路人
        showFupan: false,
        showPlayerList: [],
        sec: 1200,//复盘倒计时
        inputText: '',

        //准备弹窗
        readyPopStatus: false,
        readyTime: 5,

        //页面参数
        pageOptions: {},

        //云信成员列表
        truePlayerList: [],
        //小程序内成员列表
        playerList: [],
        //消息列表
        msgList: [],
        //云信原始消息列表
        yunMsgList: [],
        // 上面的数据
        topArr: [],
        // 下面的数据
        botArr: [],
        haveRoom: true,  //刚进来的时候房间是否存在
        kefuPop: false,  //客服弹窗
        isTuichufangjian: false, //结语处退出房间弹窗
        isPaiduiKaishi: false,  //进来的时候派对是否开始
        isTuiChuRoom: false,
        fupanIsSay: true,
        fupanIsVoice: true,
        isLinShiFangZhu: false,
        isZhongTuTuiChu: false,
        isRoomGuiZe: false,
        beiTiAccount: '',
        isBeiTi: false,
        ownerName: '', //房主昵称
        isFaYan: false,
        isLastPeople: false,
        lastPeoplePop1: false,
        lastPeoplePop2: false,
        leaveUserInfor: null, //离开房间人的信息
        socket: null,
        SocketInterval: null,
        isOnloadSocket: false,
        audioPlayUrl: '',
        audioPushUrl: '',
        uid: '',//音视频房间自己的uid
        remoteStreams: [],
        localStream: [],
        playIsMuted: false, //音频是否静音
        pushIsMuted: true, //是否开启麦克风
        gwPopStatus: false,//感悟弹窗
        rating: 4,

    },
    //关闭弹窗
    closePop (clear) {
        var that = this;
        that.setData({
            sharePopStatus: false,
            activityPopStatus: false,
            waitStatus: false,
            mixPopStatus: false,
            matePopStatus: false,
            timePopStatus: false,
            kickPopStatus: false,
            passerPopStatus: false,
            showTousuPop: false,
            jumpPopStatus: false,
            jumpPopStatus2: false,
            jumpPopStatus3: false,
            jumpPopStatus4: false,
            contPasserPopStatus: false,
            roomSetPopStatus: false,
            kefuPop: false,
            isTuichufangjian: false,
            isZhongTuTuiChu: false,
            isRoomGuiZe: false,
            isLinShiFangZhu: false,
            lastPeoplePop1: false,
            lastPeoplePop2: false,
            gwPopStatus: false,
        })
        if (clear == 1 && timeInt) {
            clearInterval(timeInt)
            timeInt = null
        }
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
        // this.creatRoom()
    },
    cancelActivityPop () {
        this.leaveRoomClear()
    },
    // 活动提示end

    //------------------------------------分享-------------------------------------------------------------
    //分享弹窗
    openSharePop () {
        var that = this;
        that.setData({
            sharePopStatus: true
        })
    },
    //------------------------------------分享end-----------------------------------------------------------

    //-------------------------------------云信-----------------------------------------------------------
    //初始化房间
    initRoom () {

        var token = wx.getStorageSync('loginInfo').yunToken;
        var account = wx.getStorageSync('loginInfo').yunId;
        
        var that = this;
        nim = SDK.getInstance({
            debug: false, // 是否开启日志，将其打印到console。集成开发阶段建议打开。
            appKey: '820499c93e45806d2420d75aa9ce9846',
            account: account,
            token: token || '',
            db: false, //若不要开启数据库请设置false。SDK默认为true。
            // 群成员更新
            onteammembers: that.onTeamMembers,
            // 连接成功
            onconnect: that.onConnect,
            //重新连接
            onwillreconnect: that.onWillReconnect,
            //断开连接
            ondisconnect: that.onDisconnect,
            //报错信息
            onerror: that.onError,
            // 群组信息
            onteams: that.onTeams,
            //群成员信息更新
            onupdateteammember: that.onUpdateTeamMember,
            //新人来了
            onAddTeamMembers: that.onAddTeamMembers,
            //有人走了
            onRemoveTeamMembers: that.onRemoveTeamMembers,
            // 收到消息
            onmsg: that.onMsg
        });
        if (that.data.roomData.ownerUserIm == account) {
            that.setData({
                // 是否是房主
                isOwner: true,
                account: account,
            })
        } else {
            that.setData({
                account: account,
            })
        }
        if (this.data.roomData.ownerUserIm != account) {
            this.showReadyPop()
        }

        if (!YunXinNertc) {
            this.initNertc()
        }
        console.log(nim);
    },
    leaveAudioRoom () {
        let that = this
        YunXinNertc.leave({
            channelName: that.data.roomData.audioGroup,
            uid: that.data.uid,
        }).then((data) => {
            console.log('离开房间成功');
        }).catch((error) => {
            console.error('离开房间失败：');
        });
    },
    /**
     * 初始化音视频通话
     */
    initNertc () {
        let that = this
        that.setData({
            uid: wx.getStorageSync('loginInfo').id
        })
        YunXinNertc = YunXinMiniappSDK.Client({
            debug: false,
            appkey: '820499c93e45806d2420d75aa9ce9846'
        });
        that.joinChannel()
        YunXinNertc.on('error', (data) => {
            console.log('音视频通知：错误')
        })
        //监听事件
        YunXinNertc.on('peer-online', (evt) => {
            console.log(`${evt.uid} 加入房间`);
        });

        YunXinNertc.on('peer-leave', (evt) => {
            console.log(`${evt.uid} 离开房间`);
            let list = that.data.remoteStreams
            list = list.filter(
                (item) => !!item.uid && item.uid !== evt.uid
            );
            that.setData({
                remoteStreams: list
            })
        });
        YunXinNertc.on('stream-added', (evt) => {
            //收到房间中其他成员发布自己的媒体的通知，对端同一个人同时开启了麦克风、摄像头、屏幕贡献，这里会通知多次
            console.log(evt, 'evtttttttt');
            const userId = evt.uid;
            // const userId = that.data.uid;
            const mediaType = evt.mediaType;
            console.log(`stream-added 收到 ${userId} 的发布 ${evt.mediaType} 的通知`)
            that.subscribe(userId, mediaType);
        });

        YunXinNertc.on('stream-removed', (evt) => {
            const userId = evt.uid;
            console.log(`收到 ${userId} 的停止发布 ${evt.mediaType} 的通知`) // mediaType为：'audio' | 'video' | 'screen'
            let list = that.data.remoteStreams
            let stream = {
                uid: userId,
                mediaType: evt.mediaType,
                url: ''
            }
            list = list.map((item) =>
                item.uid === userId ? stream : item
            );
            that.setData({
                remoteStreams: list
            })
            console.log('远端流停止订阅，需要更新', userId, stream);
        });
        YunXinNertc.on('uid-duplicate', () => {
            console.log('==== uid重复，你被踢出');
        });

        YunXinNertc.on('error', (type) => {
            console.error('===== 发生错误事件：', type);
            if (type === 'SOCKET_ERROR') {
                console.log('==== 网络异常，已经退出房间');
            }
        });

        YunXinNertc.on('accessDenied', (type) => {
            console.log(`==== ${type}设备开启的权限被禁止`);
        });

        YunXinNertc.on('connection-state-change', (evt) => {
            console.log(
                `网络状态变更: ${evt.prevState} => ${evt.curState}, 当前是否在重连：${evt.reconnect}`
            );
        });
        //通知应用程序socket建立成功。  
        YunXinNertc.on('open', (data) => {
            console.log('音视频通知：和服务器socket建立成功')
        })

        //通知应用程序音视频socket关闭。  
        YunXinNertc.on('disconnect', (data) => {
            console.log('音视频通知：和服务器socket关闭了')
        })

        //通知应用程序准备重连。  
        YunXinNertc.on('willreconnect', (data) => {
            console.log('音视频通知：准备重新建立和服务器之间的联系')
        })

        //通知应用程序 SDK 信令发送超时。  
        YunXinNertc.on('sendCommandOverTime', (data) => {
            console.log('音视频通知：sdk信令发送超时')
        })

        //通知应用程序房间被解散。  
        YunXinNertc.on('liveRoomClose', (data) => {
            console.log('音视频通知：房间解散了')
        })
    },
    subscribe (userId, mediaType) {
        let that = this
        YunXinNertc
            .subscribe(userId, mediaType)
            .then((res) => {
                let stream = {
                    uid: userId,
                    mediaType: mediaType,
                    url: res.url
                }
                let list = that.data.remoteStreams
                if (list.some((item) => item.uid === userId)) {
                    console.log('收到已订阅的远端发布，需要更新', stream);
                    list = list.map((item) =>
                        item?.uid === userId ? stream : item
                    );
                    //订阅其发布的媒体，可以渲染播放
                } else if (list.length < that.data.roomData.maxNumber - 1) {
                    console.log('收到新的远端发布消息', stream);
                    list = list.concat(stream);
                    //订阅其发布的媒体，可以渲染播放
                } else {
                    console.log('房间人数已满');
                }
                that.setData({
                    remoteStreams: list
                })
                console.log('本地 subscribe 成功');
            })
            .catch((err) => {
                console.log('本地 subscribe 失败: ', err);
            });
    },
    stopAllSubscribe () {
        this.data.remoteStreams.forEach(item => {
            YunXinNertc.unsubscribe(item.uid, 'audio').then(res => {
                console.log('取消订阅audio 完成: ', uid)
            })
        })
    },
    subscribeAll () {
        this.data.remoteStreams.forEach(item => {
            this.subscribe(item.uid, 'audio')
        })
    },
    joinChannel () {
        let that = this
        if (!YunXinNertc) {
            console.log('内部错误，请重新加入房间');
            return;
        }
        console.log('开始加入房间: ', that.data.roomData.audioGroup);
        YunXinNertc.join({
            channelName: that.data.roomData.audioGroup,
            uid: that.data.uid,
            recordAudio: 1,
        })
            .then((data) => {
                console.log('加入房间成功，开始初始化本地音视频流', data);
                // that.initLocalStream();
            })
            .catch((error) => {
                console.error('加入房间失败：', error);
                that.returnJoin();
            });
    },
    publishAudio () {
        let that = this
        var playerList = []
        let personInd = that.data.personInd
        that.data.playerList.map(item => {
            if (item && item.account) {
                if (item.account === wx.getStorageSync('loginInfo').yunId) {
                    item['id'] = wx.getStorageSync('loginInfo').id
                }
                playerList.push(item)
            }
        })
        console.log('开始发布视频流', that.data.uid, personInd, playerList, that.data.playerList);
        if (playerList[personInd].account !== that.data.account) {
            // 如果当前发言的不是自己的话点击无效
            return
        } else {
            //发布本地媒体给房间对端
            if (that.data.voiceStatus === 0) {
                that.setData({
                    voiceStatus: 1
                })
                YunXinNertc
                    .publish('audio')
                    .then((url) => {
                        console.log('本地 publish 成功', url);
                        that.setData({
                            audioPushUrl: url,
                            pushIsMuted: true
                        })
                    })
                    .catch((err) => {
                        console.error('本地 publish 失败: ', err);
                    });
            }
            else {
                that.setData({
                    voiceStatus: 0,
                    audioPushUrl: '',
                    pushIsMuted: false
                })
                YunXinNertc
                    .unpublish('audio')
                    .then((url) => {
                        console.log('关闭mic成功');
                    })
                    .catch((err) => {
                        console.error('关闭mic成功失败: ', err);
                    });
            }
        }
    },
    // 结束倒计时的时候都可以发言
    publishAllAudio () {
        let that = this
        YunXinNertc
            .publish('audio')
            .then((url) => {
                console.log('本地 publish所有人 成功', url);
                that.setData({
                    audioPushUrl: url,
                    pushIsMuted: true
                })
            })
            .catch((err) => {
                console.error('本地 publish所有人 失败: ', err);
            });
    },
    stopPublishAudio () {
        let that = this
        that.setData({
            voiceStatus: 0,
            audioPushUrl: '',
            pushIsMuted: false
        })
        YunXinNertc
            .unpublish('audio')
            .then(() => {
                console.log('关闭mic成功');
            })
            .catch((err) => {
                console.error('关闭mic成功失败: ', err);
            });
    },
    pullerNetstatusHandler (params) {
        console.log(params, 'params');
    },
    videoClickHandler (params) {
        console.log(params, 'params');
    },
    pullerStateChangeHandler (params) {
        console.log(params, 'params');
    },
    // 群组信息
    onTeams (e) {
        var that = this;
        console.log(that.data.teamId,);
        console.log('收到群组', e);
        nim.getTeamMembers({
            teamId: that.data.teamId,
            done: that.getTeamMembersDone
        });
    },
    //当前群组成员
    getTeamMembersDone (error, obj) {
        console.log('获取群成员' + (!error ? '成功' : '失败'), obj);
        if (!error) {
            this.onTeamMembers(obj);
        } else {
            wx.showToast({
                title: '抱歉，您不在当前房间',
                icon: 'none'
            })
            this.setData({
                haveRoom: false
            })
            this.leaveRoomClear()
        }
    },
    // 群成员更新
    onTeamMembers (obj) {
        console.log('收到群成员', obj);
        var that = this
        var accounts = []
        // var truePlayerList = this.data.truePlayerList
        var truePlayerList = []

        truePlayerList = truePlayerList.concat(obj.members)
        truePlayerList.forEach(item => {
            accounts.push(item.account)
        })
        this.setData({
            truePlayerList: truePlayerList
        })
        nim.getUsers({
            accounts: accounts,
            sync: true,
            done: that.getUsers
        });
    },
    // 判断是否是房主 如果是房主的话把房主排到第一位
    getUsers (error, users) {
        console.log(users);
        var maxNum = this.data.roomData.maxNumber;
        var playerList = this.data.playerList
        var that = this
        var members = []
        if (playerList[this.data.roomData.maxNumber - 1]?.account) {
            // 如果包房人数已满的话，看是否需要下面处理一下
        } else {
            playerList[this.data.roomData.maxNumber - 1] = {};//就算包房只有一个人也要给其他的加空人
            members = playerList
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

            console.log(this.data.playerList, 'this.data.playerList');
            if (members[0] && members[0].account != this.data.roomData.ownerUserIm) {
                members.forEach((item, index) => {
                    if (item?.account == this.data.roomData.ownerUserIm) {
                        let obj = members[0];
                        members[0] = item;
                        members[index] = obj;
                    }
                })
            }
            this.setData({
                playerList: members
            })
        }
        //结尾畅聊成员列表
        var list = JSON.parse(JSON.stringify(playerList))
        var showPlayerList = []
        list.map(item => {
            if (item && item.account) {
                item.zan = 0
                item.isZan = false
                showPlayerList.push(item)
                if (item.account === that.data.account) {
                    that.setData({
                        nickName: item.nick
                    })
                }
            }
        })
        this.setData({
            showPlayerList: showPlayerList
        })

    },
    // 连接成功
    onConnect () {

        // 是匹配并且是房主那此时用户就是临时房主
        if (this.data.isMatch && this.data.isOwner && !wx.getStorageSync('isLinShiFangZhu')) {
            this.setData({
                isLinShiFangZhu: true
            })
        }
        console.log('连接成功');
    },
    //重新连接
    onWillReconnect (obj) {
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
    },
    //断开连接
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
    //报错信息
    onError (error) {
        console.log(error);
    },
    //群成员信息更新
    onUpdateTeamMember (teamMember) {
        console.log('群成员信息更新了', teamMember);

    },
    //新人来了
    onAddTeamMembers (obj) {
        console.log('新人来了', obj);
        this.onTeamMembers(obj);
    },
    //有人走了
    onRemoveTeamMembers (teamMember) {
        console.log('有人走了', teamMember.accounts[0]);
        let that = this
        var arr = this.data.playerList;
        arr.forEach((item, index) => {
            if (item.account == teamMember.accounts[0]) {
                arr[index] = {}
            }
        })
        let truePlayerList = that.data.truePlayerList
        truePlayerList.forEach((item, index) => {
            if (item.account == teamMember.accounts[0]) {
                truePlayerList.splice(index, 1)
            }
        })
        if (truePlayerList.length <= 1 && !that.data.isBeginPlay && !that.data.isOwner) {
            arr.forEach((item, index) => {
                if (item.account) {
                    item['isReady'] = false
                    arr.splice(0, 1, item)
                    arr.splice(index, 1, {})
                }
            })
            truePlayerList.forEach((item, index) => {
                if (item.account) {
                    item['isReady'] = false
                    truePlayerList.splice(0, 1, item)
                    truePlayerList.splice(index, 1)
                }
            })
            console.log(truePlayerList, 'truePlayerList');
            that.setData({
                isLinShiFangZhu: true,
                isOwner: true,
                truePlayerList,
                isReady: false,
            })
        }
        this.setData({
            playerList: arr
        })
    },
    // 收到消息
    onMsg (msg) {
        var that = this
        console.log('收到消息了', msg);
        // this.pushMsg(msg);
        switch (msg.type) {
            case 'text':
                that.pushMsg(null, msg);
                break;
            case 'custom':
                that.pushMsg(null, msg);
                break;
            case 'notification':
                // 处理群通知消息
                that.onTeamNotificationMsg(msg);
                break;
            // 其它case
            default:
                break;
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
        this.setData({
            inputText: ''
        })
        console.log('正在发送p2p text消息, ' + msg.idClient);
    },
    // 发送自定义消息
    sendCustomMsg (type, val) {
        var that = this;
        var content = {
            type: type, //发言类型 1 玩家准备 2 玩家是否轮到发言 3玩家是否在线  4 系统文字消息 5 系统发牌消息 6 跳过发言 7 点赞
            data: {
                status: val?.status,  //玩家是否准备 
                value: val?.text,     //发的内容
                cardList: val?.list,  //发的卡牌
                audio: val?.audio,    //发的音频
                video: val?.video,    //发的视频
                img: val?.imgUrl,      //发的图片
                account: val?.account,      //房间人员变动
                times: val?.times,      // 倒计时时间
                tiRenInfo: val?.tiRenInfo,      // 倒计时时间
                isOver: val?.isOver,      // 倒计时时间
            }
        };
        var msg = nim.sendCustomMsg({
            scene: 'team',
            to: that.data.teamId,
            content: content ? JSON.stringify(content) : '',
            done: that.pushMsg
        });
        console.log('正正在发送自定义消息 ' + msg);
        // console.log(msg)
    },
    //渲染消息
    pushMsg (error, msg) {
        var yunMsgList = this.data.yunMsgList //原始的所有云信的消息
        yunMsgList.push(msg)
        // yunMsgList = []
        this.setData({
            yunMsgList: yunMsgList
        })
        // showOtherStep 是否在看其他轮
        if (!this.data.showOtherStep) {
            this.contentScroll()
        }

        // console.log(error);
        // console.log(msg);
        // console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
        // msgList 页面显示的滚动聊天内容
        var msgList = this.data.msgList
        var stepList = this.data.stepCardList
        var stepListAll = this.data.stepCardListAll
        var that = this;
        console.log('渲染消息111', msg)
        if (msg.content) {
            var content = JSON.parse(msg.content)
            let nick = ''
            if (content.type == 1) {
                // 自定义消息type为1的时候 玩家准备
                // playerList 所有用户信息
                var play = that.data.playerList;
                play.forEach(item => {
                    if (item && item.account && item.account == msg.from) {
                        item.isReady = content.data.status
                        nick = item.nick
                    }
                })
                var msgObj = {
                    sysType: 'people',
                    text: content.data.status ? '玩家已准备' : '玩家取消准备',
                    msgStep: that.data.step,
                    isBotMes: 1,    // isBotMes 1 是下面展示的消息列表 0 是上面的系统内容
                    fromAccount: msg.from,
                    nick
                }
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
                that.setData({
                    playerList: play
                })
                //判断是否都准备了
                that.handleReadyStatus()
                console.log(play)
            } else if (content.type == 2) {
                // 自定义消息type为2的时候 玩家是否轮到发言
                var play = that.data.playerList;
                var msgObj = {}
                play.forEach(item => {
                    if (item && item.account && item.account == msg.from) {
                        item.isActive = content.data.status
                        msgObj = {
                            sysType: 'sys',
                            text: '轮到' + item.nick + '发言',
                            msgStep: that.data.step,
                            isBotMes: 1,    // isBotMes 是否是下面展示的消息列表 isTopMes 是否是上面展示的系统消息
                        }
                    }
                })
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
                that.setData({
                    playerList: play
                })
            } else if (content.type == 3) {
                // 自定义消息type为3的时候 玩家是否在线
                var play = that.data.playerList;
                player.forEach(item => {
                    if (item && item.account && item.account == msg.from) {
                        item.isActive = content.data.status
                    }
                })
                that.setData({
                    playerList: play
                })
            } else if (content.type == 4) {
                var play = that.data.playerList;
                // 自定义消息type为4的时候 为系统文字消息
                var msgObj = {
                    sysType: 'sys',
                    text: content.data.value,
                    msgStep: that.data.step,
                    isBotMes: 1,
                }
                if (content.data.value === '开始') {
                    that.setData({
                        step: 1,
                        personInd: 0,
                        isBeginPlay: true
                    })
                    that.runStep()
                }
                if (content.data.value === '发牌中...') {
                    that.sendCard()
                }

                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
                console.log(that.data.msgList);
            } else if (content.type == 5) {
                // 发牌
                var list = []
                var allCard = []
                // 筛选出当前人分的牌
                if (content.data.cardList && content.data.cardList.length > 0) {
                    allCard = content.data.cardList.filter(item => {
                        return item.account
                    })
                    list = content.data.cardList.filter(item => {
                        return item.account == that.data.account
                    })
                }
                // 自定义消息type为5的时候 为系统发牌消息
                var msgObj = {
                    sysType: 'sys',
                    cardList: list,
                    step: that.data.step,
                    isBotMes: 0,
                }
                var msgObj2 = {
                    sysType: 'sys',
                    cardList: allCard,
                    step: that.data.step,
                    isBotMes: 0,
                }
                stepList.push(msgObj)
                stepListAll.push(msgObj2)
                that.setData({
                    stepCardList: stepList,
                    stepCardListCopy: stepList,
                    stepCardListAll: stepListAll,
                })
                console.log(stepListAll, 'stepListAll1');
                console.log(this.data.stepCardListAll, 'this.data.stepCardListAll1');
                this.contentScroll()


            } else if (content.type == 6) {
                //跳过发言
                // 自定义消息type为4的时候 为系统文字消息
                var player = that.data.playerList;
                player.forEach(item => {
                    if (item && item.account && item.account == msg.from) {
                        var msgObj = {
                            sysType: 'sys',
                            text: item.nick + '跳过本轮发言',
                            msgStep: that.data.step,
                            isBotMes: 1,
                        }
                        msgList.push(msgObj)
                        that.setData({
                            msgList: msgList
                        })
                        that.handleJumpSpeak()
                    }
                })

            } else if (content.type == 7) {
                //点赞
                var showPlayerList = that.data.showPlayerList
                showPlayerList[content.data.value].zan++
                that.setData({
                    showPlayerList: showPlayerList
                })
                var msgObj = {
                    fromNick: msg.fromNick,
                    zan: 1,
                    msgStep: that.data.step,
                    fromAccount: msg.from
                }
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
            } else if (content.type == 8) {
                //玩家离开房间
                var player = that.data.playerList;
                var player2 = that.data.playerList;
                console.log(content, 'content');
                var userName = that.getUserName(content.data.account)
                var userAccount = content.data.account
                let userObj = {
                    userName,
                    userAccount
                }
                that.setData({
                    leaveUserInfor: userObj
                })
                var msgObj = {
                    sysType: 'sys',
                    text: userName + '离开房间',
                    msgStep: that.data.step,
                    isBotMes: 1,
                }
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
                if (that.data.account == userAccount) {
                    // 如果是本人离开的话
                    if (readyTimeout) {
                        clearTimeout(readyTimeout)
                    }
                    if (!that.data.isBeiTi) {
                        quitRoom({
                            roomId: that.data.roomData.id
                        }).then(res => {
                            that.leaveRoomClear()
                        })
                    }
                }
                else {
                    // 别人离开的话，更新人员信息
                    player.forEach((item, index) => {
                        if (item?.account && item?.account == userAccount) {
                            player2.splice(index, 1, {})
                        }
                    })
                    that.setData({
                        playerList: player2
                    })
                    console.log(that.data.truePlayerList, 'that.data.playerList');
                    if (content.data?.isOver) {
                        return
                    } else {
                        if (that.data.truePlayerList.length <= 1 && that.data.isBeginPlay) {
                            getIfFreeMy().then(res => {
                                console.log(res);
                                if (res.data.data.giveParty == 1) {
                                    that.setData({
                                        lastPeoplePop2: true,
                                        isLastPeople: true
                                    })
                                } else {
                                    that.setData({
                                        lastPeoplePop1: true,
                                        isLastPeople: true
                                    })
                                }
                            })
                        }
                    }
                }

            } else if (content.type == 9) {

                // 这个是开始派对的倒计时
                // this.startCountDown()
                let obj = {
                    downTime: 3,
                    type: 1
                }
                setTimeout(() => {
                    this.setData({
                        timePopStatus: true,
                        waitTime: 3
                    })
                    this.sendSocketMsg(obj)
                }, 1000);
                console.log('开始倒计时')
            } else if (content.type == 10) {
                // 发言和思考倒计时
                // 这里是思考和发言倒计时
                // this.getDownTime(content.data.times, that.speak)
            } else if (content.type == 11) {
                // 被踢出房间
                that.setData({
                    roomSetPopStatus: false,
                    beiTiAccount: content.data.tiRenInfo.beiTiAccount,
                    isBeiTi: content.data.tiRenInfo.isBeiTi
                })
            }
        } else {
            var msgObj = {
                sysType: 'people',
                nick: msg.fromNick,
                text: msg.text,
                msgStep: that.data.step,
                isBotMes: 1,
                fromAccount: msg.from
            }
            msgList.push(msgObj)
            that.setData({
                msgList: msgList,
                isFaYan: true
            })
        }
        that.saveData()

    },

    //渲染消息记录
    renderHistoryMsh (msg) {
        console.log('这里是重新渲染消息记录');
        if (!this.data.showOtherStep) {
            this.contentScroll()
        }

        // console.log(error);
        // console.log(msg);
        // console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
        var msgList = this.data.msgList
        var that = this;
        if (msg.content) {
            var content = JSON.parse(msg.content)
            let nick = ''
            if (content.type == 1) {
                // 自定义消息type为1的时候 玩家准备
                var play = that.data.playerList;
                play.forEach(item => {
                    if (item && item.account && item.account == msg.from) {
                        item.isReady = content.data.status
                        nick = item.nick
                    }
                })
                that.setData({
                    playerList: play
                })
                var msgObj = {
                    sysType: 'people',
                    text: content.data.status ? '玩家已准备' : '玩家取消准备',
                    isBotMes: 1,
                    msgStep: that.data.step,
                    fromAccount: msg.from,
                    nick
                }
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
            } else if (content.type == 2) {
                // 自定义消息type为2的时候 玩家是否轮到发言
                var play = that.data.playerList;
                var msgObj = {}
                play.forEach(item => {
                    if (item && item.account && item.account == msg.from) {
                        item.isActive = content.data.status
                        msgObj = {
                            sysType: 'sys',
                            text: '轮到' + item.nick + '发言',
                            msgStep: that.data.step,
                            isBotMes: 1,    // isBotMes 是否是下面展示的消息列表 isTopMes 是否是上面展示的系统消息
                        }
                    }
                })
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
                that.setData({
                    playerList: play
                })
            } else if (content.type == 3) {
                // 自定义消息type为3的时候 玩家是否在线
                var play = that.data.playerList;
                player.forEach(item => {
                    if (item && item.account && item.account == msg.from) {
                        item.isActive = content.data.status
                    }
                })
                that.setData({
                    playerList: play
                })
            } else if (content.type == 4) {
                // 自定义消息type为4的时候 为系统文字消息
                var msgObj = {
                    sysType: 'sys',
                    text: content.data.value,
                    msgStep: that.data.step,
                    isBotMes: 1,
                    fromAccount: msg.from,
                    nick
                }
                if (content.data.value === '开始') {
                    that.setData({
                        step: 1,
                        personInd: 0,
                        isBeginPlay: true
                    })
                    that.runStep()
                }
                if (content.data.value === '发牌中...') {
                    that.sendCard()
                }

                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
                // console.log(APP.globalData.mesList);
            } else if (content.type == 5) {
                // 自定义消息type为5的时候 为系统发牌消息
                var msgObj = {
                    sysType: 'sys',
                    cardList: content.data.cardList,
                    step: that.data.step,
                    isBotMes: 0,
                    bigImage: {
                        url: '',
                        id: ''
                    },
                    msgStep: that.data.step,
                    fromAccount: msg.from,
                    nick
                }
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })

            } else if (content.type === 6) {
                //跳过发言
                var player = that.data.playerList;
                player.forEach(item => {
                    if (item && item.account && item.account == msg.from) {
                        var msgObj = {
                            sysType: 'sys',
                            text: item.nick + '跳过本轮发言',
                            msgStep: that.data.step,
                            isBotMes: 1,
                        }
                        msgList.push(msgObj)
                        that.setData({
                            msgList: msgList
                        })
                        that.handleJumpSpeak()
                    }
                })

            } else if (content.type === 7) {
                //点赞
                var showPlayerList = that.data.showPlayerList
                showPlayerList[content.data.value].zan++
                that.setData({
                    showPlayerList: showPlayerList
                })
                var msgObj = {
                    fromNick: msg.fromNick,
                    zan: 1,
                    msgStep: that.data.step,
                    fromAccount: msg.from
                }
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })

            } else if (content.type == 8) {
                //玩家离开房间
                var player = that.data.playerList;
                var player2 = that.data.playerList;
                var userName = that.getUserName(content.data.account)
                var userAccount = content.data.account
                var msgObj = {
                    sysType: 'sys',
                    text: userName + '离开房间',
                    msgStep: that.data.step,
                    isBotMes: 1,
                }
                msgList.push(msgObj)
                that.setData({
                    msgList: msgList
                })
                // 别人离开的话，更新人员信息
                player.forEach((item, index) => {
                    if (item?.account && item?.account == userAccount) {
                        player2.splice(index, 1)
                    }
                })
                that.setData({
                    playerList: player2
                })
            }
        } else {
            var msgObj = {
                sysType: 'people',
                nick: msg.fromNick,
                text: msg.text,
                msgStep: that.data.step,
                isBotMes: 1,
                fromAccount: msg.from,
            }
            msgList.push(msgObj)
            that.setData({
                msgList: msgList
            })
        }
        that.saveData()
    },

    //-------------------------------------云信end-----------------------------------------------------------

    //-------------------------------------准备----------------------------------------------------------
    //判断是否都准备了
    handleReadyStatus: function () {
        let vm = this
        if (!this.data.isBeginPlay) {
            //游戏没有开始
            var player = this.data.playerList
            var num = 0
            var readyNum = 0
            player.map(item => {
                if (item && item.account && item.isReady) {
                    readyNum++
                }
                if (item && item.account) {
                    num++
                }
            })
            if (num === readyNum && num >= 2) {
                // this.sendCustomMsg(9, {})
                this.setData({
                    timePopStatus: true,
                    waitTime: 3
                })
                let obj = {
                    type: 1,
                    downTime: 3,
                    isJump: 0
                }
                setTimeout(() => {
                    vm.sendSocketMsg(obj)
                }, 1000);
            } else {
                console.log('还没准备好')
            }

        }
    },
    handleFastStart () {
        //游戏没有开始
        var player = this.data.playerList
        var num = 0
        var readyNum = 0
        player.map(item => {
            if (item && item.account && item.isReady) {
                readyNum++
            }
            if (item && item.account) {
                num++
            }
        })
        if (num - 1 === readyNum && readyNum >= 1) {
            this.sendCustomMsg(9, {})
        } else {
            if (num < this.data.roomData.minNumber) {
                this.setData({
                    mixPopStatus: true
                })
            } else {
                wx.showToast({
                    title: '玩家还未全部准备',
                    icon: 'none'
                })
            }
            console.log('还没准备好')
        }
    },

    //准备弹窗是否显示
    showReadyPop: function () {
        //不是房主，没有准备，显示准备弹窗
        if (this.data.isOwner && !this.data.isMatch) {
            this.setData({
                readyPopStatus: false
            })
        } else {
            if (this.data.isReady) {
                console.log('已经准备了');
            } else {
                this.setData({
                    readyPopStatus: true
                })
                this.readyTimeDown(this.data.account)
            }
        }
    },
    //准备弹窗倒计时
    readyTimeDown: function (account) {
        var that = this;
        if (readyTimeout) {
            clearTimeout(readyTimeout)
        }
        readyTimeout = setTimeout(function () {
            that.setData({
                readyTime: that.data.readyTime - 1
            })
            if (that.data.readyTime > 1) {
                that.readyTimeDown(account)
                console.log(that.data.readyTime)
                console.log(account)
            } else {
                that.sendCustomMsg(8, { account: account })
                if (readyTimeout) clearTimeout(readyTimeout)
            }
        }, 1000)
    },
    //取消准备
    cancelReady: function () {
        clearInterval(timeInt)
        timeInt = null
        if (this.data.isBeginPlay) {
            wx.showToast({
                title: '派对已经开始，无法取消准备',
                icon: 'none'
            })
        } else {
            this.setData({
                isReady: false,
                readyPopStatus: true
            })
            console.log(this.data.account, 'this.data.account');
            this.readyTimeDown(this.data.account)
            this.sendCustomMsg(1, { status: this.data.isReady })
        }

    },
    //点击准备
    handleReady () {
        this.setData({
            isReady: true,
            readyPopStatus: false,
            readyTime: 5,
        })
        this.sendCustomMsg(1, { status: this.data.isReady })
        clearInterval(readyTimeout)
    },
    //-------------------------------------准备end-----------------------------------------------------------


    //-------------------------------------匹配路人-----------------------------------------------------------
    handleInviRoad () {
        this.setData({
            passerPopStatus: true
        })
    },
    handleInviRoadDone () {
        var that = this
        var num = this.data.playerList.length
        openBaoRoomMate({
            id: that.data.roomData.id
        }).then(res => {
            this.setData({
                passerPopStatus: false,
                matePopStatus: true,
                contPasserPopStatus: false,
                waitTime: 3
            })
            // this.getDownTime(10, contWait)

            // function contWait () {
            //     if (that.data.playerList.length <= num) {
            //         that.setData({
            //             contPasserPopStatus: true,
            //             matePopStatus: false
            //         })
            //     }
            // }
        })
    },
    //-------------------------------------匹配路人end-----------------------------------------------------------

    getUserDone (error, user) {
        console.log(error);
        console.log(user);
        console.log('获取用户资料' + (!error ? '成功' : '失败'));
    },


    onDismissTeam (obj) {
        console.log('群解散了', obj);
    },
    onTransferTeam (team, newOrder, oldOrder) {
        console.log('移交群', team);
        console.log('移交群', newOrder);
        console.log('移交群', oldOrder);
    },

    onTeamNotificationMsg (msg) {
        var that = this
        if (msg.attach.type == 'addTeamMembers') {
            // 拉人入群
            that.sendCustomMsg(4, { text: msg.attach.users[0].nick + '进入房间' })
        } else if (msg.attach.type == 'removeTeamMembers') {
            // 踢人出群
            // that.sendCustomMsg(8, { account: msg.attach.users[0].account })
            that.sendCustomMsg(4, { text: msg.attach.users[0].nick + '离开房间' })
        } else if (msg.attach.type == 'leaveTeam') {
            // 离开房间
            console.log('离开房间');
        }
    },


    // 解散群
    dismissTeam () {
        let that = this
        console.log(that.data.teamId);
        dissolveGroup(that.data.roomId).then(res => {
            console.log(res, '解散房间的信息');
        })
        nim.dismissTeam({
            teamId: '213',
            done: dismissTeamDone
        })

        function dismissTeamDone (error, obj) {
            console.log('解散群' + (!error ? '成功' : '失败'), error, obj);
            that.leaveRoomClear()
        }

        // quitRoom({
        //     roomId: 121
        // }).then(res => {
        //
        // })
        // dissolveGroup({
        //     id: 121,
        //     token: '9f011c22-e886-4344-b450-ec546d52c0ba'
        // })
    },
    // 创建房间
    creatRoom () {
        var that = this;
        let params = {
            askId: this.data.askId,
            payId: this.data.themeDetail.baoPayId
        }
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
                // that.setData({
                //     matePopStatus: true,
                // })
                // that.getDownTime()
            }
        })
    },
    // 获取房间详情
    getRoomDetails (roomId, isInitRoom) {
        var that = this
        getRoomDetails({ roomId: roomId }).then(res => {
            that.setData({
                teamId: res.data.data.imGroup,
                audioId: res.data.data.audioGroup,
                roomData: res.data.data
            })
            wx.setStorageSync('roomData', res.data.data)
            that.initRoom()
            // if(isInitRoom===0){
            //     return
            // }else{
            //     that.initRoom()
            // }
            // 是匹配还是包房
            // if (wx.getStorageSync('roomData').matchType == 1) {
            //     that.initRoom()
            // } else {
            //     // that.setData({
            //     //     matePopStatus: true,
            //     // })
            //     // that.getDownTime()
            // }
        })
    },



    //快速开始
    handleBegin () {
        var num = 0;
        var that = this;
        var userIm = []
        var readyNum = 0
        console.log(this.data.playerList, 'this.data.playerList');
        console.log(this.data.truePlayerList, 'this.data.truePlayerList');
        this.data.playerList.forEach(item => {
            if (item && item.account) {
                userIm.push(item.account)
                num++
            }
            if (item && item.isReady) {
                readyNum++
            }
        })
        console.log(readyNum, this.data.truePlayerList.length);
        if (num > 1) {
            if (readyNum < this.data.truePlayerList.length - 1) {
                wx.showToast({
                    title: '还有成员未准备',
                    icon: 'none'
                })
            } else {
                //开始游戏
                this.setData({
                    timePopStatus: true
                })
                // this.getDownTime(2, startPlay)
                startPlayRoom({
                    roomId: that.data.roomData.id,
                    userIm
                }).then(res => {
                    if (that.data.isOwner) {
                        that.sendCustomMsg(4, { text: '开始' })
                    }
                })
            }

        } else {
            this.setData({
                mixPopStatus: true
            })
        }
    },
    // 踢人
    handleKickDone (e) {
        var that = this;
        var item = e.currentTarget.dataset.item
        that.sendCustomMsg(11, {
            tiRenInfo: {
                beiTiAccount: item.account,
                isBeiTi: true
            }
        })
        kickingPlayer({
            yunId: item.account,
            roomId: that.data.roomData.id
        }).then(res => {
            console.log(item.account, 'item.accountitem.account');
            console.log(that.data.account);
            that.setData({
                roomSetPopStatus: false,
            })
        })
    },

    //获取用户信息 云信等
    getUserInfo: function () {
        getUserMsg().then(res => {
            if (res.data.ret === 200) {
                wx.setStorageSync('loginInfo', res.data.data);
            }
        })
    },

    // 获取派对信息
    getPartyDet: function () {
        var that = this;
        findByAskPartyOne({
            id: that.data.askId
        }).then(res => {
            console.log(res);
            let richText = res.data.data.detailsText
            res.data.data.detailsText = richText
                .replace(/\<img/gi, '<img style="width:100%;height:auto;"')
                .replace(/\<p/gi, '<p class="p_class"')
                .replace(/\<span/gi, '<span class="span_class"')
            // let innerAudioContext = wx.createInnerAudioContext({useWebAudioImplement: false});
            // innerAudioContext.src = res.data.data.list[0].guideAudio || 'https://dl.stream.qqmusic.qq.com/C400003YY8ia0o76Cm.m4a?guid=4970673720&vkey=800C4A9A5815065BB85D4E0BA1D707BA74C459E3DE7F0D4676996A2C8496CB4830F103D20FC7C50D81EA1B5813C8258586EEF582E99DE083&uin=694750795&fromtag=120032'
            // innerAudioContext.autoplay = true
            // innerAudioContext.loop = true
            that.setData({
                themeDetail: res.data.data,
                helpText: res.data.data.detailsText,
                stepList: res.data.data.list,
                // backgrooundMusic: innerAudioContext
            })
            wx.setNavigationBarTitle({
                title: res.data.data.title
            })

        })
    },

    //开始派对的倒计时(没用了)
    startCountDown: function () {
        clearTimeout(startTimeout)
        var that = this;
        startTimeout = setTimeout(function () {
            var waitTime = that.data.waitTime
            that.setData({
                waitTime: waitTime - 1
            })
            console.log(that.data.waitTime)
            if (that.data.waitTime > 0) {
                that.startCountDown()
                if (that.data.waitTime === 3) {
                    var routeList = getCurrentPages()
                    if (routeList[routeList.length - 1].route !== '04zhutipaidui/tansuo/tansuo') {
                        console.log('该回来了')
                        wx.showModal({
                            title: '提示',
                            content: '派对即将开始，请返回房间',
                            success (res) {
                                if (res.confirm) {
                                    var url = '/04zhutipaidui/tansuo/tansuo'
                                    var roomPath = that.data.pageOptions
                                    for (const roomPathKey in roomPath) {
                                        url = url + '&' + roomPathKey + '=' + roomPath[roomPathKey]
                                    }
                                    url.replace('&', '?')
                                    wx.redirectTo({
                                        url: url.replace('&', '?'),
                                    })
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                    //退出房间
                                    quitRoom({
                                        id: this.data.roomData.id
                                    }).then(res => {
                                        that.leaveRoomClear()
                                    })
                                }
                            }
                        })
                    }
                }

            } else {
                clearTimeout(startTimeout)
                that.handleBegin()
                that.setData({
                    timePopStatus: false
                })
            }
            that.saveData()
        }, 1000)
    },
    //页面执行************************************************
    //发言和思考倒计时(没用了)
    getDownTime (downtimes, fun) {
        var time1 = 0;
        var that = this;
        timeInt = setInterval(() => {
            if (downtimes <= 1) {
                clearInterval(timeInt)
                timeInt = null
                that.setData({
                    timePopStatus: false,
                })
                if (fun) {
                    fun()
                }
            } else {
                downtimes--
                var step = that.data.step
                var speakTime = that.data.themeDetail.list[step - 1].speakTime || 10
                // 判断几秒内没发言自动跳过
                if (speakTime && speakTime - downtimes == 5 && that.data.show_speak_count_down && !that.data.isFaYan) {
                    clearInterval(timeInt)
                    that.setData({
                        jumpPopStatus4: true,
                    })
                    downtimes = speakTime
                }
                if (downtimes < 10) {
                    downtimes = '0' + downtimes
                }
                that.setData({
                    waitTime: downtimes
                })
            }
        }, 1000);
    },

    //这个是派对结束之后结尾畅聊的倒计时
    countDown: function () {
        let that = this
        let obj = {
            type: 4,
            playNum: this.data.step,
            downTime: that.data.themeDetail.coChatTime
        }
        setTimeout(() => {
            that.sendSocketMsg(obj)
            that.publishAllAudio()
        }, 1000);
    },
    //执行每一轮
    runStep: function () {
        var that = this;
        var step = this.data.step
        var stepData = this.data.themeDetail.list[step - 1]
        // 隐藏跳过发言相关弹窗
        this.setData({
            jumpPopStatus: false,
            jumpPopStatus2: false,
            jumpPopStatus3: false,
            jumpPopStatus4: false,
            isFaYan: false,
            changeStep: step
        })

        //话术
        var guideWords = stepData.guideWords
        //思考时间
        var thinkTime = stepData.thinkTime || 3
        // var thinkTime = 3

        //显示引导语言
        this.setData({
            helpText: guideWords
        })
        //触发发牌
        if (that.data.isOwner) {

            that.sendCustomMsg(4, { text: '发牌中...' })
        }
        //思考时间倒计时
        this.setData({
            // timePopStatus: true,
            //思考倒计时
            waitTime: thinkTime > 9 ? thinkTime : '0' + thinkTime,
            personInd: 0,
            inputStatus: false
        })
        // 发送一条开始思考倒计时的消息
        let obj = {
            type: 2,
            playNum: step,
            downTime: thinkTime + 1
        }
        setTimeout(() => {
            that.sendSocketMsg(obj)
            that.stopPublishAudio()
        }, 1000);
        // this.getDownTime(thinkTime, this.speak)

    },
    //思考倒计时结束，开始发言
    speak: function () {
        var that = this;
        var step = this.data.step
        console.log(step, that.data.personInd, 'speak这儿');
        var stepData = this.data.themeDetail.list[step - 1]
        //说话时间
        var speakTime = stepData.speakTime || 10
        // var speakTime = 30
        console.log('思考结束开始答题');

        //隐藏思考倒计时
        that.setData({
            show_think_count_down: false,
            isFaYan: false
        })

        //当前发言人index
        let personInd = that.data.personInd

        //成员列表，去掉空的
        var playerList = []
        that.data.playerList.map(item => {
            if (item && item.account) {
                playerList.push(item)
            }
        })
        //是否轮到本人发言

        // QAQ 这里判断是否是房主 房主发轮到谁的消息
        if (that.data.isOwner) {
            that.sendCustomMsg(4, { text: '轮到' + playerList[personInd].nick + '发言' })
        }
        console.log('当前发言人：' + personInd + speakTime)

        //发言倒计时，倒计时完后下个人发言
        let obj = {
            type: 3,
            playNum: that.data.step,
            downTime: speakTime + 1,
            readyPerson: personInd,
            isJump: 0
        }
        setTimeout(() => {
            that.sendSocketMsg(obj)
            // 如果当前发言的人是自己的话开始推流,其他人停止推流
            if (playerList[personInd].account
                === that.data.account) {
                that.publishAudio()
            } else {
                that.stopPublishAudio()
            }
        }, 1000);
    },
    nextPerson () {
        let that = this
        that.setData({
            show_speak_count_down: false
        })
        //成员列表，去掉空的
        var playerList = []
        that.data.playerList.map(item => {
            if (item && item.account) {
                playerList.push(item)
            }
        })
        if (that.data.personInd < (playerList.length - 1)) {
            //发言人index 小于 成员数量，切换下个人发言
            that.setData({
                personInd: that.data.personInd + 1,
            })
            that.speak()
        } else {
            //记录本轮内容ƒ
            that.addRecode()
            console.log('全部人发言结束,进入下一轮')
            if (that.data.step < that.data.themeDetail.list.length) {
                //轮数 小于 全部轮数，切换下一轮
                that.setData({
                    step: that.data.step + 1,
                })
                that.runStep()
            } else {
                //全部结束
                console.log('全部结束')
                if (that.data.isOwner) {
                    that.sendCustomMsg(4, { text: '全部结束' })
                }
                that.countDown()

            }
        }
    },
    //点击跳过发言
    jumpSpeak: function () {
        if (this.data.jumpNum === 0) {
            // 第1次跳过的时候出现弹窗
            this.setData({
                jumpPopStatus: true
            })
        } else if (this.data.jumpNum === 1) {
            // 第2次跳过的时候出现弹窗
            this.setData({
                jumpPopStatus2: true
            })
        } else if (this.data.jumpNum === 2) {
            // 第3次跳过的时候出现弹窗
            this.setData({
                jumpPopStatus3: true
            })
        }
    },
    jumpConfirmChaoShi () {
        this.setData({
            jumpPopStatus5: false,
        })
    },
    //确认跳过
    jumpConfirm: function () {
        var that = this
        this.sendCustomMsg(6, { text: '跳过发言' })
        if (this.data.jumpNum == 2) {
            this.clickZhongTuQuitRoom()
        }
        this.setData({
            isJump: true,
            inputStatus: false,
            jumpPopStatus: false,
            jumpPopStatus2: false,
            jumpPopStatus3: false,
            jumpPopStatus4: false,
            jumpNum: this.data.jumpNum + 1
        })
    },
    // 有人离开之后处理显示的人员和判断还有几个人在房间
    shengXiaPerple () {

    },
    //处理跳过发言
    handleJumpSpeak: function () {
        timeInt && clearInterval(timeInt)
        let vm = this
        let obj = {
            isJump: 1,
            cmd: 'msg002'
        }
        vm.sendSocketMsg(obj)
        //成员列表，去掉空的
        var playerList = []
        this.data.playerList.map(item => {
            if (item && item.account) {
                playerList.push(item)
            }
        })
        this.setData({
            show_speak_count_down: false,
            jumpPopStatus4: false
        })
        if (this.data.personInd < (playerList.length - 1)) {
            //发言人index 小于 成员数量，切换下个人发言
            this.setData({
                personInd: this.data.personInd + 1,
            })
            this.speak()
        } else {
            //记录本轮内容
            this.addRecode()
            console.log('全部人发言结束,进入下一轮')
            if (this.data.step < this.data.themeDetail.list.length) {
                //轮数 小于 全部轮数，切换下一轮
                this.setData({
                    step: this.data.step + 1,
                })
                this.runStep()
            } else {
                //全部结束
                console.log('全部结束')
                if (this.data.isOwner) {
                    this.sendCustomMsg(4, { text: '全部结束' })
                }
                this.countDown()
            }

        }

    },
    //添加游戏记录
    addRecode: function () {
        //记录本轮内容
        // 要改成聊天区记录和发牌区记录 分开
        if (this.data.isOwner) {
            var msgList = APP.globalData.mesList;
            var stepMsgList = []
            msgList.map(item => {
                if (item.msgStep === this.data.step) {
                    stepMsgList.push(item)
                }
            })
            addRoomLog({
                roomId: this.data.roomData.id,
                askId: this.data.askId,
                detailsId: this.data.stepList[this.data.step - 1].id,
                playText: JSON.stringify(stepMsgList)
            })
        }
    },

    //发牌
    sendCard: function () {
        let that = this
        if (this.data.isOwner) {
            findByCard({
                id: this.data.roomData.id
            }).then(res => {
                if (res.data.ret === 200) {
                    var list = that.fenPai(res.data.data)
                    // 发牌接口房主调一次 分给其他人 每张牌添加一个yunid 发给每个人
                    //将卡牌显示到消息内容，但不能使用发送消息，不然每个人的牌都能看到
                    // 牌直接发三张 三张都记录
                    // var msgList = that.data.stepCardList
                    // var msgObj = {
                    //     sysType: 'sys',
                    //     cardList: list,
                    //     step: this.data.step,
                    // }
                    // msgList.push(msgObj)
                    // that.setData({
                    //     stepCardList: msgList
                    // })
                    console.log(list, 'list');
                    this.sendCustomMsg(5, { list: list })
                }
            })
        }
    },
    // 数组分成三份每份加一种yunid
    fenPai (cardArr) {
        let arr1 = []
        let arr2 = []
        for (let i = 0; i < cardArr.length; i += 3) {
            arr1.push(cardArr.slice(i, i + 3));
        }
        console.log(arr1);
        console.log(this.data.playerList);
        this.data.playerList.forEach((item, index) => {
            if (item?.account) {
                arr1[index].forEach(part => {
                    part['account'] = item.account
                    part['nick'] = item.nick
                    part['isOpened'] = false
                    part['isOpen'] = false
                    arr2.push(part)
                })
            }
        })
        console.log(arr2, 'arr2');
        return arr2
    },
    //翻牌
    clickCard: function (e) {
        if (this.data.canClickCard) {
            this.setData({
                canClickCard: false
            })
            var listIndex = e.currentTarget.dataset.listindex
            var cardIndex = e.currentTarget.dataset.index * 1
            var list = this.data.stepCardList
            var cardList = JSON.parse(JSON.stringify(list[listIndex].cardList))
            //调换位置
            list[listIndex].cardList[0] = cardList[cardIndex]
            list[listIndex].cardList[0].isOpen = true
            list[listIndex].cardList[cardIndex] = cardList[0]
            this.setData({
                stepCardList: list
            })
            var that = this;
            setTimeout(function () {
                list[listIndex].cardList[0].isOpened = true
                that.setData({
                    stepCardList: list,
                    canClickCard: true
                })
            }, 1000)
        }
    },
    //放大卡牌
    showImg: function (e) {
        this.setData({
            bigPopStatus: true,
            selectImgUrl: e.currentTarget.dataset.img
        })
    },
    //关闭放大
    closeImgPop: function () {
        this.setData({
            bigPopStatus: false,
        })
    },

    //查看往轮
    viewStep: function (e) {
        var step = e.currentTarget.dataset.step
        var stepList = this.data.stepList

        console.log(this.data.changeStep, 'this.data.changeStep');
        if (step < this.data.step) {
            //加类名
            stepList.map(item => {
                item.view = false
            })
            stepList[step - 1].view = true
            this.setData({
                stepList: stepList,
                helpText: this.data.themeDetail.list[step - 1]?.guideWords || '',
                changeStep: step
            })
        }
        if (step === this.data.step) {
            stepList.map(item => {
                item.view = false
            })
            this.setData({
                stepList: stepList,
                helpText: this.data.themeDetail.list[step - 1]?.guideWords || '',
                changeStep: step
            })
        }
        // if (this.data.step === this.data.themeDetail.list.length + 1) {
        //     console.log('这里是结语？？？');
        // } else {
        //     let arr = []
        //     let obj = {
        //         isBotMes: 0,
        //         step: step,
        //         sysType: "sys",
        //         cardList: []
        //     }
        //     if (step < this.data.step) {
        //         //加类名
        //         stepList.map(item => {
        //             item.view = false
        //         })
        //         stepList[step - 1].view = true
        //         this.setData({
        //             stepList: stepList,
        //         })

        //         //找msgList中对应轮的数据
        //         bbq:
        //         for (var j = 0; j < this.data.stepCardListAll.length; j++) {
        //             var item = this.data.stepCardListAll[j]
        //             ccc:
        //             for (var i = 0; i < item.cardList.length; i++) {
        //                 var part = item.cardList[i]
        //                 var part2 = item.cardList[i + 1]
        //                 var part3 = item.cardList[i + 2]
        //                 if (this.data.viewAccount) {
        //                     if (part.account == this.data.viewAccount && item.step == step) {
        //                         obj.cardList.push(part)
        //                         obj.cardList.push(part2)
        //                         obj.cardList.push(part3)
        //                         arr.push(obj)
        //                         break bbq; //直接跳出bbq外层循环
        //                     }
        //                 } else {
        //                     if (part.account == this.data.account && item.step == step) {
        //                         obj.cardList.push(part)
        //                         obj.cardList.push(part2)
        //                         obj.cardList.push(part3)
        //                         arr.push(obj)
        //                         break bbq; //直接跳出bbq外层循环
        //                     }
        //                 }
        //             }
        //         }
        //         console.log(this.data.stepCardListAll, 'stepCardListAll');
        //         console.log(arr, 'arr');
        //         this.setData({
        //             stepCardList: arr,
        //             showOtherStep: true
        //         })
        //     }
        //     if (step === this.data.step) {
        //         bbq2:
        //         for (let i = 0; i < this.data.stepCardListAll.length; i++) {
        //             const item = this.data.stepCardListAll[i];
        //             for (let j = 0; j < item.cardList.length; j++) {
        //                 var part = item.cardList[j]
        //                 var part2 = item.cardList[j + 1]
        //                 var part3 = item.cardList[j + 2]
        //                 if (this.data.viewAccount) {
        //                     if (part.account == this.data.viewAccount && item.step == step) {
        //                         obj.cardList.push(part)
        //                         obj.cardList.push(part2)
        //                         obj.cardList.push(part3)
        //                         arr.push(obj)
        //                         break bbq2; //直接跳出bbq外层循环
        //                     }
        //                 } else {
        //                     if (part.account == this.data.account && item.step == step) {
        //                         obj.cardList.push(part)
        //                         obj.cardList.push(part2)
        //                         obj.cardList.push(part3)
        //                         arr.push(obj)
        //                         break bbq2; //直接跳出bbq外层循环
        //                     }
        //                 }
        //             }
        //         }
        //         stepList.map(item => {
        //             item.view = false
        //         })
        //         this.setData({
        //             stepList: stepList,
        //             stepCardList: arr,
        //             showOtherStep: false

        //         })
        //     }

        // }
    },
    //查看用户卡牌
    viewPeopleMsg: function (e) {
        var datasetItem = e.currentTarget.dataset.item

        if (datasetItem?.account) {
            if (this.data.viewAccount === datasetItem.account) {
                this.setData({
                    viewAccount: '',
                    stepCardList: this.data.stepCardListCopy
                })

            } else {
                let arr = []
                bbq:
                for (var j = 0; j < this.data.stepCardListAll.length; j++) {
                    var item = this.data.stepCardListAll[j]
                    let obj = {
                        isBotMes: 0,
                        step: item.step,
                        sysType: "sys",
                        cardList: []
                    }
                    ccc:
                    for (var i = 0; i < item.cardList.length; i++) {
                        var part = item.cardList[i]
                        var part2 = item.cardList[i + 1]
                        var part3 = item.cardList[i + 2]
                        if (part.account == datasetItem.account) {
                            obj.cardList.push(part)
                            obj.cardList.push(part2)
                            obj.cardList.push(part3)
                            arr.push(obj)
                            break ccc; //直接跳出bbq外层循环
                        }
                    }
                }
                arr.forEach(element => {
                    element?.cardList.forEach((item, index) => {
                        item['isOpen'] = 1
                        item['isOpened'] = 1
                    });
                });
                this.setData({
                    viewAccount: datasetItem.account,
                    stepCardList: arr
                })
                console.log(arr, 'arrarrarrarr')
                console.log(this.data.stepCardListAll, 'this.data.stepCardListAll')
            }
        }
    },

    //存储数据
    saveData: function () {
        if (!this.data.isTuiChuRoom) {
            this.setData({
                topArr: formatMsgList(this.data.msgList).topArr,
                botArr: formatMsgList(this.data.msgList).botArr,
            })
            wx.setStorageSync('roomPath', this.data.pageOptions)
            wx.setStorageSync('partyData', this.data)
        }
    },

    //投诉
    handleTousu: function () {
        this.setData({
            showTousuPop: true,
            tousuResaon: 1
        })

        this.setData({
            kickPopStatus: true,
            // kickPlayer: e.currentTarget.dataset.item,
            // kickPopType: 2
        })
    },
    //结尾畅聊投诉
    handleTousu2: function (e) {
        this.setData({
            showTousuPop: true,
            tousuResaon: 1,
            kickPlayer: e.currentTarget.dataset.item,
        })
    },
    //选择投诉理由
    radioChange: function (e) {
        this.setData({
            tousuResaon: e.detail.value
        })

    },
    //上传投诉图片
    callGetPic: function () {
        let that = this;

        if (this.data.tousuImage.length >= 4) {
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
                that.uploadImg(tempFilePaths, 0)
            }
        })
    },
    //上传图片
    uploadImg: function (tempFilePaths, index) {
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
                        if (index === (tempFilePaths.length - 1)) {
                            wx.hideLoading();
                        } else {
                            that.uploadImg(tempFilePaths, (index + 1))
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
    delPic: function (e) {
        var index = e.currentTarget.dataset.index
        var images = this.data.tousuImage
        images.splice(index, 1)
        this.setData({
            tousuImage: images
        })
    },
    //输入投诉内容
    textInput: function (e) {
        this.setData({
            tousuTextarea: e.detail.value
        })
    },
    //提交投诉
    tousuSubmit: function () {
        var data = this.data
        var par = {
            content: data.tousuTextarea,
            roomId: data.roomData.id,
            imgUrl: data.tousuImage.join(','),
            type: data.tousuResaon,
            yunId: data.kickPlayer.account
        }
        complaintUser(par).then(res => {
            console.log(res)
            wx.showToast({
                title: '投诉成功',
                icon: 'none'

            })
            this.setData({
                showTousuPop: false
            })
        })
    },
    //去结尾畅聊
    toEnd: function () {
        wx.redirectTo({
            url: '/04zhutipaidui/fupan/index'
        })
    },

    //房间设置
    openSet: function () {
        this.setData({
            roomSetPopStatus: true
        })
    },


    lookLog: function () {
        wx.redirectTo({
            url: '/pages/my/probedetail/probedetail?id=' + this.data.themeDetail.id,
        })
    },

    //点赞
    dianZan: function (e) {
        console.log(this.data.showPlayerList)
        var that = this;
        var index = e.currentTarget.dataset.index
        var item = this.data.showPlayerList[index]
        var showPlayerList = this.data.showPlayerList
        console.log(showPlayerList)
        if (!item.isZan && item.account !== this.data.account) {
            likeTeammate({
                roomId: that.data.roomData.id,
                yunId: item.account
            }).then(res => {
                that.sendCustomMsg(7, { text: index })
                showPlayerList[index].isZan = true
                // showPlayerList[index].zan++
                this.setData({
                    showPlayerList: showPlayerList
                })
            })


        } else {
            // this.sendMsg(index, 'reduce')
            // playerList[index].isZan = false
        }


    },
    // 跳过复盘
    handleTiaoguo () {
        var that = this
        console.log(this.data.isOwner)
        this.stopPublishAudio()
        this.setData({
            haveRoom: false,
            showFupan: false,
            step: this.data.stepList.length + 1,
            changeStep: this.data.stepList.length + 1,
        })
        that.socket.close()
        that.socket = null

    },
    //离开
    quit: function () {
        var that = this
        this.setData({
            isTuichufangjian: false
        })
        if (this.data.isOwner && this.data.isfriend) {
            //解散房间
            dissolveGroup({
                id: this.data.roomData.id,
                token: wx.getStorageSync('tokenKey')
            })
            that.leaveRoomClear()
        } else {
            //退出房间
            quitRoom({
                id: this.data.roomData.id
            }).then(res => {
                that.leaveRoomClear()
            })
        }
    },
    // 写感悟
    handleXieganwu () {
        var that = this;
        that.setData({
            gwPopStatus: true
        })
    },
    //退出房间
    clickQuitRoom: function () {
        var that = this
        // that.sendCustomMsg(8, { account: that.data.account, isOver: 1 })
        that.sendCustomMsg(8, { account: that.data.account })
    },
    clickZhongTuQuitRoom () {
        let that = this
        this.sendCustomMsg(8, { account: that.data.account })
    },
    handleZhongTuTuiChu () {
        this.setData({
            isZhongTuTuiChu: true,
            roomSetPopStatus: false
        })
    },
    getUserName (account) {
        let nick = ''
        this.data.playerList.forEach(item => {
            if (item?.account && account === item.account) {
                nick = item.nick
            } else {
                console.log(account, 'account');
            }
        })
        return nick
    },
    // 退出房间清缓存跳转
    leaveRoomClear (jump) {
        this.setData({
            partyData: null,
            roomData: null,
            isTuiChuRoom: true
        })
        wx.removeStorageSync('roomData')
        wx.removeStorageSync('partyData')
        wx.removeStorageSync('roomPath')
        wx.removeStorageSync('isLinShiFangZhu')
        // 清除nim实例
        nim.destroy({
            done: function (err) {
                console.log('实例已被完全清除')
            }
        })
        if (jump === 1) {
            console.log('清除缓存');
        } else {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        }
    },


    //页面执行 end ************************************************
    watchBack: function (name, value) {
        // console.log('name==' + name);
        // console.log(value);
        // console.log(getApp().globalData.playerList);
        let data = {};
        data[name] = value;
        this.setData(data);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {
        if (timeInt) clearInterval(timeInt)
        if (timeout) clearInterval(timeout)
        if (readyTimeout) clearInterval(readyTimeout)
        if (startTimeout) clearInterval(startTimeout)
        if (this.data.haveRoom) {
            if (this.data.isOwner) {
                //房主
                this.saveData()
            } else {
                if (!this.data.isReady) {
                    this.leaveRoomClear()
                    //未准备，退出页面，代表退出房间。
                    // quitRoom({
                    //     roomId: this.data.roomData.id
                    // }).then(res => {
                    //     clearTimeout(readyTimeout)
                    //     wx.removeStorageSync('roomData')
                    // })
                } else {
                    //已经准备了
                    this.saveData()
                }
            }
        } else {
            console.log('房间不存在');
            wx.removeStorageSync('roomData')
            wx.removeStorageSync('partyData')
            wx.removeStorageSync('roomPath')
            wx.removeStorageSync('isLinShiFangZhu')
            if (this.socket) {

            }
        }
    },
    //content滚动
    contentScroll: function () {
        let view_id = 'view_id_' + parseInt(Math.random() * 1000000)
        this.setData({
            scrollTo: ''
        })
        this.setData({
            endId: view_id
        })
        this.setData({
            scrollTo: view_id
        })
    },
    openKefu () {
        this.setData({
            kefuPop: true
        })
    },
    bindTuichufangjian () {
        this.setData({
            isTuichufangjian: true
        })
    },
    handlePaiduikaishi () {
        this.setData({
            isPaiduiKaishi: false
        })
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },
    handleToggleFupanIsSay () {
        this.setData({
            fupanIsSay: !this.data.fupanIsSay,
            pushIsMuted: !this.data.pushIsMuted,
        })
        console.log('fupanIsSay', this.data.fupanIsSay);
    },
    // 复盘是否接受别人的音频声音
    handleToggleFupanIsVoice () {
        this.setData({
            fupanIsVoice: !this.data.fupanIsVoice,
            playIsMuted: !this.data.playIsMuted,
        })
    },
    backPrev () {
        this.clickZhongTuQuitRoom()
        wx.navigateBack();
    },
    handleIsLinShiFz () {
        this.setData({
            isLinShiFangZhu: false,
            activityPopStatus: wx.getStorageSync('activeStatus') ? false : true
        })
        wx.setStorageSync('isLinShiFangZhu', 1)
        this.sendCustomMsg(4, { text: '您已成为临时房主（无踢人权限）,快去邀请更多的人参与派对吧~' })
    },
    handleOpenGuiZe () {
        this.setData({
            isRoomGuiZe: true
        })
    },
    webSocketInit () {
        let vm = this
        let that = this
        vm.socket = wx.connectSocket({
            url: 'ws://wenxin.wxdao.net:20016/wc',
            success (res) {
                console.log('WebSocket 连接成功: ', res)
                vm.pingSocket()
            },
            fail (err) {
                console.log('WebSocket 连接失败: ', err)
            }
        })
        // onOpen
        vm.socket.onOpen((ret) => {
            console.log('打开 WebSocket 连接111')
            console.log(vm.data.isOnloadSocket);
            if (vm.data.isOnloadSocket) {
                vm.refreshSendSocketMsg()
                vm.setData({
                    isOnloadSocket: false
                })
            }
        })
        // onMessage
        vm.socket.onMessage((ret) => {
            let socketData = JSON.parse(ret.data)
            let nextPerson = ''; //下一个玩家是谁
            let nextPlayNum = ''; //下一轮是哪一轮
            let type = Number(socketData.type) //是轮到发言还是
            //成员列表，去掉空的
            console.log('onMessage', type);
            var playerList = []
            that.data.playerList.map(item => {
                if (item && item.account) {
                    playerList.push(item)
                }
            })
            if (socketData.downTime === 0) {
                if (type === 1) {
                    // 开始倒计时结束,开始游戏
                    that.handleBegin()
                    that.setData({
                        timePopStatus: false
                    })

                } else if (type === 2) {
                    // 思考倒计时结束,此时轮到第一个人发言,同时type改为发言倒计时
                    console.log("这里是不是走了两次??????");
                    that.speak()
                } else if (type === 3) {
                    // 发言倒计时结束
                    // 先判断下一个发言倒计时的是哪个人
                    // 如果当前是最后一个的话应该开始下一轮的思考倒计时
                    that.nextPerson()

                } else if (type === 4) {
                    // 结尾倒计时结束
                    that.handleTiaoguo()
                }
            } else if (that.data.waitTime == 3) {
                var routeList = getCurrentPages()
                if (routeList[routeList.length - 1].route !== '04zhutipaidui/tansuo/tansuo') {
                    console.log('该回来了')
                    wx.showModal({
                        title: '提示',
                        content: '派对即将开始，请返回房间',
                        success (res) {
                            if (res.confirm) {
                                var url = '/04zhutipaidui/tansuo/tansuo'
                                var roomPath = that.data.pageOptions
                                for (const roomPathKey in roomPath) {
                                    url = url + '&' + roomPathKey + '=' + roomPath[roomPathKey]
                                }
                                url.replace('&', '?')
                                wx.redirectTo({
                                    url: url.replace('&', '?'),
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                                //退出房间
                                quitRoom({
                                    id: that.data.roomData.id
                                }).then(res => {
                                    that.leaveRoomClear()
                                })
                            }
                        }
                    })
                }
                vm.setData({
                    waitTime: socketData.downTime
                })
            }
            else {
                if (type === 1) {
                    // 开始倒计时进行中
                    vm.setData({
                        waitTime: socketData.downTime
                    })
                } else if (type === 2) {
                    // 思考倒计时进心中
                    vm.setData({
                        waitTime: socketData.downTime,
                        show_think_count_down: true,
                        show_speak_count_down: false,
                    })
                } else if (type === 3) {
                    // 发言倒计时进行中

                    //当前发言人账号
                    let curAcc = playerList[socketData.readyPerson]?.account
                    //我的账号
                    let myAcc = wx.getStorageSync('loginInfo').yunId
                    let totalTime = that.data.themeDetail.list[socketData.playNum - 1].speakTime
                    if (curAcc == myAcc) {
                        that.setData({
                            inputStatus: 1,
                            show_speak_count_down: true,
                            waitTime: socketData.downTime,
                            show_think_count_down: false,
                            isJump: false,
                            voiceStatus: 1
                        })
                        // if (totalTime - socketData.downTime > 30 && that.data.show_speak_count_down && !that.data.isFaYan) {
                        //     that.setData({
                        //         jumpPopStatus5: true
                        //     })
                        //     that.jumpConfirm()
                        // }
                    } else {
                        that.setData({
                            inputStatus: 0,
                            waitTime: socketData.downTime,
                            show_think_count_down: false,
                            show_speak_count_down: false,
                            voiceStatus: 0
                        })
                    }

                } else if (type === 4) {
                    // 结尾开始
                    vm.setData({
                        sec: socketData.downTime,
                        showFupan: true,
                        show_think_count_down: false,
                        show_speak_count_down: false
                    })
                }
            }
            // console.log(socketData, 'socketData');
            if (socketData.readyPerson && socketData.playNum) {
                that.setData({
                    step: Number(socketData.playNum),
                    personInd: Number(socketData.readyPerson),
                })
            } else if (socketData.playNum) {
                that.setData({
                    step: Number(socketData.playNum),
                    personInd: 0,
                })
            }
            that.saveData()
        })
        // onError
        vm.socket.onError((err) => {
            console.log('WebSocket 连接失败：', err)
        })
        // onClose
        vm.socket.onClose((ret) => {
            console.log('断开 WebSocket 连接', ret)
            clearInterval(vm.SocketInterval)
            vm.SocketInterval = null
        })
    },
    // WebSocket 断线重连
    reconnectSocket () {
        const vm = this
        if (vm.data.step < this.data.stepList.length + 1) {
            vm.webSocketInit()
        }
    },
    // send message
    /**
     * 
     * @param {*} type 倒计时类型(开始倒计时 1,思考时间倒计时2,发言时间倒计时3,结尾倒计时4)
     * @param {*} readyPerson 准备发言人员(如果是思考时间类型的话)/正在发言人员(如果是发言倒计时的话)
     * @param {*} playNum 当前是游戏第几轮
     * @param {*} downTime 倒计时时间
     * @param {*} isJump 是否跳过
     * @param {*} note 其他信息的对象字符串
     */
    sendSocketMsg (params) {
        const vm = this
        let obj = JSON.stringify({
            type: params?.type,
            readyPerson: params?.readyPerson,
            roomId: vm.data?.roomData?.id || 2,
            playNum: params?.playNum,
            downTime: params?.downTime,
            isJump: params?.isJump || 0,
            userId: wx.getStorageSync('loginInfo').id || 1,
            note: params?.note,
            cmd: 'msg002'
        })
        vm.socket.send({
            data: obj,
            success (res) {
                console.log('WebSocket 消息发送成功', res)
            },
            fail (err) {
                console.log('WebSocket 消息发送失败', err)
            }
        })
    },
    refreshSendSocketMsg () {
        const vm = this
        let obj = JSON.stringify({
            roomId: vm.data.roomData.id,
            userId: vm.data.account,
            isJump: 0,
            cmd: 'msg002'
        })
        vm.socket.send({
            data: obj,
            success (res) {
                console.log('WebSocket 消息发送成功', res)
            },
            fail (err) {
                console.log('WebSocket 消息发送失败', err)
            }
        })
    },
    // 跳过
    jumpSocket () {
        let vm = this
        let obj = {
            roomId: vm.data.roomData.id,
            isJump: 1,
            userId: vm.data.account,
            cmd: 'msg002'
        }
        vm.sendSocketMsg(obj)
    },
    // socket心跳，由客户端发起
    pingSocket () {
        const vm = this
        let times = 0
        let obj = JSON.stringify({
            "cmd": "msg001",
            "heart": "1"
        })
        // 每 10 秒钟由客户端发送一次心跳
        vm.SocketInterval = setInterval(function () {
            if (vm.socket?.readyState == 1) {
                vm.socket.send({
                    data: obj,
                    success (res) {
                        // console.log('心跳发送成功', res)
                    },
                    fail (err) {
                        // console.log('心跳发送失败', err)
                    }
                })
            } else {
                times += 1
                // 超时重连，最多尝试 10 次
                if (times >= 10) {
                    wx.showToast({
                        title: 'WebSocket 连接已断开~',
                        icon: 'none',
                        duration: 3000
                    })
                    clearInterval(vm.SocketInterval)
                } else {
                    vm.reconnectSocket()
                }
            }
        }, 10000)
    },
    onShow () {
        var partyData = wx.getStorageSync('partyData')
        if (partyData) {
            this.setData({
                roomId: partyData.roomId,
                teamId: partyData.teamId,
                roomData: wx.getStorageSync('roomData'),
                audioId: wx.getStorageSync('roomData').audioGroup,
                isOnloadSocket: true
            })
            setTimeout(() => {
              this.webSocketInit()
            }, 1000);
            console.log(partyData, 'partyData');
        }
    },
    onHide () {
        if (this.socket) {
            this.socket.close({
                success (res) {
                    console.log('关闭成功', res)
                },
                fail (err) {
                    console.log('关闭失败', err)
                }
            })
            this.socket = null
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {
        console.log(options, 'options');

        if (this.socket) {
            this.socket.close({
                success (res) {
                    console.log('关闭成功', res)
                },
                fail (err) {
                    console.log('关闭失败', err)
                }
            })
        }
        if (options.roomId) {
            // this.getUserInfo()
            this.contentScroll()
            var partyData = wx.getStorageSync('partyData')

            if (partyData) {
                //进入过页面，从别处返回
                this.setData(partyData)
                this.setData({
                    roomId: partyData.roomId,
                    teamId: partyData.teamId,
                    roomData: wx.getStorageSync('roomData'),
                    audioId: wx.getStorageSync('roomData').audioGroup,
                    isOnloadSocket: true
                })

                //重新进来，准备后的倒计时没有结束，继续显示
                if (this.data.timePopStatus) {
                    clearTimeout(startTimeout)
                    var waitTime = this.data.waitTime - 1
                    this.setData({
                        waitTime: waitTime
                    })
                    this.startCountDown()
                }

                // this.setData({
                //     timePopStatus:false
                // })
                //真实环境，考虑删除initRoom？
                console.log("开始进入初始化房间 initRoom")
                this.initRoom()
                console.log(this.data.yunMsgList, 'this.data.yunMsgList');
                //处理存储的消息
                // this.data.yunMsgList.map(item => {
                //     this.renderHistoryMsh(item)
                // })
            } else {
                //第一次进入页面
                this.setData({
                    pageOptions: options
                })
                var that = this;
                this.setData({
                    isfriend: Number(options.isfriend) ? true : false,
                    askId: options.askId || '',
                    roomId: options.roomId || '',
                    isMatch: Number(options.isMatch) ? true : false,
                })
                //派对详情
                await that.getPartyDet()
                //活动须知弹窗，不再显示
                if (wx.getStorageSync('activeStatus')) {
                    this.setData({
                        activityPopStatus: false
                    })
                }
                if (wx.getStorageSync('roomData')) {
                    //有房间数据
                    that.setData({
                        roomData: wx.getStorageSync('roomData'),
                        teamId: wx.getStorageSync('roomData').imGroup,
                        audioId: wx.getStorageSync('roomData').audioGroup,
                    })
                    that.initRoom()
                } else {
                    // 没有房间数据
                    // 如果是邀请好友的话带isfriend参数直接初始化房间 或者 是匹配的
                    if (Number(options.isMatch)) {
                        // if (options.isYaoQing) {
                        //     roomMatchingPlay(options.askId).then(res => {
                        //         that.getRoomDetails(options.roomId)
                        //     })
                        // }else{
                        //     that.getRoomDetails(options.roomId)
                        // }
                        that.getRoomDetails(options.roomId)
                    } else if (Number(options.isfriend)) {
                        inviteFriendsRoom({ roomId: options.roomId }).then(res => {
                            console.log('好友进入房间了', res.data.ret);
                            if (res.data.ret == 201) {
                                that.setData({
                                    isPaiduiKaishi: true
                                })
                            } else {
                                that.getRoomDetails(options.roomId)
                            }
                        })
                    } else {
                        //  初始化房间
                        that.getRoomDetails(options.roomId)
                    }
                }
            }
            if (!this.socket) {
                this.webSocketInit()
            }
        } else {
            this.setData({
                haveRoom: false
            })
            wx.reLaunch({
                url: '/pages/index/index',
            })
        }
    },
    onUnload () {
        const vm = this;
        vm.socket && vm.socket.close()
        try {
            YunXinNertc.leave()
            YunXinNertc.destroy()
            YunXinNertc = null
        } catch (e) {
            console.log(e, 'eeeeeeeeeeee');
        }
    },
    //邀请好友
    onShareAppMessage () {
        console.log('/04zhutipaidui/tansuo/tansuo?askId=' + this.data.askId + '&roomId=' + this.data.roomData.id + '&isfriend=1' + '&isYaoQing=1');
        return {
            title: this.data.themeDetail.title,
            path: '/04zhutipaidui/tansuo/tansuo?askId=' + this.data.askId + '&roomId=' + this.data.roomData.id + '&isfriend=1',
        }
    },
    //邀请好友
    onShareTimeline () {
        console.log('/04zhutipaidui/tansuo/tansuo?askId=' + this.data.askId + '&roomId=' + this.data.roomData.id + '&isfriend=1');
        return {
            title: this.data.themeDetail.title,
            query: 'askId=' + this.data.askId + '&roomId=' + this.data.roomData.id + '&isfriend=1', // 路径，传递参数到指定页面。
            imageUrl: '',
        }
    },
    /**
     * 写感悟方面的方法
     * @param {*} e 
     */
    inputArea (e) {
        if (e.detail.value.length >= 500) {
            wx.showToast({
                title: '最多输入500个字',
                icon: 'none'
            })
        }
    },
    changeRating (e) {
        this.setData({
            rating: e.detail
        })
    },
    bindFormSubmit (e) {
        let params = {
            category: 1,
            objectId: this.data.themeDetail.id,
            score: this.data.rating,
            evaluate: e.detail.value.textarea,
        }
        insertEvaluate(params).then(res => {
            this.setData({
                gwPopStatus: false
            })
        })
    },
    // handleInviFriend () {
    //     console.log('/04zhutipaidui/tansuo/tansuo?askId=' + this.data.askId + '&roomId=' + this.data.roomData.id + '&isfriend=1' + '&isYaoQing=2');
    //     return {
    //         title: this.data.themeDetail.title,
    //         path: '/04zhutipaidui/tansuo/tansuo?askId=' + this.data.askId + '&roomId=' + this.data.roomData.id + '&isfriend=1', // 路径，传递参数到指定页面。
    //     }
    // }
})
