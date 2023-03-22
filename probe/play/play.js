// 03shenmingtansuo/tansuo/tansuo.js
import {
  getProExpDetail,
  submitContent,
  cardRandom
} from '../../utils/api'
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
import {
  getLoginInfo
} from "../../utils/stoage"
var recodingTimeout = null
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const audioCtx = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 需要循环的数据

    sharePopStatus: false,
    step: 0,
    stepBg: 20,
    stepList: [],
    stepItem: {}, //当前显示的轮次的信息
    id: '',
    probeId: '',
    selectCard: '', // 选中的卡片 人物
    selectMasterIndex:0,//选中的answer
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
    randomCard: [], //每一轮随机的卡牌池
    randomCardIndex: 0, //卡牌池选择序号
    activity: '', // 结束语
    selectImgUrl: '', // 选中的图片地址
    recodingTime: 300000,
    canClickCard: true,
    curStep: 0,
    isMine: true
  },
  // 放大看卡片
  showImg(e) {
    this.setData({
      bigPopStatus: true,
      selectImgUrl: e.currentTarget.dataset.img
    })
  },
  closeImgPop(e) {
    this.setData({
      bigPopStatus: false
    })
  },
  openSharePop() {
    wx.redirectTo({
      url: '/probe/share/share?id=' + this.data.id,
    })

  },
  closePop() {
    let that = this;
    that.setData({
      sharePopStatus: false
    })
  },
  // 语音输入相关
  // 检查文档是否合规
  inspectText(e) {
    let list = this.data.list
    let idx = e.target.dataset.idx
    list[idx].contents.txt = e.detail.value
    this.setData({
      list: list
    })
    return
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
    let list = this.data.list
    let idx = e.target.dataset.idx
    list[idx].putType = e.currentTarget.dataset.type
    this.setData({
      list: list
    })
  },
  // 录音
  start(e) {
    console.log('开始录音开始录音开始录音', e)
    let that = this
    // this.setData({
    //   startTime: e.timeStamp, // 开始录音时间
    // })

    let list = this.data.list
    let idx = e.currentTarget.dataset.idx
    list[idx].startTime = e.timeStamp
    this.setData({
      list: list
    })

    const options = {
      duration: 300000, //指定录音的时长，单位 ms
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
        that.recodingCountDown()
        //第一次成功授权后 状态切换为2
        list[idx].autioStatus = 2
        that.setData({
          list: list
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
                    // that.setData({
                    //   autioStatus: 2,
                    // })
                    list[idx].autioStatus = 2
                    that.setData({
                      list: list
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
  //录音倒计时
  recodingCountDown: function () {
    var recodingTime = this.data.recodingTime
    var that = this;
    if (recodingTime > 0) {
      recodingTimeout = setTimeout(function () {
        that.setData({
          recodingTime: recodingTime - 1000
        })
        that.recodingCountDown()
      }, 1000)
    }
  },
  //暂停录音
  // pause() {
  //   let that = this;
  //   recorderManager.pause();
  //   recorderManager.onPause((res) => {
  //     console.log(res);
  //     that.setData({
  //       autioStatus: 3,
  //       tempFilePath: res.tempFilePath
  //     })
  //     console.log('暂停录音')

  //   })
  // },
  //继续录音
  // resume() {
  //   recorderManager.resume();
  //   recorderManager.onStart(() => {
  //     console.log('重新开始录音')
  //   });
  //   //错误回调
  //   recorderManager.onError((res) => {
  //     console.log(res);
  //   })
  // },
  //停止录音
  stop(e) {
    let list = this.data.list
    let idx = e.currentTarget.dataset.idx
    list[idx].endTime = e.timeStamp
    this.setData({
      list: list
    })
    console.log('停止录音停止录音', e)
    // this.setData({
    //   endTime: e.timeStamp, // 结束录音时间
    // })
    this.setData({
      recodingTime: 300000
    })
    clearTimeout(recodingTimeout)
    let that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      list[idx].autioStatus = 3
      list[idx].tempFilePath = res.tempFilePath
      list[idx].totalTime = Math.ceil((list[idx].endTime - list[idx].startTime) / 1000)
      that.setData({
        tempFilePath: res.tempFilePath,
        list: list
      })
      // that.setData({
      //   autioStatus: 3,
      //   tempFilePath: res.tempFilePath,
      //   totalTime: Math.ceil((this.data.endTime - this.data.startTime) / 1000)
      // })
      console.log('停止录音', res.tempFilePath)
      that.setData({
        recodingTime: 300000
      })
      clearTimeout(recodingTimeout)
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
  closeAudio(e) {
    let list = this.data.list
    let idx = e.currentTarget.dataset.idx
    list[idx].autioStatus = 1
    list[idx].putType = 1
    list[idx].tempFilePath = ''
    this.setData({
      list: list,
      tempFilePath: '',
    })
  },
  // 保存语音
  saveAudio(e) {
    let that = this
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
        let list = that.data.list
        let idx = e.currentTarget.dataset.idx
        list[idx].autioStatus = 0
        list[idx].putType = 5
        list[idx].audioStr = JSON.parse(res.data).data
        list[idx].contents.voice = JSON.parse(res.data).data
        that.setData({
          list: list,
          tempFilePath: '',
          // audioStr: JSON.parse(res.data).data,
          // 'contents.voice': JSON.parse(res.data).data,
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
  // 切换图片
  changeImg(e) {
    let idxp = e.currentTarget.dataset.idxp
    let idx = e.currentTarget.dataset.idx
    let list = this.data.list
    list[idxp].randomCardIndex = idx
    this.setData({
      // randomCardIndex: e.currentTarget.dataset.idx,
      list: list
    })
  },
  // 切换卡片
  changeCard(e) {
    let list = this.data.list
    if (e.currentTarget.dataset.item == 1) {
      list[e.currentTarget.dataset.idx].selectCard = ''
      this.setData({
        list: list,
        isMine: true,
        selectMasterIndex:0
      })
    } else {
      list[e.currentTarget.dataset.idx].selectCard = e.currentTarget.dataset.item
      this.setData({
        list: list,
        isMine: false,
        selectMasterIndex:e.currentTarget.dataset.index
      })
      console.log(this.data.selectMasterIndex)
    }
  },
  // 返回我的探索
  backMine(e) {
    let list = this.data.list
    list[e.currentTarget.dataset.idx].selectCard = ''
    this.setData({
      list,
      isMine: true
    })
  },
  // 下一步
  nextStep(e) {
    if (this.data.step > 0 && this.data.step < this.data.stepList.length + 2) {
      //step>0<最后一个为循环
      //需要判断是否填写内容
      let list = this.data.list
      if (!list[e.currentTarget.dataset.idx].contents.txt && !list[e.currentTarget.dataset.idx].contents.voice) {
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
      let cards = [];
      for (var i = 0; i < list[e.currentTarget.dataset.idx].randomCard.length; i++) {
        cards.push({
          cardId: list[e.currentTarget.dataset.idx].randomCard[i].id,
          imgUrl: list[e.currentTarget.dataset.idx].randomCard[i].imgUrl,
          detailsId: this.data.stepList[this.data.step - 1].id,
          userProbeId: this.data.id,
          isCheck: list[e.currentTarget.dataset.idx].randomCardIndex == i ? 1 : 0
        });
      }
      submitContent({
        answerText: list[e.currentTarget.dataset.idx].contents.txt,
        answerVoice: list[e.currentTarget.dataset.idx].contents.voice,
        // cardId: list[e.currentTarget.dataset.idx].randomCard[list[e.currentTarget.dataset.idx].randomCardIndex].id,
        cardId: list[e.currentTarget.dataset.idx].randomCard[0].id,
        id: list[e.currentTarget.dataset.idx].id,
        // imgUrl: list[e.currentTarget.dataset.idx].randomCard[list[e.currentTarget.dataset.idx].randomCardIndex].imgUrl,
        imgUrl: list[e.currentTarget.dataset.idx].randomCard[0].imgUrl,
        userProbeId: this.data.id,
        cards: cards,
        answerVoiceTime: list[e.currentTarget.dataset.idx].totalTime,
      }).then((res) => {
        wx.hideLoading()
      })
    }
    //引导-最后一轮，进入下一轮的时候需要更新下一轮的内容到stepItem，并且获取3张卡牌
    if (this.data.step < this.data.stepList.length) {
      let sItem = this.data.stepList[this.data.step];
      let answers = []
      for (let j = 0; j < sItem.answers.length && j < this.data.robot.length; j++) {
        let answerItem = sItem.answers[j];
        answerItem.headImg = this.data.robot[j];
        answers.push(answerItem);
      }
      sItem.answers = answers;
      // this.setData({
      //   stepItem: sItem
      // });
      cardRandom({
        id: this.data.probeId,
        cardNum: sItem.cardNum
      }).then(res => {
        let arr = this.data.list
        for (let k = 0; k < arr.length; k++) {
          if (this.data.step == k) {
            arr[k].randomCard = res.data.data
            arr[k].randomCardIndex = 0
            // arr[k].stepItem = sItem
            break
          }
        }
        this.setData({
          list: arr,
          step: Number(this.data.step) + 1,
          curStep: Number(this.data.step) + 1,
          // randomCard:res.data.data,
          // randomCardIndex:0
        })
      });
    } else {
      this.setData({
        step: Number(this.data.step) + 1
      });
    }
  },
  // 切换第几部
  changeStep(e) {
    if (e.target.dataset.idx <= this.data.curStep) {
      this.setData({
        step: e.target.dataset.idx,
      })
    }

  },
  // 获取详情
  getDetail(id) {
    getProExpDetail({
      id: id
    }).then((res) => {
      wx.setNavigationBarTitle({
        title: res.data.data.title,
      })
      if (res.data.data.activity) {
        res.data.data.activity = res.data.data.activity.replace(/style/g, 'data').replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
          .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="max-width: 100%;height:auto" $1');
      }
      this.setData({
        stepList: res.data.data.details,
        step: res.data.data.current,
        activity: res.data.data.tags,
        stepBg: Math.floor(100 / (res.data.data.details.length + 2)),
        probeId: res.data.data.probeId,
        list: [],
        probeTitle:res.data.data.title,
        probeShareImg:res.data.data.shareImgUrl
      })
      let arr = res.data.data.details
      for (let i = 0; i < arr.length; i++) {
        arr[i].cards.map(item => {
          item.isOpen = false
          item.isOpened = false
        })
        arr[i].randomCard = arr[i].cards
        arr[i].randomCardIndex = 0
        arr[i].cards.map((item, index) => {
          if (item.cardId == arr[i].cardId) {
            arr[i].randomCardIndex = index
          }
        })
        // arr[i].stepItem = ''
        if (arr[i].answerVoice) {
          arr[i].putType = 5
        } else {
          arr[i].putType = 1
        }
        // arr[i].putType = arr[i].answerText ? 1 : 5
        arr[i].contents = {
          txt: arr[i].answerText ? arr[i].answerText : '',
          voice: arr[i].answerVoice ? arr[i].answerVoice : ''
        }
        arr[i].autioStatus = 1
        arr[i].tempFilePath = arr[i].answerVoice ? arr[i].answerVoice : ''
        arr[i].audioStr = ''
        arr[i].isPlay = false
        arr[i].startTime = 0
        arr[i].endTime = 0
        arr[i].totalTime = arr[i].answerVoiceTime ? arr[i].answerVoiceTime : 0
      }
      //答到第几轮了
      var step = 0
      arr.map((item, index) => {
        if (item.imgUrl) {
          step = index + 1
          let answers = []
          for (let j = 0; j < item.answers.length && j < this.data.robot.length; j++) {
            let answerItem = item.answers[j];
            answerItem.headImg = this.data.robot[j];
            answers.push(answerItem);
          }
          item.answers = answers;
        }
      })
      this.setData({
        step: step,
        curStep: step,
        list: arr
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
  lookLog() {
    wx.redirectTo({
      url: '/pages/my/probedetail/probedetail?id=' + this.data.id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
     return {
        title: this.data.probeTitle,
        path: '/probe/detail/detail?id='+this.data.probeId,
        imageUrl: this.data.probeShareImg
      }

  },

  //翻牌
  clickCard: function (e) {
    if (this.data.canClickCard) {
      this.setData({
        canClickCard: false
      })
      var listIndex = e.currentTarget.dataset.listindex
      var cardIndex = e.currentTarget.dataset.index * 1
      var list = this.data.list
      var randomCard = JSON.parse(JSON.stringify(list[listIndex].randomCard))
      //调换位置
      list[listIndex].randomCard[0] = randomCard[cardIndex]
      list[listIndex].randomCard[0].isOpen = true
      list[listIndex].randomCard[cardIndex] = randomCard[0]
      this.setData({
        list: list
      })
      var that = this;
      setTimeout(function () {
        list[listIndex].randomCard[0].isOpened = true
        that.setData({
          list: list,
          canClickCard: true
        })
      }, 1000)
    }

  },
  masterCilckCard:function(e){
    if (this.data.canClickCard) {
      this.setData({
        canClickCard: false
      })
      var listIndex = e.currentTarget.dataset.listindex
      var cardIndex = e.currentTarget.dataset.index * 1
      var list = this.data.list
      var cards = JSON.parse(JSON.stringify(list[listIndex].answers[this.data.selectMasterIndex].cards))
      //调换位置
      list[listIndex].answers[this.data.selectMasterIndex].cards[0] = cards[cardIndex]
      list[listIndex].answers[this.data.selectMasterIndex].cards[0].isOpen = true
      list[listIndex].answers[this.data.selectMasterIndex].cards[cardIndex] = cards[0]
      this.setData({
        list: list
      })
      var that = this;
      setTimeout(function () {
        list[listIndex].answers[that.data.selectMasterIndex].cards[0].isOpened = true
        that.setData({
          list: list,
          canClickCard: true
        })
      }, 1000)
    }
  }
})
