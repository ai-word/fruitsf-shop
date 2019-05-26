// pages/order-payment/order-payment.js
const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payInfo: '',
    ordersn: '',
    goodDetail: '',
    showModal: false,
    commodity: 0,
    orderId: '',
    items: [
      {
        name: '礼品装',
        value: 0,
      },
      {
        name: '家庭装',
        value: 1
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //取消订单
  cancelOrder(e) {
    var that = this
    var orderId = e.currentTarget.dataset.orderid
    wx.showModal({
      title: '提示',
      content: '确认要取消该订单？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击主操作')
          that.getCanelOrder(orderId)
        } else {
          console.log('用户点击辅助操作')
        }
      }
    })
  },
  showPayModal() {
    this.setData({
      showModal: true
    })
  },
  hidePayToast() {
    this.setData({
      showModal: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.payInfo)
    this.setData({
      payInfo: app.globalData.payInfo
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