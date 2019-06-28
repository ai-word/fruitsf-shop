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
    cartIds: '',
    activeIndex: '-1',
    finalamount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // if (options.cartIds) {
      this.getAllEnableCoupons(options.cartIds)
    // }
    // this.getAllEnableCoupons()
  },
  changeCoupon: function (e) {
    var that = this
    that.setData({
      activeIndex: e.currentTarget.dataset.index,
      finalamount: e.currentTarget.dataset.finalamount
    });
    app.globalData.finalamount = e.currentTarget.dataset.finalamount
    // wx.navigateBack({
    //   delta: 1
    // })
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
    app.globalData.finalamount = this.data.finalamount
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   *查看用户，当前订单可用的优惠券列表
  */
  getAllEnableCoupons(id) {
    let that = this
    Http.HttpRequst(false, '/coupon/useCouponList?cartIds=' + id, false, '', '', 'get', false, function (res) {
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
  // getCoupon(e) {
  //   let that = this
  //   let id = e.currentTarget.dataset.id
  //   let params = {
  //     couponId: id
  //   }
  //   Http.HttpRequst(false, '/coupon/getCoupon', false, '', params, 'get', false, function (res) {
  //     if (res.state == 'ok') {
  //       that.toastDialog.showDialog('领取成功!')
  //       that.getAllEnableCoupons()
  //     }
  //   })
  // },
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