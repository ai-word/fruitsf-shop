// pages/assemble/assemble.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["自提拼团", "物流拼团"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    type: 1,
    groupList: [],
    pageNumber: 1,
    pageSize: 10,
    hasmoreData: false,
    loaderMore: true,
    hiddenloading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getGroupType()
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
    // this.data.groupList = []
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      type: e.currentTarget.dataset.type, //拼团类型
      groupList: []
    });
    this.getGroupType()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/commodity-detail/detail?id=' + e.currentTarget.dataset.id+'&type=' + this.data.type
    })
  },
  /**
 * 获取拼团分类
 */
  getGroupType() {
    let that = this
    console.log('5555')
    Http.HttpRequst(false, '/group/getGroupType', false, '', '', 'get', false, function (res) {
      console.log(res, '5555')
      that.setData({
        tabs: res.data,
      })
      that.getGroupList()
    })
  },
  getGroupList() {
    let that = this
    let params = {
      type: that.data.type,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
    }
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    })
    Http.HttpRequst(false, '/group/getGroups', false, '', params, 'get', false, function (res) {
      setTimeout(() => {
        wx.hideLoading()
        if (res.data.list.length < that.data.pageSize) {
          that.setData({
            groupList: that.data.groupList.concat(res.data.list),
          })
          that.setData({
            hasmoreData: true,
            hiddenloading: false,
            loaderMore: false
          })
        } else {
          that.setData({
            groupList: that.data.groupList.concat(res.data.list),
          })
        }
        
      }, 1000)

    })
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
        that.getGroupList()
      }, 500)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})