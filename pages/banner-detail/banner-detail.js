// pages/banner-detail/banner-detail.js
const Http = require('../../utils/request.js');
const app = getApp();
var WxParse = require('../../components/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    if (options.id == 1) {
      
    } else {
      this.setData({
        isShow: false
      })
    }
    this.getBanner(options.id)
  },
  getBanner(id) {
    let that = this
    Http.HttpRequst(true, '/idx/clickBanner?id=' + id, false, '', '', 'POST', false, function (res) {

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goClass:function() {
    wx.switchTab({
      url: '/pages/class/class',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})