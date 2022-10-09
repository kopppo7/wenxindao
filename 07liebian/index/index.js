// 07liebian/index/index.js
Page({
    data: {
        welfareState:false
    },
    welfarePop:function(){
        var that = this;
        that.setData({
            welfareState:true
        })
    },
    closePop: function(){
        var that = this;
        that.setData({
            welfareState:false
        })
    },
})