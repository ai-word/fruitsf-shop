// pages/addRemarks/addRemarks.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordCount: 0,
    remark: ''
  },
  handelTextArea(e) {
    e.detail.cursor <= 50 ? (this.setData({
      remark: e.detail.value,
      wordCount: e.detail.cursor
    }), 50 == e.detail.cursor && wx.showToast({
      title: "备注信息最多不超过50个字符哦~",
      icon: "none",
      duration: 2e3
    })) : wx.showToast({
      title: "备注信息最多不超过50个字符哦~",
      icon: "none",
      duration: 2e3
    });
    wx.setStorageSync('remark', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  confirm() {
    wx.setStorageSync('remark', this.data.remark)
    wx.navigateBack({
      delta: 1
    });
  },
  cancel() {
    wx.setStorageSync('remark', '')
    wx.navigateBack({
      delta: 1
    });
    this.setData({
      remark: '',
      wordCount: 0
    })
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
    this.setData({
      remark: wx.getStorageSync('remark'),
      wordCount: wx.getStorageSync('remark').length
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