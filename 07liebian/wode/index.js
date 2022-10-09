// 07liebian/wode/index.js
Page({
    data: {
        switch1Checked: false,
        praiseState:false,
        turnState:false,
        playState:false,
        newPraiseState:false,
    },
    praiseBtn:function(){
        var that =this;
        that.setData({
            praiseState:true
        })
    },
    closePop:function(){
        var that =this;
        that.setData({
            praiseState:false
        })
    },
    turnBtn:function(){
        var that =this;
        that.setData({
            turnState:true
        }) 
    },
    closeWarn:function(){
        var that =this;
        that.setData({
            turnState:false,
        })
    },
    playBtn:function(){
        var that =this;
        that.setData({
            playState:true
        })
    },
    closePlay:function(){
        var that =this;
        that.setData({
            playState:false
        })
    },
    newPraiseBtn:function(){
        var that =this;
        that.setData({
            newPraiseState:true
        })
    },
    closeNewPraise:function(){
        var that =this;
        that.setData({
            newPraiseState:false
        })
    },
})