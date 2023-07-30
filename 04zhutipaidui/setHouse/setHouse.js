// 04zhutipaidui/setHouse/setHouse.js
import {
    findByAskPartyOne,
    updateImMsg,
    roomMatchingPlay,
    createBaoRoom
} from "../api";
import config from "../../utils/config";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        useMes: {},
        isShow: false,
        themeId:'',
        detailObj:{},
        roomId:'',
        isMatch:'',
        isfriend:''
    },
    //上传本地图片
    radioChange(e) {
        console.log(e.detail.value);
        if (e.detail.value == 1) {
          this.setData({
            isShow:false
          })
        }else{
          this.setData({
            isShow:true
          })
        }
    },
    uploadImg: function(e) {
        if (this.data.isShow) {
            var that = this
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed', 'original'],
                sourceType: ['album', 'camera'],
                success(res) {
                    var tempFilePaths = res.tempFilePaths
                    for (var i = 0; i < tempFilePaths.length; i++) {
                        wx.uploadFile({
                            filePath: tempFilePaths[i],
                            url: config.getDomain + '/oss/upload/uploadFile',
                            name: 'file',
                            header: {
                                'Content-Type': 'multipart/form-data',
                                'token': wx.getStorageSync('tokenKey') || ''
                            },
                            success: function(res) {
                                console.log(JSON.parse(res.data));
                                that.setData({
                                    'useMes.headImg': JSON.parse(res.data).data
                                })
                            }
                        })
                    }
                }
            })
        }
    },
    formSubmit(e) {
        let val = e.detail.value
        if (val.checkbox[0] == '1') {
          if (val.radio == '0') {
            if (!val.input) {
              wx.showToast({
                title: '请输入临时昵称',
                icon: 'none',
                duration: 1500
            })
            }else{
              let param = {
                  head: this.data.useMes.headImg,
                  nickname: val.input
              }
              updateImMsg(param).then(res => {
                this.matchGame();
              })
            }
          } else {
            this.matchGame();
          }
        } else {
            wx.showToast({
                title: '请选择遵守玩家规则',
                icon: 'none',
                duration: 1500
            })
        }
    },

    getRoomDet:function () {
        findByAskPartyOne({ id: this.data.themeId }).then(res => {
            let obj = res.data.data;
            obj.tips = obj.tips.split(' ');
            console.log(obj);
            let richText1 = obj.detailsText
            let richText2 = obj.flowText
            obj.detailsText = richText1
                .replace(/\<img/gi, '<img style="width:100%;height:auto;"')
                .replace(/\<p/gi, '<p class="p_class"')
                .replace(/\<span/gi, '<span class="span_class"')
            obj.flowText = richText2
                .replace(/\<img/gi, '<img style="width:100%;height:auto;"')
                .replace(/\<p/gi, '<p class="p_class"')
                .replace(/\<span/gi, '<span class="span_class"')
            this.setData({
                detailObj: obj
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(wx.getStorageSync('loginInfo'));
        if (wx.getStorageSync('loginInfo')) {
            this.setData({
                useMes: wx.getStorageSync('loginInfo')
            })
        }
        this.setData({
            themeId: options.id,
            roomId:options.roomId,
            isMatch:options.isMatch,
            isfriend:options.isfriend,
        })
        this.getRoomDet()
    },
    matchGame(){
      wx.showLoading({
        title: '匹配中...',
      });
      let startTimespan = new Date().valueOf();

      roomMatchingPlay(this.data.themeId).then(res=>{
        let endTimespan = new Date().valueOf();
        if(endTimespan-startTimespan>10000){
          wx.hideLoading({
            success: (s) => {
              wx.redirectTo({
                url: '/04zhutipaidui/tansuo/tansuo?askId='+this.data.themeId+'&roomId='+res.data.data+'&isMatch='+this.data.isMatch+'&isfriend='+this.data.isfriend,
              })
            },
          })
        }else{
          setTimeout(() => {
            wx.hideLoading({
              success: (s) => {
                wx.redirectTo({
                  url: '/04zhutipaidui/tansuo/tansuo?askId='+this.data.themeId+'&roomId='+res.data.data+'&isMatch='+this.data.isMatch+'&isfriend='+this.data.isfriend,
                })
              },
            })
          }, endTimespan-startTimespan);
        }
      })
    //   wx.redirectTo({
    //     url: '/04zhutipaidui/tansuo/tansuo?askId='+this.data.themeId+'&roomId='+this.data.roomId+'&isMatch='+this.data.isMatch+'&isfriend='+this.data.isfriend,
    // })
    }
})
