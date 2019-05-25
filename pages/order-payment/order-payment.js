// pages/order-payment/order-payment.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseSize: true,
    animationData: {},
    wxPayInfo: '',
    ordersn: '',
    goodDetail: '',
    showModal: false,
    commodity: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      ordersn: options.ordersn
    })
    this.getOrderDetail()
  },
  chooseSezi: function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(400).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  immediatePay() {
    this.chooseSezi()
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
  //取消订单
  getCanelOrder(orderId) {
    var that = this
    let params = {
      orderId: orderId
    }
    Http.HttpRequst(false, '/order/cancelOrder', true, '', params, 'post', false, function (res) {
      if (res.state == 'ok') {
        that.getOrderList()
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
  wxPayShop() {
    //支付方法
    console.log(this.data.wxPayInfo.payInfo)
    wx.requestPayment({
      timeStamp: this.data.wxPayInfo.payInfo.timeStamp,
      nonceStr: this.data.wxPayInfo.payInfo.nonceStr,
      package: this.data.wxPayInfo.payInfo.package,
      signType: 'MD5',
      paySign: this.data.wxPayInfo.payInfo.paySign,
      success(res) { 
        console.log('支付成功')
      },
      fail(res) { }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      wxPayInfo: app.globalData.payInfo
    })
  },
// 根据订单SN，查询商品订单详情
  getOrderDetail() {
    let that = this
    Http.HttpRequst(false, '/order/getOrderInfo?orderSn=' + this.data.ordersn, false, '', '', 'post', false, function (res) {
      if (res.state == 'ok') {
        var params = {
          totalPrice: res.data.order.totalAmount,
          walletAmount: res.data.order.walletAmount,
          wxAmount: res.data.order.wxAmount
        }
        var commodity = 0
        commodity = Number(res.data.order.totalAmount) - Number(res.data.order.freightAmount) - Number(res.data.order.packageAmount)
        that.setData({
          goodDetail: res.data,
          wxPayInfo: params,
          commodity: commodity
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