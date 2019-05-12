// pages/commodity-detail/detail.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupDetail: '',
    groupPics: '',
    currentSwiper: 1,
    autoplay: true,
    groups: '',
    currentUser: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGroupInfo()
    this.getCurrentUsers()
  },
  getGroupInfo() { //取得拼团详情页
    let params = {
      groupId: 1
    }
    let  that = this
    Http.HttpRequst(false, '/group/getGroupInfo', false, '', params, 'get', false, function (res) {
 
        that.setData({
          groupPics: res.data.groupPics,
          groups: res.data.groups
        })
  
    })
  },
  /**
   * 取得正在拼团用户列表
   */
 getCurrentUsers() {
   let params = {
     groupId: 1
   }
    let  that = this
   Http.HttpRequst(false, '/group/getCurrentGroups', false, '', params, 'get', false, function (res) {
     console.log(res.data)
     that.setData({
       currentUser: res.data
     })

   })
 },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current + 1
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