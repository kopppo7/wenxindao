import {
  findByFmOne
} from "../../../utils/api";

const audioCtx = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    showShare: false,
    bigPopStatus: false,
    bigCardImgUrl: ''
  },
  showShare() {
     this.setData({
      showShare: true
     })
  },
  closeShare() {
    this.setData({
     showShare: false
    })
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    findByFmOne(options.id).then(res => {
      let info = res.data.data;
      info.contents = JSON.parse(info.contents);
      if (info.types == 0) {
        info.cardUrl = info.contents[0].imgUrl;
      }
      this.setData({
        info: info
      })
    })
  },
  openBig(e) {
    this.setData({
      bigPopStatus: true,
      bigCardImgUrl: e.currentTarget.dataset.pinurl
    })
  },
  play(e) {
    audioCtx.pause()
    audioCtx.src = this.data.info.contents[e.currentTarget.dataset.idx].voice;
    let list = this.data.info.contents;
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
    });
    audioCtx.onStop(()=>{
        list[e.currentTarget.dataset.idx].playVoice = false
        this.setData({
            list: list
        })
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
  closePopBig(){
    this.setData({
      bigPopStatus: false,
      bigCardImgUrl: ''
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var shareObj = {
      path: 'pages/my/fmdetail/fmdetail?id=' + this.data.info.id, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: this.data.info.imgUrl, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      title: '问心岛'
    };
    return shareObj;
  },
    //分享朋友圈
    toShare:function () {
        wx.navigateTo({
            url: '/02meiritiaopin/share/share?id=' + this.data.info.id,
        })
    }
})
