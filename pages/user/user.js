// pages/user/user.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    couponNum: 0,
    available:0,
    enableamount:0,
    frozen: 0,
    cartNum1:0,
    cartNum2: 0,
    cartNum:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrdersNum1()
    this.getOrdersNum2()
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
    wx.hideShareMenu()
    var that = this
    this.getWalletInfo()
    this.getCouponNum()
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
  //获取优惠券数量
  getCouponNum() {
    var that = this
    Http.HttpRequst(false, '/coupon/countCouponsNum', true, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          couponNum: res.data.num
        })
      }
    })
  },
  goCode() {
    wx.navigateTo({
      url: '/pages/payment-code/code'
    })
  },
  getOrdersNum1() {
    var that = this
    Http.HttpRequst(false, '/order/getOrdersNum?status=2', true, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          cartNum1: res.data
        })
      }
    })
  },
  getOrdersNum2() {
    var that = this
    Http.HttpRequst(false, '/order/getOrdersNum?status=999', true, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          cartNum2: res.data
        })
      }
    })
  },
  wuliu() {
    wx.navigateTo({
      url: '/pages/logistics-info/logistics-info'
    })
  },
  myCoupon() {
    wx.navigateTo({
      url: '/pages/my-coupon/couponList/couponList'
    })
  },
  goBalance() {
    wx.navigateTo({
      url: '/pages/balance/balance'
    })
  },
  aboutUs() {
    wx.navigateTo({
      url: '/pages/about-us/about-us'
    })
  },
  //获取余额
  getWalletInfo() {
    var that = this
    Http.HttpRequst(false, '/wallet/getWalletInfo', true, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          frozen: res.data.freeze_money,
          enableamount:res.data.enableamount
        })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   
  },
  goAddRess() {
    wx.navigateTo({
      url: '/pages/address/address?user=1'
    })
  },
  cooperation() {
    wx.navigateTo({
      url: '/pages/cooperation/cooperation'
    })
  },
  coupon() {
    wx.navigateTo({
      url: '/pages/coupon/coupon'
    })
  },
  allOrder(e) {
    wx.navigateTo({
      url: '/pages/my-order/order?type=' + e.currentTarget.dataset.type + '&activeIndex=' + e.currentTarget.dataset.index +'&ordinary=1'
    })
  }
})