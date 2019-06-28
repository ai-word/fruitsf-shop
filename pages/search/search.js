// pages/search/search.js
const Http = require('../../utils/request.js');
const app = getApp();
const Util = require("../../utils/util.js");
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
    key: '',
    isData: false,
    loaderMore: true,
    hiddenloading: false,
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  goShopDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
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

  },
  getValue(e){
    console.log(e)
    this.setData({
      key: e.detail.value
    })
  },
  getSearchGoods() {
    let that = this
    Http.HttpRequst(false, '/idx/searchProduct?key=' + that.data.key, false, '', '', 'get', false, function (res) {
      console.log(res.data)
      if(res.state == 'ok') {
        if (res.data.length == 0) {
          that.setData({
            isData: true
          })
        } else{
          that.setData({
            isData: false,
            goodList: res.data
          })
        }

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
    Http.HttpRequst(false, '/cart/save', true, '', params, 'post', false, function (res) {
      console.log(res, '5555')
      if(res.state == 'ok') {
        wx.showToast({
          title: '添加购物车成功！',
          icon: 'none',
          duration: 1000,
        })
        that.setData({
          indexPrd: res.data
        })
        var num = wx.getStorageSync('cartNum')
        wx.setStorageSync('cartNum', parseInt(1 + num))
        wx.setTabBarBadge({
          index: 3,
          text: "" + parseInt(1 + num) + ""
        })
      }
    })
  }
})