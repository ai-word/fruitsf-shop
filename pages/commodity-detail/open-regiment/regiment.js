// pages/commodity-detail/open-regiment/regiment.js
const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    groups: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    that.setData({
      groupId: options.groupId
    })
    that.getCurrentUsers(options.groupId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 取得正在拼团用户列表
   */
  getCurrentUsers(id) {
    let params = {
      groupId: id
    }
    let that = this
    Http.HttpRequst(false, '/group/getCurrentGroupsForMore', false, '', params, 'get', false, function (res) {
      console.log(res.data)
      that.setData({
        groups: res.data
      })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})