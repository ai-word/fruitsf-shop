// pages/search/search.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodList: [],
    activityList: [],
    indexPrd: [],
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
    this.recommandPruduct()
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

  },
  /**
 * 首页商品列表
 */
  recommandPruduct() {
    let that = this
    let params = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
    }
    Http.HttpRequst(false, '/idx/recommandPruduct', false, '', params, 'get', false, function (res) {
      if (res.data.list.length < that.data.pageSize) {
        that.setData({
          goodList: that.data.goodList.concat(res.data.list),
        })
        that.setData({
          hasmoreData: true,
          hiddenloading: false,
          loaderMore: false
        })
      } else {
        that.setData({
          goodList: that.data.goodList.concat(res.data.list),
        })
      }
    })
  },
  /**
 * 加入购物车
 */
  addShopCart(e) {
    console.log(e)
    let that = this
    let params = {
      productId: e.currentTarget.dataset.id, //商品id
      productaAmount: 1, //商品数量
      price: e.currentTarget.dataset.price //商品单价
    }
    Http.HttpRequst(true, '/cart/save', true, '', params, 'post', false, function (res) {
      console.log(res, '5555')
      that.setData({
        indexPrd: res.data
      })
      var num = wx.getStorageSync('cartNum')
      wx.setStorageSync('cartNum', parseInt(1 + num))
      wx.setTabBarBadge({
        index: 3,
        text: "" + parseInt(1 + num) + ""
      })
    })
  }
})