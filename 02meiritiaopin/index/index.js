import {
    addFm,
    findByFmForUser,
    getDayCard,
    getChangeCard,
    findMyTemp,
    inspectText,
    dayForSignNumber,
    findMyFmForDay,
    uploadFile
} from "../../utils/fm";
import {
    formatTime,
} from "../../utils/util";
import config from "../../utils/config";

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const audioCtx = wx.createInnerAudioContext();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isOpen: 1,
        playPopStatus: false,
        bigPopStatus: false,
        tabs: ['今日意图', '今日要事', '今日复盘'],
        activeIndex: 0,
        cardList: [],
        cardShow: false,
        cardIndex: 1,
        bigCardImgUrl: {},
        signNum: 0,
        putType: 1,
        content: [],
        contents: {
            txt: "",
            voice: ""
        },
        types: 0, // 类型0每日调频,1每日事件,2复盘
        autioStatus: 1,
        tempFilePath: "",
        nowDate: null,
        nowDate2: "",
        audioStr: "",
        isPlay: false,
        contentsArray: [
            [{
                txt: "",
                voice: "",
                putType: 1,
                autioStatus: 1,
                cardShow: false,
                tempFilePath: '',
                imgUrl: '',
                cards: [],
                showCards: false,
                cardIndex: 0,
                times: '',
                startTime: '',
                endTime: '',
                cardGroup: [],
                cardGroupIndex: 0
            }], [{
                txt: "",
                voice: "",
                putType: 1,
                autioStatus: 1,
                cardShow: false,
                tempFilePath: '',
                imgUrl: '',
                cards: [],
                showCards: false,
                cardIndex: 0,
                times: '',
                startTime: '',
                endTime: '',
                cardGroup: [],
                cardGroupIndex: 0
            }], [{
                txt: "",
                voice: "",
                putType: 1,
                autioStatus: 1,
                cardShow: false,
                tempFilePath: '',
                imgUrl: '',
                cards: [],
                showCards: false,
                cardIndex: 0,
                times: '',
                startTime: '',
                endTime: '',
                cardGroup: [],
                cardGroupIndex: 0
            }]
        ],
        initContentsArray: [
            [{
                txt: "",
                voice: "",
                putType: 1,
                autioStatus: 1,
                cardShow: false,
                tempFilePath: '',
                imgUrl: '',
                cards: [],
                showCards: false,
                cardIndex: 0,
                times: '',
                startTime: '',
                endTime: '',
                cardGroup: [],
                cardGroupIndex: 0
            }], [{
                txt: "",
                voice: "",
                putType: 1,
                autioStatus: 1,
                cardShow: false,
                tempFilePath: '',
                imgUrl: '',
                cards: [],
                showCards: false,
                cardIndex: 0,
                times: '',
                startTime: '',
                endTime: '',
                cardGroup: [],
                cardGroupIndex: 0
            }], [{
                txt: "",
                voice: "",
                putType: 1,
                autioStatus: 1,
                cardShow: false,
                tempFilePath: '',
                imgUrl: '',
                cards: [],
                showCards: false,
                cardIndex: 0,
                times: '',
                startTime: '',
                endTime: '',
                cardGroup: [],
                cardGroupIndex: 0
            }]
        ],
        isEditFm: false,
        isEditFmChange: false,
        submitFmData: null,
        shareId: ''


    },
    initAudio () {
        audioCtx.pause()
        audioCtx.src = null
        this.setData({
            putType: 1,
            autioStatus: 1,
            cardShow: false,
            isOpen: 0,
            isPlay: false
        })
    },
    addThing () {
        var arr = this.data.contentsArray;
        arr[this.data.activeIndex].push({
            txt: "",
            voice: "",
            putType: 1,
            autioStatus: 1,
            cardShow: false,
            tempFilePath: '',
            imgUrl: '',
            cards: [],
            showCards: false,
            cardIndex: 0,
            times: '',
            startTime: '',
            endTime: '',
            cardGroupIndex: 0,
            cardGroup: []
        })
        this.setData({
            contentsArray: arr
        })
    },
    changePutType (e) {
        var arr = this.data.contentsArray;
        arr[this.data.activeIndex][e.currentTarget.dataset.iid]['putType'] = e.currentTarget.dataset.type
        this.setData({
            contentsArray: arr
        })
    },
    radioChange (data) {
        this.setData({
            isOpen: Number(data.detail.value)
        })
    },
    openPlayPop () {
        var that = this;
        that.setData({
            playPopStatus: true
        })
    },
    openBig (e) {
        this.setData({
            bigPopStatus: true,
            bigCardImgUrl: this.data.isEditFm ? this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.pindex].cards[e.currentTarget.dataset.index].imgUrl : this.data.submitFmData.imgUrl
        })
    },
    closePop () {
        var that = this;
        that.setData({
            playPopStatus: false,
            bigPopStatus: false
        })
    },
    changeTab (e) {
        var that = this;
        that.setData({
            activeIndex: e.currentTarget.dataset.ind,
            types: e.currentTarget.dataset.ind
        })
        this.findMyTemp();
        this.findMyFmForDay();
        that.initAudio()
    },
    changeCard (e) {
        this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.pindex].cardIndex = e.currentTarget.dataset.ind
        this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.pindex].imgUrl = this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.pindex].cards[e.currentTarget.dataset.ind].imgUrl;
        this.setData({
            contentsArray: this.data.contentsArray
        })
    },
    initData () {
        this.setData({
            nowDate: formatTime(new Date())
        })
        this.findMyTemp();
        // this.getDayCard()
        this.dayForSignNumber()
    },
    findMyTemp () {
        findMyTemp(this.data.types).then(res => {
            if (res.data.ret == 200) {
                if (res.data.data) {
                    if (this.data.contentsArray[this.data.activeIndex][0].cards.length = 0) {
                        this.data.contentsArray[this.data.activeIndex][0].cardIndex = 0
                    }
                    var cards = JSON.parse(res.data.data.contents);
                    var orgCards = JSON.parse(res.data.data.contents)
                    console.log(cards)
                    var cardGroup = []
                    if (cards.length >= 3) {
                        cards = cards.splice(0, 3);

                        //创建牌组
                        cardGroup.push([])
                        if (orgCards.length >= 6) {
                            cardGroup.push([])
                        }
                        if (orgCards.length >= 9) {
                            cardGroup.push([])
                        }
                        if (orgCards.length >= 12) {
                            cardGroup.push([])
                        }
                        console.log(orgCards.length)
                        orgCards.map((item, index) => {
                            if (index <= 2) {
                                cardGroup[0].push(item)
                            }
                            if (index > 2 && index <= 5) {
                                cardGroup[1].push(item)
                            }
                            if (index > 5 && index <= 8) {
                                cardGroup[2].push(item)
                            }
                            if (index > 8 && index <= 12) {
                                cardGroup[3].push(item)
                            }
                        })
                    }


                    this.data.contentsArray[this.data.activeIndex][0].cards = cards;
                    this.data.contentsArray[this.data.activeIndex][0].showCards = true;
                    this.data.contentsArray[this.data.activeIndex][0].imgUrl = this.data.contentsArray[this.data.activeIndex][0].cards[0].imgUrl

                    //加入牌组
                    this.data.contentsArray[this.data.activeIndex][0].cardGroup = cardGroup
                    this.setData({
                        contentsArray: this.data.contentsArray
                    })
                    console.log(this.data.contentsArray)
                }


            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
        });
    },
    //切换牌组
    nextGroupIndex: function (e) {
        var contentsArray = this.data.contentsArray
        var content = contentsArray[this.data.activeIndex]
        content[0].cardGroupIndex++
        content[0].cards = content[0].cardGroup[content[0].cardGroupIndex]
        this.setData({
            contentsArray: contentsArray
        })
    },
    prevGroupIndex: function () {
        var contentsArray = this.data.contentsArray
        var content = contentsArray[this.data.activeIndex]
        content[0].cardGroupIndex--
        content[0].cards = content[0].cardGroup[content[0].cardGroupIndex]
        this.setData({
            contentsArray: contentsArray
        })
    },
    // 新增每日调频
    async addFm () {
        var isGoOn = true;
        for (var i = 0; i < this.data.contentsArray[this.data.activeIndex].length; i++) {
            await new Promise((resolve) => {
                if (this.data.contentsArray[this.data.activeIndex][i].imgUrl == '') {
                    resolve({ ret: false, msg: '请抽取一张卡牌' });
                }
                if (this.data.contentsArray[this.data.activeIndex][i].txt != '' || this.data.contentsArray[this.data.activeIndex][i].voice != '') {
                    if (this.data.contentsArray[this.data.activeIndex][i].txt != '') {
                        inspectText({
                            text: this.data.contentsArray[this.data.activeIndex][i].txt
                        }).then(res => {
                            if (!res.data.data) {
                                resolve({ ret: false, msg: res.data.msg });
                            } else {
                                resolve({ ret: true });
                            }
                        })
                    } else {
                        resolve({ ret: true });
                    }
                } else {
                    resolve({ ret: false, msg: '请输入一段文字' });
                }
            }).then(res => {
                if (!res.ret) {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none'
                    });
                    isGoOn = false;
                    return false;
                }
            })
        }
        if (!isGoOn) {
            return false;
        }
        let params = {
            contents: JSON.stringify(this.data.contentsArray[this.data.activeIndex]),
            types: this.data.types,
            isOpen: this.data.isOpen
        }
        var that = this;
        addFm(params).then(res => {
            if (res.data.data) {
                that.setData({
                    contentsArray: that.data.initContentsArray,
                    isEditFm: true,
                    shareId: res.data.data,
                    isEditFmChange: true
                })
                that.guanBiVoice()
                that.findMyFmForDay()
            }
        })
    },
    inspectText (txt) {
        return new Promise((resole, reject) => {//检查文档内容是否合规
            inspectText({
                text: txt
            }).then(res => {
                resole(res.data);
            })
        })
    },
    // 随机查询今日随机卡牌
    getDayCard (e) {
        let that = this;
        getDayCard(that.data.types).then(res => {
            if (res.data.ret == 200) {
                if (this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.index].cards.length = 0) {
                    this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.index].cardIndex = 0
                }
                this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.index].cardGroup = [res.data.data]
                this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.index].cards = res.data.data;
                this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.index].showCards = true;
                this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.index].imgUrl = this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.index].cards[e.currentTarget.dataset.index].imgUrl
                that.setData({
                    contentsArray: this.data.contentsArray
                })
                console.log(this.data.contentsArray)
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
        })
    },
    // 随机查询今日随机卡牌
    getChangeCard (e) {
        var data2 = [
            {
                addTime: "2022-12-16T14:49:13.000+0000",
                addUserId: 9,
                cardName: "问心卡图片sRGB大版本-32",
                category: 0,
                deleted: 0,
                id: 336,
                imgUrl: "https://file.wxdao.net/2022-12/dbacdbb6-3751-488d-b459-7b2646b9fc71.jpg",
                status: 2,
                updateTime: null,
                updateUserId: null,
            },
            {
                addTime: "2022-12-16T14:49:13.000+0000",
                addUserId: 9,
                cardName: "问心卡图片sRGB大版本-32",
                category: 0,
                deleted: 0,
                id: 336,
                imgUrl: "https://file.wxdao.net/2022-12/dbacdbb6-3751-488d-b459-7b2646b9fc71.jpg",
                status: 2,
                updateTime: null,
                updateUserId: null,
            },
            {
                addTime: "2022-12-16T14:49:13.000+0000",
                addUserId: 9,
                cardName: "问心卡图片sRGB大版本-32",
                category: 0,
                deleted: 0,
                id: 336,
                imgUrl: "https://file.wxdao.net/2022-12/dbacdbb6-3751-488d-b459-7b2646b9fc71.jpg",
                status: 2,
                updateTime: null,
                updateUserId: null,
            },
        ]

        let that = this;
        var contentsArray = this.data.contentsArray
        var activeIndex = this.data.activeIndex
        var index = e.currentTarget.dataset.index

        // if (contentsArray[activeIndex][index].cards.length === 0) {
        //     contentsArray[activeIndex][index].cardIndex = 0
        // }
        // contentsArray[activeIndex][index].cardGroup.push(data)
        // contentsArray[activeIndex][index].cardGroupIndex = contentsArray[activeIndex][index].cardGroup.length - 1
        // contentsArray[activeIndex][index].cards = data;
        // contentsArray[activeIndex][index].showCards = true;
        // contentsArray[activeIndex][index].imgUrl = contentsArray[activeIndex][index].cards[index].imgUrl;
        //
        // that.setData({
        //     contentsArray: contentsArray
        // })


        getChangeCard(that.data.types).then(res => {
            if (res.data.ret == 200) {
                var data = res.data.data
                if (contentsArray[activeIndex][index].cards.length === 0) {
                    contentsArray[activeIndex][index].cardIndex = 0
                }
                contentsArray[activeIndex][index].cardGroup.push(data)
                contentsArray[activeIndex][index].cardGroupIndex = contentsArray[activeIndex][index].cardGroup.length - 1
                contentsArray[activeIndex][index].cards = data;
                contentsArray[activeIndex][index].showCards = true;
                contentsArray[activeIndex][index].imgUrl = contentsArray[activeIndex][index].cards[index].imgUrl;

                that.setData({
                    contentsArray: contentsArray
                })

                console.log(this.data.contentsArray)
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
        })
    },
    bindTextVal (e) {
        var arr = this.data.contentsArray;
        arr[this.data.activeIndex][e.currentTarget.dataset.iid]['txt'] = e.detail.value
        this.setData({
            contentsArray: arr
        })
    },
    // 查询当天签到人数
    dayForSignNumber () {
        dayForSignNumber().then(res => {
            this.setData({
                signNum: res.data.data.number || 0,
                nowDate2: res.data.data.chinese
            })
        })
    },
    // 查询本人连续签到次数
    findByIsFlagNumber () {
    },
    showCard (e) {
        let show = this.data.cardShow
        this.setData({
            cardShow: !show
        })
    },
    // 录音
    start: function (e) {
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
            success () {
                //第一次成功授权后 状态切换为2
                var arr = that.data.contentsArray;
                arr[that.data.activeIndex][e.currentTarget.dataset.iid]['autioStatus'] = 2
                arr[that.data.activeIndex][e.currentTarget.dataset.iid]['startTime'] = e.timeStamp
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
            fail () {
                console.log("第一次录音授权失败");
                wx.showModal({
                    title: '提示',
                    content: '您未授权录音，功能将无法使用',
                    showCancel: true,
                    confirmText: "授权",
                    confirmColor: "#52a2d8",
                    success: function (res) {
                        if (res.confirm) {
                            //确认则打开设置页面（重点）
                            wx.openSetting({
                                success: (res) => {
                                    if (!res.authSetting['scope.record']) {
                                        //未设置录音授权
                                        console.log("未设置录音授权");
                                        wx.showModal({
                                            title: '提示',
                                            content: '您未授权录音，功能将无法使用',
                                            showCancel: false,
                                            success: function (res) {

                                            },
                                        })
                                    } else {
                                        var arr = that.data.contentsArray;
                                        arr[that.data.activeIndex][e.currentTarget.dataset.iid]['autioStatus'] = 2
                                        that.setData({
                                            contentsArray: arr
                                        })

                                        recorderManager.start(options);
                                        recorderManager.onStart(() => {
                                        });
                                        //错误回调
                                        recorderManager.onError((res) => {
                                        })
                                    }
                                },
                                fail: function () {
                                }
                            })
                        } else if (res.cancel) {
                        }
                    },
                    fail: function () {
                    }
                })
            }
        })
    },
    //暂停录音
    pause: function (e) {
        var that = this;
        recorderManager.pause();
        recorderManager.onPause((res) => {
            console.log(res);
            var arr = that.data.contentsArray;
            arr[that.data.activeIndex][e.currentTarget.dataset.iid]['autioStatus'] = 3
            arr[that.data.activeIndex][e.currentTarget.dataset.iid]['tempFilePath'] = res.tempFilePath
            that.setData({
                contentsArray: arr
            })
            console.log('暂停录音')

        })
    },
    //继续录音
    resume: function () {
        recorderManager.resume();
        recorderManager.onStart(() => {
        });
        //错误回调
        recorderManager.onError((res) => {
        })
    },
    //停止录音
    stop: function (e) {
        var that = this;
        recorderManager.stop();
        recorderManager.onStop((res) => {
            var arr = that.data.contentsArray;
            arr[that.data.activeIndex][e.currentTarget.dataset.iid]['autioStatus'] = 3
            arr[that.data.activeIndex][e.currentTarget.dataset.iid]['tempFilePath'] = res.tempFilePath
            arr[that.data.activeIndex][e.currentTarget.dataset.iid]['endTime'] = e.timeStamp
            arr[that.data.activeIndex][e.currentTarget.dataset.iid]['times'] =
                Math.ceil((arr[that.data.activeIndex][e.currentTarget.dataset.iid]['endTime'] - arr[that.data.activeIndex][e.currentTarget.dataset.iid]['startTime']) / 1000)
            that.setData({
                contentsArray: arr
            })
            const {
                tempFilePath
            } = res
        })
    },
    //播放声音
    play: function (e) {
        innerAudioContext.autoplay = true

        innerAudioContext.src = this.data.contentsArray[this.data.activeIndex][e.currentTarget.dataset.iid].tempFilePath,
            innerAudioContext.onPlay(() => {
            })
        innerAudioContext.onError((res) => {
        })
    },
    closeAudio (e) {
        var arr = this.data.contentsArray;
        arr[this.data.activeIndex][e.currentTarget.dataset.iid]['putType'] = 1
        arr[this.data.activeIndex][e.currentTarget.dataset.iid]['tempFilePath'] = ''
        arr[this.data.activeIndex][e.currentTarget.dataset.iid]['autioStatus'] = 1
        arr[this.data.activeIndex][e.currentTarget.dataset.iid]['voice'] = ''
        this.setData({
            contentsArray: arr
        })
        this.guanBiVoice()
        this.setData({
            isPlay: true
        })
    },
    saveAudio (e) {
        var that = this
        recorderManager.stop();
        wx.uploadFile({
            url: config.getDomain + '/oss/upload/uploadFile',
            filePath: that.data.contentsArray[that.data.activeIndex][e.currentTarget.dataset.iid].tempFilePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data',
                'token': wx.getStorageSync('tokenKey') || ''
            },
            success (res) {
                var arr = that.data.contentsArray;
                arr[that.data.activeIndex][e.currentTarget.dataset.iid]['autioStatus'] = 0
                arr[that.data.activeIndex][e.currentTarget.dataset.iid]['putType'] = 5
                arr[that.data.activeIndex][e.currentTarget.dataset.iid]['tempFilePath'] = ''
                arr[that.data.activeIndex][e.currentTarget.dataset.iid]['audioStr'] = JSON.parse(res.data).data
                arr[that.data.activeIndex][e.currentTarget.dataset.iid]['voice'] = JSON.parse(res.data).data
                that.setData({
                    contentsArray: arr
                })
                audioCtx.src = JSON.parse(res.data).data;
            }
        })
    },
    playAudio (e) {
        console.log(e.currentTarget.dataset.type);
        let ind = e.currentTarget.dataset.type;
        let vioces = this.data.contentsArray[this.data.activeIndex][ind]?.voice || '';
        audioCtx.src = vioces
        if (this.data.isPlay) {
            audioCtx.pause()
            this.setData({
                isPlay: false
            })
        } else {
            audioCtx.play()
            this.setData({
                isPlay: true
            })
        }
    },
    findMyFmForDay () {
        console.log(this.data.contentsArray, 'this.data.contentsArray');
        findMyFmForDay({ types: this.data.types }).then(res => {
            console.log(res.data.data, 'res.data.data');
            if (!!res.data.data) {
                let arr = this.data.contentsArray
                res.data.data.contents = JSON.parse(res.data.data.contents);
                arr[this.data.activeIndex] = res.data.data.contents
                // submitFmData.contents = cards
                console.log(res.data.data, 'res.data');
                this.setData({
                    isEditFm: false,
                    submitFmData: res.data.data.contents,
                    contentsArray: arr,
                    isOpen: res.data.data.isOpen,
                    shareId: res.data.data.id
                })
            } else {
                this.setData({
                    isEditFm: true,
                    isOpen: 1,
                    isEditFmChange: false
                })
            }
        })
    },
    changeFm () {
        this.setData({
            isEditFm: true,
            isEditFmChange: true
        })
    },
    shareFm () {
        wx.navigateTo({
            url: '/02meiritiaopin/share/share?id=' + this.data.shareId,
        })
    },
    guanBiVoice () {
        audioCtx.pause();
        audioCtx.src = null;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        let that = this
        this.initData()
        this.findMyFmForDay()
        audioCtx.onPlay(() => {
            console.log('kaishi ');
            that.setData({ isPlay: true })
        })
        audioCtx.onEnded(() => {
            console.log('jieshu ');
            that.setData({ isPlay: false })
            console.log();
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {

    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {

    }
})
