// pages/balance/balance.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber:1,
    pageSize: 10,
    hasmoreData: false,
    loaderMore: true,
    hiddenloading: false,
    details: [],
    hasPhone: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWalletDetails()
    this.getMemberWalletAmount()
    this.getHasPhone() //判断是否有手机号吗
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //列表
  getWalletDetails: function () {
    let that = this
    var params = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }
    Http.HttpRequst(false, '/wallet/getWalletDetails', false, '', params, 'get', false, function (res) {
      if (res.state == 'ok') {
        if (res.data.list.length < that.data.pageSize) {
          that.setData({
            details: that.data.details.concat(res.data.list),
          })
          that.setData({
            hasmoreData: true,
            hiddenloading: false,
            loaderMore: false
          })
        } else {
          that.setData({
            details: that.data.details.concat(res.data.list),
          })
        }
      }
    })
  },
  getMemberWalletAmount: function () {
    let that = this
    Http.HttpRequst(false, '/wallet/getMemberWalletAmount', false, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          totalPrice: res.data
        })
      }
    })
  },
  getapplyCash() {//
    let that = this
    Http.HttpRequst(false, '/wallet/applyCash', false, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 1500,
        })
        that.getMemberWalletAmount()
      }else{
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  cash() {
    var that = this
    if (that.data.totalPrice == 0) {
      wx.showToast({
        title: '亲，余额为0，不能提现哦！',
        icon: 'none',
        duration: 1000
      })
       return false
    }
    wx.showModal({
      title: '提示',
      content: '确认要提现吗？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击主操作')
          that.getapplyCash()
        } else {
          console.log('用户点击辅助操作')
        }
      }
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
  // 判断用户是否有手机号 如果有责不授权获取手机号,没有则授权
  getHasPhone() {
    let that = this
    console.log('5555')
    Http.HttpRequst(true, '/login/hasPhone', false, '', '', 'get', false, function (res) {
      that.setData({
        hasPhone: res.data
      })
    })
  },
  /**
   * 获取手机号码服务端解密用户信息接口，获取手机号码
   */
  getPhoneNumber(e) {
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '未授权',
        icon: 'none',
        duration: 1000
      })
    } else {
      var params = {
        signature: app.globalData.userInfo.signature,
        rawData: app.globalData.userInfo.rawData,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      var that = this
      Http.HttpRequst(true, '/login/getPhoneNumber', false, '', params, 'get', false, function (res) {
        if (res.state == 'ok') {
          that.setData({
            hasPhone: true
          })
        }
      })
    }
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
        that.getWalletDetails()
      }, 500)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})