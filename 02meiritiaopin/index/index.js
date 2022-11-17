// 02meiritiaopin/index/index.js
import {
    addFm,
    findByFmForUser,
    getDayCard,
    inspectText,
    dayForSignNumber,
    uploadFile
} from "../../utils/fm";
import {
    formatTime,
} from "../../utils/util";
import config from "../../utils/config";
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const  audioCtx = wx.createInnerAudioContext();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isOpen: 0,
        playPopStatus: false,
        bigPopStatus: false,
        tabs: ['每日意图', '要事规划', '复盘'],
        activeIndex: 0,
        cardList: [],
        cardShow: false,
        cardIndex: 1,
        activeCard: {},
        signNum: 0,
        putType: 1,
        content: [],
        contents: {
            txt: "",
            voice: ""
        },
        types: 0, // 类型1每日调频,2每日事件,3复盘
        autioStatus: 1,
        tempFilePath: "",
        nowDate: null,
        nowDate2: "",
        audioStr: "",
        isPlay: false,
        contentsArray:[
            {
                txt: "",
                voice: "",
                putType: 1,
                autioStatus: 1,
                cardShow:false,
                tempFilePath:'',
            }
        ],
        initContentsArray:[
            {
                txt: "",
                voice: "",
                putType: 1,
                autioStatus: 1,
                cardShow:false,
                tempFilePath:'',
            }
        ]
    },
    initAudio(){
        this.setData({
            putType: 1,
            autioStatus: 1,
            cardShow:false,
            isOpen:0
        })
    },
    addThing(){
        var arr = this.data.contentsArray;
        arr.push({
            txt: "",
            voice: "",
            putType: 1,
            autioStatus: 1,
            cardShow:false,
            tempFilePath:'',
        })
        this.setData({
            contentsArray:arr
        })
    },
    changePutType(e) {
        console.log(e.currentTarget.dataset.iid);
        var arr = this.data.contentsArray;
        arr[e.currentTarget.dataset.iid]['putType'] = e.currentTarget.dataset.type
        this.setData({
            contentsArray: arr
        })
    },
    radioChange(data) {
        this.setData({
            isOpen: Number(data.detail.value)
        })
    },
    openPlayPop() {
        var that = this;
        that.setData({
            playPopStatus: true
        })
    },
    openBig(e) {
        this.setData({
            bigPopStatus: true,
        })
    },
    closePop() {
        var that = this;
        that.setData({
            playPopStatus: false,
            bigPopStatus: false
        })
    },
    changeTab(e) {
        this.setData({
            activeIndex: e.currentTarget.dataset.ind,
            types: e.currentTarget.dataset.ind + 1
        })
        this.initAudio()

    },
    changeCard(e) {
        let active = this.data.cardList[e.currentTarget.dataset.ind]
        this.setData({
            cardIndex: e.currentTarget.dataset.ind,
            activeCard: active
        })
    },
    initData() {
        this.setData({
            nowDate: formatTime(new Date())
        })
        console.log(this.data.nowDate);
        this.getDayCard()
        this.dayForSignNumber()
    },
    // 新增每日调频
    addFm() {
        let params = {
            cardUrl: this.data.activeCard.imgUrl,
            contents: JSON.stringify(this.data.contentsArray),
            types: this.data.types,
            isOpen: this.data.isOpen
        }
        var that =this;
        addFm(params).then(res => {
            console.log(res.data.data);
            if (res.data.data) {
                that.setData({
                    contentsArray: that.data.initContentsArray
                })
                wx.navigateTo({
                  url: '/02meiritiaopin/share/share?id='+res.data.data,
                })
            }
        })
    },
    // 查询自己每日调频记录
    findByFmForUser() {},
    // 随机查询今日随机卡牌
    getDayCard() {
        let that = this;
        getDayCard().then(res => {
            console.log(res.data.data);
            that.setData({
                cardList: res.data.data,
                activeCard: res.data.data[1]
            })
        })
    },
    // 检查文档是否合规
    inspectText(e) {
        let param = {
            text: e.detail.value
        }
        let that = this
        inspectText(param).then(res => {
            if (res.data.data == true) {
                var arr = that.data.contentsArray;
                arr[e.currentTarget.dataset.iid]['txt'] = e.detail.value
                that.setData({
                    contentsArray: arr
                })
                return
            } else {
                if (e.detail.value != '') {
                    wx.showModal({
                        title: '文字不合规，请重新输入',
                    })
                    var arr = that.data.contentsArray;
                    arr[e.currentTarget.dataset.iid]['txt'] = ''
                    that.setData({
                        contentsArray: arr
                    })
                }
            }
        })
    },
    // 查询当天签到人数
    dayForSignNumber() {
        dayForSignNumber().then(res => {
            this.setData({
                signNum: res.data.data.number || 0,
                nowDate2: res.data.data.chinese.chineseMonth + res.data.data.chinese.chineseDay
            })
        })
    },
    // 查询本人连续签到次数
    findByIsFlagNumber() {},
    showCard() {
        let show = this.data.cardShow
        this.setData({
            cardShow: !show
        })
    },
    // 录音
    start: function(e) {
        var that = this
        const options = {
            duration: 10000, //指定录音的时长，单位 ms
            sampleRate: 16000, //采样率
            numberOfChannels: 1, //录音通道数
            encodeBitRate: 96000, //编码码率
            format: 'mp3', //音频格式，有效值 aac/mp3
            frameSize: 5000, //指定帧大小，单位 KB
        }
        //开始录音
        wx.authorize({
            scope: 'scope.record',
            success() {
                console.log("录音授权成功");
                //第一次成功授权后 状态切换为2
                var arr = that.data.contentsArray;
                arr[e.currentTarget.dataset.iid]['autioStatus'] = 2
                that.setData({
                    contentsArray: arr
                })
                recorderManager.start(options);
                recorderManager.onStart(() => {
                    console.log('recorder start')
                });
                //错误回调
                recorderManager.onError((res) => {
                    console.log(res);
                })
            },
            fail() {
                console.log("第一次录音授权失败");
                wx.showModal({
                    title: '提示',
                    content: '您未授权录音，功能将无法使用',
                    showCancel: true,
                    confirmText: "授权",
                    confirmColor: "#52a2d8",
                    success: function(res) {
                        if (res.confirm) {
                            //确认则打开设置页面（重点）
                            wx.openSetting({
                                success: (res) => {
                                    console.log(res.authSetting);
                                    if (!res.authSetting['scope.record']) {
                                        //未设置录音授权
                                        console.log("未设置录音授权");
                                        wx.showModal({
                                            title: '提示',
                                            content: '您未授权录音，功能将无法使用',
                                            showCancel: false,
                                            success: function(res) {

                                            },
                                        })
                                    } else {
                                        //第二次才成功授权
                                        console.log("设置录音授权成功");
                                        var arr = that.data.contentsArray;
                                        arr[e.currentTarget.dataset.iid]['autioStatus'] = 2
                                        that.setData({
                                            contentsArray: arr
                                        })

                                        recorderManager.start(options);
                                        recorderManager.onStart(() => {
                                            console.log('recorder start')
                                        });
                                        //错误回调
                                        recorderManager.onError((res) => {
                                            console.log(res);
                                        })
                                    }
                                },
                                fail: function() {
                                    console.log("授权设置录音失败");
                                }
                            })
                        } else if (res.cancel) {
                            console.log("cancel");
                        }
                    },
                    fail: function() {
                        console.log("openfail");
                    }
                })
            }
        })


    },
    //暂停录音
    pause: function(e) {
        var that = this;
        recorderManager.pause();
        recorderManager.onPause((res) => {
            console.log(res);
            var arr = that.data.contentsArray;
            arr[e.currentTarget.dataset.iid]['autioStatus'] = 3
            arr[e.currentTarget.dataset.iid]['tempFilePath'] = res.tempFilePath
            that.setData({
                contentsArray: arr
            })
            console.log('暂停录音')

        })
    },
    //继续录音
    resume: function() {
        recorderManager.resume();
        recorderManager.onStart(() => {
            console.log('重新开始录音')
        });
        //错误回调
        recorderManager.onError((res) => {
            console.log(res);
        })
    },
    //停止录音
    stop: function(e) {
        var that = this;
        recorderManager.stop();
        recorderManager.onStop((res) => {
            var arr = that.data.contentsArray;
            arr[e.currentTarget.dataset.iid]['autioStatus'] = 3
            arr[e.currentTarget.dataset.iid]['tempFilePath'] = res.tempFilePath
            that.setData({
                contentsArray: arr
            })
            console.log('停止录音', res.tempFilePath)
            const {
                tempFilePath
            } = res
        })
    },
    //播放声音
    play: function(e) {
        innerAudioContext.autoplay = true
        
        innerAudioContext.src = this.data.contentsArray[e.currentTarget.dataset.iid].tempFilePath,
            innerAudioContext.onPlay(() => {
                console.log('开始播放')
            })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    closeAudio(e) {
        var arr = that.data.contentsArray;
        arr[e.currentTarget.dataset.iid]['putType'] = 1
        arr[e.currentTarget.dataset.iid]['tempFilePath'] = ''
        arr[e.currentTarget.dataset.iid]['autioStatus'] = 1
        that.setData({
            contentsArray: arr
        })
    },
    saveAudio(e) {
        var that = this
        recorderManager.stop();
        wx.uploadFile({
            url: config.getDomain + '/oss/upload/uploadFile', 
            filePath: that.data.contentsArray[e.currentTarget.dataset.iid].tempFilePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data',
                'token':wx.getStorageSync('tokenKey') || ''
            },
            success(res) {
                var arr = that.data.contentsArray;
                arr[e.currentTarget.dataset.iid]['autioStatus'] = 0
                arr[e.currentTarget.dataset.iid]['putType'] = 5
                arr[e.currentTarget.dataset.iid]['tempFilePath'] = ''
                arr[e.currentTarget.dataset.iid]['audioStr'] = JSON.parse(res.data).data
                arr[e.currentTarget.dataset.iid]['voice'] = JSON.parse(res.data).data
                that.setData({
                    contentsArray: arr
                })
                audioCtx.src= JSON.parse(res.data).data;
            }
        })
    },
    playAudio(){
        if (this.data.isPlay) {
            audioCtx.pause()
            this.setData({
                isPlay:false
            })
        }else{
            audioCtx.play()
            this.setData({
                isPlay:true
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.initData()
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