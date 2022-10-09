// 05chouyichou/shili/shili.js
Page({
    data: {
        exampleStatus:false,
    },
    examplePop:function(){
        var that = this;
        that.setData({
            exampleStatus:true
        })
    },
    closePop:function(){
        var that = this;
        that.setData({
            exampleStatus:false
        })
    }
    
    
})