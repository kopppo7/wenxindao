// 07liebian/lingquzanmei/lingquzanmei.js
Page({
    data: {
        praiseState:false,
    },
    changePop:function(){
        var that = this;
        that.setData({
            praiseState:true
        })
    },
    closePop: function(){
        var that = this;
        that.setData({
            praiseState:false
        })
    },
})