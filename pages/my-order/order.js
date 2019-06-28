var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const Http = require('../../utils/request.js');
const app = getApp();
Page({
  data: {
    tabs: [{
      name: '全部',
      status: 888,
    }, {
      name: '待付款',
        status: 0,
      }, {
      name: '配送中',
        status: 2,
      }, {
      name: '待自提',
        status: 999,
      }, {
        name: '已完成',
        status: 3,
      }],
    ordinary: 0,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    pageNumber: 1,
    pageSize:10,
    orderList: [],
    status: '888',
    orderId: '',
    hasmoreData: false,
    loaderMore: true,
    hiddenloading: false,
  },
  onLoad: function (options) {
    var that = this;
    if (options.type) {
      that.setData({
        activeIndex: options.activeIndex,
        status: options.type
      })
    }
    if (options.ordinary!= undefined) {
      that.setData({
        ordinary: options.ordinary
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow(){
    wx.hideShareMenu()
    this.data.orderList = []
    this.data.pageNumber = 1
    this.getOrderList()
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      status: e.currentTarget.dataset.status
    });
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    })
    this.data.orderList = []
    this.data.pageNumber = 1
    this.getOrderList()
  },
  //获取全部订单列表
  getOrderList() {
    var that = this
    let params = {
      status: that.data.status,
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize
    }
    Http.HttpRequst(false, '/order/getOrders', true, '', params, 'get', false, function (res) {
      if (res.state == 'ok') {
        wx.hideToast()
        if (res.data.list.length === 0 && that.data.pageNumber === 1) {
          that.setData({
            orderList: [],
            hasmoreData: false
          })
          return false
        }
        if (res.data.list.length < that.data.pageSize) {
          that.setData({
            orderList: that.data.orderList.concat(res.data.list),
          })
          that.setData({
            hasmoreData: true,
            hiddenloading: false,
            loaderMore: false
          })
        } else {
          that.setData({
            orderList: that.data.orderList.concat(res.data.list),
          })
        }
      }
    })
  },
  LogisticsInfo(e) {
    wx.navigateTo({
      url: '/pages/logistics-info/logistics-info?sn=' + e.currentTarget.dataset.sn,
    })
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
        that.data.orderList = []
        that.getOrderList()
      }
    })
  },
  //立即支付
  immediatePay(e) {
    console.log(e)
    app.globalData.payInfo = ''
    wx.navigateTo({
      url: '/pages/order-payment/order-payment?ordersn=' + e.currentTarget.dataset.ordersn + '&orderid=' + e.currentTarget.dataset.orderid + '&ordinary=' + '&status=' + e.currentTarget.dataset.status
    })
  },
  orderDetail(e) {
    wx.navigateTo({
      url: '/pages/order-payment/order-payment?ordersn=' + e.currentTarget.dataset.ordersn + '&orderid=' + e.currentTarget.dataset.orderid + '&ordinary=' +'&status=' +e.currentTarget.dataset.status
    })
  },
  remindClick() {
    wx.showToast({
      title: '亲，已经通知商家',
      icon: 'none',
      duration: 1500,
    })
  },
  purChase() {
    wx.switchTab({
      url: '/pages/class/class'
    })
  },
  onUnload: function () {
    if (this.data.ordinary == 1) {

    } else {
      wx.switchTab({
        url: '/pages/shopping-cart/shopping-cart',
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
        that.getOrderList()
      }, 500)
    }
  },
});