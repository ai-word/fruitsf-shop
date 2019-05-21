// pages/coupon/coupon.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: '',
    noData: false,
    activeIndex: '-1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllEnableCoupons()
  },
  changeCoupon: function (e) {
    var that = this
    that.setData({
      activeIndex: e.currentTarget.dataset.index,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.toastDialog = this.selectComponent("#toastDialog");
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
  submitOrder() {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
     *根据用户列出当前系统可以被领取的优惠券
     */
  getAllEnableCoupons(id) {
    let that = this
    Http.HttpRequst(false, '/coupon/useCouponList', false, '', '', 'get', false, function (res) {
      if (res.data.length == 0) {
        that.setData({
          noData: true,
        })
      } else {
        that.setData({
          couponList: res.data,
        })
      }

    })
  },
  getCoupon(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let params = {
      couponId: id
    }
    Http.HttpRequst(false, '/coupon/getCoupon', false, '', params, 'get', false, function (res) {
      if (res.state == 'ok') {
        that.toastDialog.showDialog('领取成功!')
        that.getAllEnableCoupons()
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

  }
})