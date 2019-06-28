// pages/user/user.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    pageNumber: 1,
    pageSize: 10,
    profitDetail: [],
    hasmoreData: false,
    loaderMore: true,
    hiddenloading: false,
    countNumber: 0,
    totalAward: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMemberTotalDetail()
    this.getCountNumber()
    this.getTotalAward()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getUserInfo({
      success: res => {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        // that.data.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  getMemberTotalDetail(){
    let that = this
    let params = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
    }
    Http.HttpRequst(false, '/wallet/getMemberTotalAwardDetails', false, '', params, 'get', false, function (res) {
      console.log(res.data, '5555')
      if(res.state == 'ok') {
        if (res.data.list.length < that.data.pageSize) {
          that.setData({
            profitDetail: that.data.profitDetail.concat(res.data.list),
          })
          that.setData({
            hasmoreData: true,
            hiddenloading: false,
            loaderMore: false
          })
        } else {
          that.setData({
            profitDetail: that.data.profitDetail.concat(res.data.list),
          })
        }
      }
    })
  },
  //根据用户, 取得下级推荐用户数
  getCountNumber: function() {
    let that = this
    Http.HttpRequst(false, '/wallet/countNumber', false, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          countNumber: res.data
        })
      }
    })
  },
  //根据用户, 取得用户总收益之和
  getTotalAward: function() {
    let that = this
    Http.HttpRequst(false, '/wallet/getTotalAward', false, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          totalAward: res.data
        })
      }
    })
  },
  goStatistics() {
    wx.navigateTo({
      url: '/pages/total-revenue/revenue',
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底了');
    var that = this
    if (that.data.loaderMore) {
      that.setData({
        hasmoreData: false,
        hiddenloading: true,
      })
      setTimeout(function () {
        that.setData({
          pageNumber: parseInt(that.data.pageNumber + 1)
        })
        that.getMemberTotalDetail()
      }, 500)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})