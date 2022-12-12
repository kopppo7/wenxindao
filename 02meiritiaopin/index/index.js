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
const audioCtx = wx.createInnerAudioContext();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isOpen: 1,
    playPopStatus: false,
    bigPopStatus: false,
    tabs: ['每日意图', '要事规划', '复盘'],
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
    types: 0, // 类型1每日调频,2每日事件,3复盘
    autioStatus: 1,
    tempFilePath: "",
    nowDate: null,
    nowDate2: "",
    audioStr: "",
    isPlay: false,
    contentsArray: [{
      txt: "",
      voice: "",
      putType: 1,
      autioStatus: 1,
      cardShow: false,
      tempFilePath: '',
      imgUrl:'',
      cards:[],
      showCards:false,
      cardIndex:0
    }],
    initContentsArray: [{
      txt: "",
      voice: "",
      putType: 1,
      autioStatus: 1,
      cardShow: false,
      tempFilePath: '',
    }]
  },
  initAudio() {
    this.setData({
      putType: 1,
      autioStatus: 1,
      cardShow: false,
      isOpen: 0
    })
  },
  addThing() {
    var arr = this.data.contentsArray;
    arr.push({
      txt: "",
      voice: "",
      putType: 1,
      autioStatus: 1,
      cardShow: false,
      tempFilePath: '',
      imgUrl:'',
      cards:[],
      showCards:false,
      cardIndex:0
    })
    this.setData({
      contentsArray: arr
    })
  },
  changePutType(e) {
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
      bigCardImgUrl:this.data.contentsArray[e.currentTarget.dataset.pindex].cards[e.currentTarget.dataset.index].imgUrl
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
    var that = this;
    if(that.data.types==2&&that.data.contentsArray.length>1){
      wx.showModal({
        title:'切换每日调频选项会移除第一条之后的事，是否确认切换',
        success:function (res) {
          let contentArr = that.data.contentsArray.splice(0,1);
          if(res.confirm){
            that.setData({
              activeIndex: e.currentTarget.dataset.ind,
              types: e.currentTarget.dataset.ind + 1,
              contentsArray:contentArr
            })
            
            that.initAudio()
          }
        }
      })
    }else{
      that.setData({
        activeIndex: e.currentTarget.dataset.ind,
        types: e.currentTarget.dataset.ind + 1
      })
      that.initAudio()
    }
  },
  changeCard(e) {
    this.data.contentsArray[e.currentTarget.dataset.pindex].cardIndex = e.currentTarget.dataset.ind
    this.data.contentsArray[e.currentTarget.dataset.pindex].imgUrl = this.data.contentsArray[e.currentTarget.dataset.pindex].cards[e.currentTarget.dataset.ind].imgUrl;
    this.setData({
      contentsArray: this.data.contentsArray
    })
  },
  initData() {
    this.setData({
      nowDate: formatTime(new Date())
    })
    // this.getDayCard()
    this.dayForSignNumber()
  },
  // 新增每日调频
  async addFm() {
    var isGoOn=true;
    for (var i = 0; i < this.data.contentsArray.length; i++) {
      await new Promise((resolve)=>{
        if(this.data.contentsArray[i].imgUrl==''){
          resolve({ret:false,msg:'请抽取一张卡牌'});
        }
        if (this.data.contentsArray[i].txt != '' || this.data.contentsArray[i].voice != '') {
          if (this.data.contentsArray[i].txt != '') {
            inspectText({
              text: this.data.contentsArray[i].txt
            }).then(res => {
              if (!res.data.data) {
                resolve({ret:false,msg:res.data.msg});
              }else{
                resolve({ret:true});
              }
            })
          }else{
            resolve({ret:true});
          }
        }else{
          resolve({ret:false,msg:'请输入一段语音或文字'});
        }
      }).then(res=>{
        if(!res.ret){
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
          isGoOn=false;
          return false;
        }
      })
    }
    if(!isGoOn){
      return false;
    }
    let params = {
      contents: JSON.stringify(this.data.contentsArray),
      types: this.data.types,
      isOpen:this.data.isOpen
    }
    var that = this;
    addFm(params).then(res => {
      if (res.data.data) {
        that.setData({
          contentsArray: that.data.initContentsArray
        })
        wx.navigateTo({
          url: '/02meiritiaopin/share/share?id=' + res.data.data,
        })
      }
    })
  },
  inspectText(txt){
    return new Promise((resole,reject)=>{//检查文档内容是否合规
      inspectText({
        text: txt
      }).then(res => {
        resole(res.data);
      })
    })
  },
  // 查询自己每日调频记录
  findByFmForUser() {},
  // 随机查询今日随机卡牌
  getDayCard(e) {
    let that = this;
    getDayCard().then(res => {
      if(this.data.contentsArray[e.currentTarget.dataset.index].cards.length=0){
        this.data.contentsArray[e.currentTarget.dataset.index].cardIndex=0
      }
      this.data.contentsArray[e.currentTarget.dataset.index].cards=res.data.data;
      this.data.contentsArray[e.currentTarget.dataset.index].showCards=true;
      this.data.contentsArray[e.currentTarget.dataset.index].imgUrl= this.data.contentsArray[e.currentTarget.dataset.index].cards[e.currentTarget.dataset.index].imgUrl
      that.setData({
        contentsArray:this.data.contentsArray
      })
    })
  },
  bindTextVal(e) {
    var arr = this.data.contentsArray;
    arr[e.currentTarget.dataset.iid]['txt'] = e.detail.value
    this.setData({
      contentsArray: arr
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
  showCard(e) {
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
      success() {
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
                    arr[e.currentTarget.dataset.iid]['autioStatus'] = 2
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
      arr[e.currentTarget.dataset.iid]['autioStatus'] = 3
      arr[e.currentTarget.dataset.iid]['tempFilePath'] = res.tempFilePath
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
      arr[e.currentTarget.dataset.iid]['autioStatus'] = 3
      arr[e.currentTarget.dataset.iid]['tempFilePath'] = res.tempFilePath
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

    innerAudioContext.src = this.data.contentsArray[e.currentTarget.dataset.iid].tempFilePath,
      innerAudioContext.onPlay(() => {
      })
    innerAudioContext.onError((res) => {
    })
  },
  closeAudio(e) {
    var arr = this.data.contentsArray;
    arr[e.currentTarget.dataset.iid]['putType'] = 1
    arr[e.currentTarget.dataset.iid]['tempFilePath'] = ''
    arr[e.currentTarget.dataset.iid]['autioStatus'] = 1
    this.setData({
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
        'token': wx.getStorageSync('tokenKey') || ''
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
        audioCtx.src = JSON.parse(res.data).data;
      }
    })
  },
  playAudio() {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})