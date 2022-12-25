import {
  login
} from '../../../utils/common'
import {
  findMyTrends,
  findMyUser,
  deleteMyUser
} from "../../../utils/api";
import {
  getLoginInfo
} from "../../../utils/stoage"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      headImg: '',
      wechatName: ''
    },
    page: 1,
    list: [],
    total: 0,
    tab: [{
        title: '全部',
        num: 0,
        type: '',
      },
      {
        title: '每日调频',
        num: '',
        type: '0',
      },
      {
        title: '生命探索',
        num: '',
        type: '2',
      },
      {
        title: '主题派对',
        num: '',
        type: '1'
      }
    ],
    seType: '',
    cur_tab: 0,
    showPop: false,
    delIdx: '',
    totalSum: '' // 头部的全部数量
  },
  // 显示弹窗
  openPop: function (e) {
    this.setData({
      showPop: true,
      delIdx: e.currentTarget.dataset.index
    })
  },
  // 隐藏弹窗
  closePop: function () {
    this.setData({
      showPop: false,
      delIdx: ''
    })
  },
  deleteItem() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          });
          deleteMyUser({
            type: that.data.list[that.data.delIdx].category,
            id: that.data.list[that.data.delIdx].id,
          }).then(res => {
            wx.hideLoading()
            that.closePop()
            that.getData()
            that.getTopData()
          }).catch(err => {
            wx.hideLoading()
          })
        } else if (res.cancel) {
          that.closePop()
        }
      }
    })
  },
  // 切换tab
  changeCurTab: function (e) {
    this.setData({
      cur_tab: e.currentTarget.dataset.index,
      seType: e.currentTarget.dataset.type,
    })
    this.getData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    login(res => {
      this.Init()
      this.getData();
      this.getTopData()
    })
  },
  Init() {
    var info = getLoginInfo();
    this.setData({
      userInfo: info
    });
  },
  getData() {
    // wx.showLoading({
    //   title: '加载中...',
    // });
    findMyTrends({
      page: this.data.page,
      pageSize: 20,
      type: this.data.seType
    }).then(res => {
      for (var i = 0; i < res.data.data.list.length; i++) {
        res.data.data.list[i].contents = JSON.parse(res.data.data.list[i].contents);
        if (res.data.data.list[i].category == 0) {
          res.data.data.list[i].contents.imgUrl = res.data.data.list[i].contents.data[0].imgUrl;
        }
      }
      if (this.data.page == 1) {
        this.data.list = res.data.data.list;
      } else {
        this.data.list.concat(res.data.data.list);
      }
      this.data.list.map((item) => {
        item.target = item.target ? item.target.split(',') : []
      })
      this.setData({
        list: this.data.list,
        total: res.data.data.total
      })
      wx.stopPullDownRefresh()
      // wx.hideLoading();
    }).catch(err => {
      wx.showToast({
        title: '网络异常，请稍后重试',
        icon: 'none'
      })
      wx.hideLoading();
    })
  },
  // 获取分类数据
  getTopData() {
    wx.showLoading({
      title: '加载中...',
    });
    findMyUser().then(res => {
      this.data.tab[1].num = res.data.data.afNum
      this.data.tab[2].num = res.data.data.probeNum
      this.data.tab[3].num = res.data.data.partyNum
      let afNum = res.data.data.afNum ? res.data.data.afNum : 0
      let probeNum = res.data.data.probeNum ? res.data.data.probeNum : 0
      let partyNum = res.data.data.partyNum ? res.data.data.partyNum : 0
      let totalSum = afNum + probeNum + partyNum
      this.setData({
        tab: this.data.tab,
        totalSum: totalSum
      })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      page: 1
    });
    this.getTopData()
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.list.length < this.data.total) {
      this.data.page += 1;
      this.getData();
    }
  },
  setting() {
    wx.navigateTo({
      url: '/pages/my/setting/setting',
    })
  },
  detail(e) {
    switch (e.currentTarget.dataset.type) {
      case '0':
        wx.navigateTo({
          url: '/pages/my/fmdetail/fmdetail?id=' + e.currentTarget.dataset.id,
        })
        break;
      case '1':
        break;
      case '2':
        wx.navigateTo({
          url: '/pages/my/probedetail/probedetail?id=' + e.currentTarget.dataset.id,
        })
        break;
    }
  }
})