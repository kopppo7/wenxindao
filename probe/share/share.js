// 02meiritiaopin/share/share.js
import {
    dayForSignNumber,
    findByIsFlagNumber,
    findByFmOne
} from "../../utils/fm";

import Wxml2Canvas from 'wxml2canvas'
import {login} from "../../utils/common";
import {getProEvaList, getProExpDetail} from "../../utils/api";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardTime: "",
        cardCount: 0,
        pageId: "",
        nowDate: {},
        content: {},
        imgUrl: "",
        width: "",
        height: "",
        share: {
            title: '',
            query: ''
        },
        headImg: '',
        userName:'',
        typeTit:'',
        txt1:'',
        txt2:'',

        probeId:'',
        det:{},
        evalList:[]
    },
    drawMyCanvas() {
        wx.showLoading()
        const that = this
        const query = wx.createSelectorQuery().in(this);
        query.select('#my-canvas').fields({ // 选择需要生成canvas的范围
            size: true,
            scrollOffset: true
        }, data => {
            let width = data.width + 56;
            let height = data.height;
            that.setData({
                width,
                height
            })
            setTimeout(() => {
                that.startDraw()
            }, 10);
        }).exec()
    },
    startDraw() {
        let that = this
        // 创建wxml2canvas对象
        let drawMyImage = new Wxml2Canvas({
            width: that.data.width,
            height: that.data.height,
            element: 'myCanvas', // canvas的id,
            background: 'transparent',
            borderRadius:'50rpx',
            obj: that, // 传入当前组件的this
            progress(percent) { // 进度
                // console.log(percent);
            },
            finish(url) { // 生成的图片
                wx.hideLoading()
                that.setData({
                    imgUrl: url
                })
            },
            error(res) { // 失败原因
                wx.hideLoading()
            }
        }, this);
        let data = {
            // 获取wxml数据
            list: [{
                type: 'wxml',
                class: '.my_canvas .my_draw_canvas', // my_canvas要绘制的wxml元素根类名， my_draw_canvas单个元素的类名（所有要绘制的单个元素都要添加该类名）
                limit: '.my_canvas', // 要绘制的wxml元素根类名
                x: 0,
                y: 0
            }]
        }
        // 绘制canvas
        drawMyImage.draw(data, this);
    },
    savePoster() {
        const that = this
        wx.saveImageToPhotosAlbum({
            filePath: that.data.imgUrl,
            success: function () {
                wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 1500
                });
            },
            fail(err) {
                if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                    wx.showModal({
                        title: '提示',
                        content: '需要您授权保存相册',
                        showCancel: false,
                        success: modalSuccess => {
                            wx.openSetting({
                                success(settingdata) {
                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                        wx.saveImageToPhotosAlbum({
                                            filePath: that.data.imgUrl,
                                            success: function () {
                                                wx.showToast({
                                                    title: '保存成功',
                                                    icon: 'success',
                                                    duration: 2000
                                                })
                                            },
                                        })
                                    } else {
                                        wx.showToast({
                                            title: '授权失败，请稍后重新获取',
                                            icon: 'none',
                                            duration: 1500
                                        });
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    share1() {
        wx.showShareImageMenu({
            path: this.data.imgUrl
        })
    },
    share2() {
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getDetail(options.id)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        var shareObj = {
            path: '02meiritiaopin/share/share?id=' + this.data.pageId, // 默认是当前页面，必须是以‘/’开头的完整路径
            imageUrl: this.data.cardImg, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            title: '问心岛'
        };
        return shareObj;
    },
    onShareTimeline() {
        var shareObj = {
            path: '02meiritiaopin/share/share?id=' + this.data.pageId, // 默认是当前页面，必须是以‘/’开头的完整路径
            imageUrl: this.data.cardImg, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            title: '问心岛'
        };
        return shareObj;
    },


    //生命探索详情
    getDetail(id) {
        getProExpDetail({
            id: id
        }).then((res) => {
            var data = res.data.data
            let nowDate = {
              month:res.data.data.endTime.substring(5, 7),
              day:res.data.data.endTime.substring(8, 10),
              year:res.data.data.endTime.substring(0, 4),
              chinese:res.data.data.chineseCalendar.split(' ')[1]
            }
            let tips = data.tips;
            if(tips&&tips.length>48){
              tips = tips.substring(0,48)+'...';
            }
            let userName = data.userName;
            if(userName&&userName.length>6){
              userName = userName.substring(0,6)+'...';
            }
            if(data.title&&data.title.length>15){
                data.title = data.title.substring(0,15);
              }
            this.setData({
                probeId:data.probeId,
                userName:userName,
                headImg:data.userHeadImg,
                nowDate:nowDate,
                det:{
                    imgUrl:data.imgUrl,
                    title:data.title,
                    introduce:tips,
                    miniImgUrl:data.miniImgUrl
                }
            })
            this.getEvaList()

        })
    },
    // 评价
    getEvaList() {
        getProEvaList({
            page: 1,
            pageSize: 20,
            id: this.data.probeId,
            category: 0, // 类型(0:生命探索,1:心灵对话)
        }).then((res) => {
            if (res.data.ret === 200){
                this.setData({
                    evalList:res.data.data.list
                })
                this.drawMyCanvas()
            }
        })
    },


})
