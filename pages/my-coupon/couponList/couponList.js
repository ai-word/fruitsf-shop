var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const Http = require('../../../utils/request.js');
const app = getApp();
Page({
  data: {
    tabs: [{
      name: '未使用',
      status: 0,
    }, {
      name: '已使用',
      status: 1,
    }, {
      name: '已过期',
      status: 2,
    }],
    noData: false,
    status:0,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    that.getCouponByType()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
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
    this.getCouponByType()
  },
  getCouponByType() {
    let that = this
    Http.HttpRequst(false, '/coupon/getCouponByType?useStatus=' + this.data.status, false, '', '', 'get', false, function (res) {
      if(res.state == 'ok') {
        if(res.data.length == 0 ) {
          that.setData({
            noData: true
          })
        } else {
          that.setData({
            couponList: res.data
          })
        }
      }
    })
  },
});