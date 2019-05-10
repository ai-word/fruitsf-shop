//index.js
//获取应用实例
const app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [
      {
        text: '超值优惠'
      },
      {
        text: '新品上市'
      },
      {
        text: '桃子'
      },
      {
        text: '苹果'
      },
      {
        text: '脐橙'
      },
      {
        text: '火龙果'
      }
    ],
    toView: 'the-0',
    currentTab: 0,
    navScrollLeft: 0,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    windowHeight: ''
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.navData.length - sliderWidth) / 10,
          sliderOffset: res.windowWidth / that.data.navData.length * that.data.activeIndex,
          windowHeight: res.windowHeight
        });
      }
    });
  },
  switchNav(event) {
    console.log(event)
    this.setData({
      sliderOffset: event.currentTarget.offsetLeft,
      toView: 'the-' + event.currentTarget.dataset.current
    });
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  }
})