import {
  getProExpDetail
} from '../../../utils/api'
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const audioCtx = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 房间号
    time: '', // 添加时间
    list:[],
    showShare:false,
      bigPopStatus:false,
      bigCardImgUrl:''

  },

  openShare:function(){
    this.setData({
      showShare:true
    })
  },
  closePop:function () {
    this.setData({
      showShare:false
    })
  },
  //播放声音
  play(e) {
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = this.data.list[e.currentTarget.dataset.idx].answerVoice
    // console.log('this.data.list[e.currentTarget.dataset.idx].answerVoice', this.data.list[e.currentTarget.dataset.idx].answerVoice)
    // innerAudioContext.onPlay(() => {
    //   console.log('开始播放')
    // })
    // innerAudioContext.onError((res) => {
    //   console.log(res.errMsg)
    //   console.log(res.errCode)
    // })
    audioCtx.pause()
    audioCtx.src = this.data.list[e.currentTarget.dataset.idx].answerVoice
    let list = this.data.list
    list[e.currentTarget.dataset.idx].playVoice = !list[e.currentTarget.dataset.idx].playVoice
    if(list[e.currentTarget.dataset.idx].playVoice) {
        audioCtx.play()
    } else {
        audioCtx.pause()
    }
    audioCtx.onEnded(()=>{
        list[e.currentTarget.dataset.idx].playVoice = false
        this.setData({
            list: list
        })
        console.log("我已经是最后了")
    });
    audioCtx.onStop(()=>{
        list[e.currentTarget.dataset.idx].playVoice = false
        this.setData({
            list: list
        })
        console.log('我停止了');
    });

    list.map((item,index) => {
        if(index != e.currentTarget.dataset.idx) {
            item.playVoice = false
        }
    })
    this.setData({
        list: list
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getProExpDetail({
      id:options.id
    }).then(res=>{
        res.data.data.details.map((item) => {
            item.playVoice = false
        })
       this.setData({
        list: res.data.data.details,
        time: res.data.data.createTime,
        id: options.id
       })
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

    openBig(e) {
        this.setData({
            bigPopStatus: true,
            bigCardImgUrl: e.currentTarget.dataset.pinurl
        })
    },
    closePopBig() {
        this.setData({
            bigPopStatus: false,
            bigCardImgUrl: ''
        })
    },
})
