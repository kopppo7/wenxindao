import { login } from '../../../../utils/common'
import {
  getHelpTypeList,
  addFeedback
} from "../../../../utils/api";
import config from '../../../../utils/config.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      allTitle: [],
      currentIndex: 0,
      uploadImgs:[],
      showPrivew:false,
      tapImgIndex:0
    },
    Init(){
      getHelpTypeList().then(res=>{
        this.setData({
          allTitle:res.data.data
        });
        getHelpList(res.data.data[0].id).then(list=>{
          this.setData({
            questionList:list.data.data
          })
        })
      })
    },
    //点击切换标题
    changeTitle(event) {
        let index = event.target.dataset.current;//当前点击标题的index
        this.setData({
            currentIndex: index
        })
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    },
    // 上传相关图片
    callGetPic: function () {
        let that = this;
        wx.chooseImage({
            count: 1, // 最多上传4张
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                let tempFilePaths = res.tempFilePaths;
                wx.showLoading({
                    title: '正在上传...',
                    mask: true
                });
                let token = wx.getStorageSync('tokenKey');
                wx.uploadFile({
                    url: config.getDomain + '/oss/upload/uploadFile',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    header: {"Content-Type": "multipart/form-data",'token':token},
                    formData: {
                        'file': 'file'
                    },
                    success(res) {
                      wx.hideLoading();
                      try{
                        var data = JSON.parse(res.data);
                        if(data.ret==200){
                          that.data.uploadImgs.push(data.data);
                          that.setData({
                            uploadImgs:that.data.uploadImgs
                          })
                        }
                      }catch{
                        wx.showToast({
                          title: data.msg,
                          icon:'none'
                        })
                      }
                    },
                    fail(){
                      wx.hideLoading();
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      login(res=>{
        this.Init();
      })
    },
    previewImg(e){
      let index = e.currentTarget.dataset.index;
      this.setData({
        tapImgIndex:index,
        showPrivew:true
      })
    },
    closePrivew(){
      this.setData({
        showPrivew:false
      })
    },
    privewChange(e){
      this.setData({
        tapImgIndex:e.detail.current
      })
    },
    deleteImg(e){
      let that = this;
      let img_arr = that.data.uploadImgs;
      let index = that.data.tapImgIndex;  //获取长按删除图片的index
      wx.showModal({
        title: '提示',
        content: '确定要删除此图片吗？',
        success(res) {
          if (res.confirm) {
            img_arr.splice(index, 1);
          } else if (res.cancel) {
            return false;
          }
          if(that.data.uploadImgs.length==0){
            that.setData({
              showPrivew:false
            })
          }
          that.setData({
            uploadImgs: img_arr,
            tapImgIndex:that.data.tapImgIndex-1
          });
        }
      })
    },
    formSubmit(e){
      if(!e.detail.value.contents){
        wx.showToast({
          title: '反馈内容不能为空',
          icon:"none"
        })
        return
      }
      if(!e.detail.value.phone){
        wx.showToast({
          title: '联系方式不能为空',
          icon:"none"
        })
        return
      }
      var imgUrl = ''
      if(this.data.uploadImgs.length>0){
        for(var i=0;i<this.data.uploadImgs.length;i++){
          imgUrl+=this.data.uploadImgs[i]+',';
        }
        imgUrl = imgUrl.splice(0,imgUrl.length-1);
      }
      var data = {
        phone:e.detail.value.phone,
        contents:e.detail.value.contents,
        imgUrl:imgUrl,
        type:this.data.allTitle[this.data.currentIndex].id
      }
      wx.showLoading({
        title: '反馈提交中...'
      })
      addFeedback(data).then(res=>{
        wx.hideLoading();
        wx.navigateBack();
      })
    }
})
