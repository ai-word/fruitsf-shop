// pages/payment-code/code.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    qrcodeUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: res
        })
        // that.getUser(res)
      }
    })
    that.getMyCode()
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
  // getUser(res) {
  //   let that = this
  //   var params = {
  //     signature: res.signature,
  //     rawData: res.rawData,
  //     encryptedData: res.encryptedData,
  //     iv: res.iv
  //   }
  //   Http.HttpRequst(false, '/login/info', false, '', params, 'get', false, function (res) {
  //     if (res.state == 'ok') {
  //       console.log(res)
  //     }
  //   }) 
  // },
  getMyCode() {
    var uid = ''
    var that = this
    if (app.globalData.uid == '') {
      uid = wx.getStorageSync('uid')
    } else {
      uid = app.globalData.uid
    }
    var params = {
      page: 'pages/index/index',
      scene: uid
    }
    wx.request({
      url: app.globalData.baseUrl + '/login/getQrcode',
      method: 'get',
      responseType: 'arraybuffer',
      data: params,
      header: {
        'content-type': 'application/json',
        'wxa-sessionid': wx.getStorageSync('sessionkey')
      },
      success: function (res) {
        var base64 = wx.arrayBufferToBase64(res.data)
        that.setData({
          qrcodeUrl: 'data:image/png;base64,' + base64
        })
      }
    }) 
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