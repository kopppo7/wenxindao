// 03shenmingtansuo/tansuo/tansuo.js
import {
  getProExpDetail,
  submitContent,
  cardRandom
} from '../../../utils/api'
import {
  addFm,
  findByFmForUser,
  getDayCard,
  inspectText,
  dayForSignNumber,
  uploadFile
} from "../../../utils/fm";
import {
  formatTime,
} from "../../../utils/util";
import config from "../../../utils/config";
import {
  getLoginInfo
} from "../../../utils/stoage"
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const audioCtx = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharePopStatus: false,
    step: 0,
    stepBg: 20,
    stepList: [],
    stepItem: {}, //当前显示的轮次的信息
    id: '',
    probeId:'',
    selectCard: '', // 选中的卡片 人物
    userInfo: {}, // 个人信息

    // 录音相关
    bigPopStatus: false, // 放大卡牌
    putType: 1,
    content: [],
    contents: {
      txt: "",
      voice: ""
    },
    autioStatus: 1,
    tempFilePath: "",
    audioStr: "",
    isPlay: false,
    startTime: 0, // 开始录音时间
    endTime: 0, // 结束录音时间
    totalTime: 0,
    //人机头像地址，最多两个人机
    robot: ['https://wenxin-file.oss-cn-beijing.aliyuncs.com/system/images/avatar2.jpg', 'https://wenxin-file.oss-cn-beijing.aliyuncs.com/system/images/avatar3.jpg'],
    randomCard:[],//每一轮随机的卡牌池
    randomCardIndex:0,//卡牌池选择序号
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
      sharePopStatus: false
    })
  },
  // 语音输入相关
  // 检查文档是否合规
  inspectText(e) {
    let param = {
      text: e.detail.value
    }
    let that = this
    inspectText(param).then(res => {
      if (res.data.data == true) {
        that.setData({
          'contents.txt': e.detail.value
        })
        return
      } else {
        if (e.detail.value != '') {
          wx.showModal({
            title: '文字不合规，请重新输入',
          })
          that.setData({
            'contents.txt': ''
          })
        }
      }
    })
  },
  // 切换语音 文字输入
  changePutType(e) {
    console.log(this.data.putType);
    this.setData({
      putType: e.currentTarget.dataset.type
    })
  },
  // 录音
  start(e) {
    console.log('开始录音开始录音开始录音', e)
    var that = this
    this.setData({
      startTime: e.timeStamp, // 开始录音时间
    })
    const options = {
      duration: 60000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 2, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 500, //指定帧大小，单位 KB
    }
    //开始录音
    wx.authorize({
      scope: 'scope.record',
      success() {
        console.log("录音授权成功");
        //第一次成功授权后 状态切换为2
        that.setData({
          autioStatus: 2,
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
                  console.log(res.authSetting);
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
                    //第二次才成功授权
                    console.log("设置录音授权成功");
                    that.setData({
                      autioStatus: 2,
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
                fail: function () {
                  console.log("授权设置录音失败");
                }
              })
            } else if (res.cancel) {
              console.log("cancel");
            }
          },
          fail: function () {
            console.log("openfail");
          }
        })
      }
    })

  },
  //暂停录音
  pause() {
    var that = this;
    recorderManager.pause();
    recorderManager.onPause((res) => {
      console.log(res);
      that.setData({
        autioStatus: 3,
        tempFilePath: res.tempFilePath
      })
      console.log('暂停录音')

    })
  },
  //继续录音
  resume() {
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
  stop(e) {
    console.log('停止录音停止录音', e)
    this.setData({
      endTime: e.timeStamp, // 结束录音时间
    })
    var that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      that.setData({
        autioStatus: 3,
        tempFilePath: res.tempFilePath,
        totalTime: Math.ceil((this.data.endTime - this.data.startTime) / 1000)
      })
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res
    })
  },
  //播放声音
  play() {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.tempFilePath
    console.log('this.data.tempFilePath', this.data.tempFilePath)
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  // 关闭
  closeAudio() {
    this.setData({
      putType: 1,
      tempFilePath: '',
      autioStatus: 1
    })
  },
  // 保存语音
  saveAudio() {
    var that = this
    // recorderManager.stop();
    wx.uploadFile({
      url: config.getDomain + '/oss/upload/uploadFile',
      filePath: that.data.tempFilePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('tokenKey') || ''
      },
      success(res) {
        that.setData({
          autioStatus: 0,
          putType: 5,
          tempFilePath: '',
          audioStr: JSON.parse(res.data).data,
          'contents.voice': JSON.parse(res.data).data,
        })
        audioCtx.src = JSON.parse(res.data).data;
      }
    })
  },
  // 播放语音
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
  // 切换卡片
  changeCard(e) {
    console.log('e.target.dataset.item', e)
    if (e.currentTarget.dataset.item == 1) {
      this.setData({
        selectCard: ''
      })
    } else {
      this.setData({
        selectCard: e.currentTarget.dataset.item
      })
    }
  },
  // 下一步
  nextStep() {
    debugger;
    if(this.data.step>0&&this.data.step<this.data.stepList.length+2){
      //step>0<最后一个为循环
      //需要判断是否填写内容
      if (!this.data.contents.txt && !this.data.contents.voice) {
        wx.showToast({
          title: '请先录音或输入内容',
          icon: 'none',
          duration: 2000
        })
        return
      }
      wx.showLoading({
        title: '提交中',
        mask: true,
      })
      submitContent({
        answerText: this.data.contents.txt,
        answerVoice: this.data.contents.voice,
        cardId: '',
        id: this.data.stepList[e.currentTarget.dataset.idx - 1].id,
        imgUrl: '',
        userProbeId: this.data.id,
      }).then((res) => {
        wx.hideLoading()
        this.setData({
          step: this.data.step + 1,
          // 录音相关
          bigPopStatus: false, // 放大卡牌
          putType: 1,
          content: [],
          contents: {
            txt: "",
            voice: ""
          },
          autioStatus: 1,
          tempFilePath: "",
          audioStr: "",
          isPlay: false,
          startTime: 0, // 开始录音时间
          endTime: 0, // 结束录音时间
          totalTime: 0
        })
      })
    }
    //引导-最后一轮，进入下一轮的时候需要更新下一轮的内容到stepItem，并且获取3张卡牌
    if(this.data.step<this.data.stepList.length+1){
      var sItem = this.data.stepList[this.data.step];
      var answers = []
      for (var j = 0; j < sItem.answers.length && j < this.data.robot.length; j++) {
        var answerItem = sItem.answers[j];
        answerItem.headImg = this.data.robot[j];
        answers.push(answerItem);
      }
      sItem.answers = answers;
      this.setData({
        stepItem: sItem
      });
      cardRandom({
        id:this.data.probeId,
        cardNum:sItem.cardNum
      }).then(res=>{
        this.setData({
          randomCard:res.data.data,
          randomCardIndex:0
        })
      });
    }
    this.setData({
      step: this.data.step + 1
    });
  },
  // 切换第几部
  changeStep(e) {
    this.setData({
      step: e.target.dataset.idx,
    })
  },
  // 获取详情
  getDetail(id) {
    getProExpDetail({
      id: id
    }).then((res) => {
      this.setData({
        stepList: res.data.data.details,
        stepBg: Math.floor(100 / (res.data.data.details.length + 2)),
        probeId:res.data.data.probeId
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = getLoginInfo();
    this.setData({
      userInfo: info
    });
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getDetail(options.id)
    }

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
