// pages/class/class.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    goodsItem: [],
    category: [],
    tabSelected: 0,
    pageNumber: 1,
    pageSize: 10,
    hasmoreData: false,
    loaderMore: true,
    hiddenloading: false,
    categoryId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getAllCategory()
    // wx.request({
    //   url: 'https://xianfengapp.gomoretech.com/newretail/api/mall/product/store/getMenuProduct?storeId=31310086&business=RETAIL',
    //   data: '',
    //   header: {},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function(res) {
    //     console.log(res.data, '55')
    //     that.setData({
    //       category: res.data.data,
    //       goodsItem: res.data.data[0].products
    //     })
    //     console.log(res.data.data[0].products)
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  clickCategory: function (e) {
    this.data.goodsItem = []
    // this.data.pageNumber = 1
    let id = e.currentTarget.dataset.id
    this.setData({
      tabSelected: e.currentTarget.dataset.idx,
      categoryId: e.currentTarget.dataset.id,
      pageNumber: 1
    });
    this.getProductByCategory(id)
  },
  getAllCategory() { //获取分类
    let that = this
    console.log('5555')
    Http.HttpRequst(true, '/prd/getAllCategory', false, '', '', 'get', false, function (res) {
      console.log(res,'5555')
      that.setData({
        category: res.data,
        categoryId: res.data[0].id
      })
      that.getProductByCategory(res.data[0].id)
    })
  },
  getProductByCategory(id){
    let params = {
      categoryId: id,
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize
    }
    let that = this
    Http.HttpRequst(true, '/prd/getProductByCategory', false, '', params, 'get', false, function (res) {
      if (res.data.list.length < that.data.pageSize) {
        that.setData({
          goodsItem: that.data.goodsItem.concat(res.data.list),
        })
        that.setData({
          hasmoreData: true,
          hiddenloading: false,
          loaderMore: false
        })
      } else {
        that.setData({
          goodsItem: that.data.goodsItem.concat(res.data.list),
        })
      }
    })
  },
  tapClassify: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    if (id === that.data.classifyViewed) {
      that.setData({
        scrolltop: 0,
      })
    } else {
      that.setData({
        classifyViewed: id,
      });
      console.log('id:', that.data.classifyViewed)
      for (var i = 0; i < that.data.categories.length; i++) {
        if (id === that.data.categories[i].id) {
          that.setData({
            page: 1,
            scrolltop: 0,
            goodsListCurrent: that.data.goodsList[i]
          })
        }
      }
    }
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
    console.log('触底了');
    var that = this
    let id = that.data.categoryId
    if (that.data.loaderMore) {
      that.setData({
        hasmoreData: false,
        hiddenloading: true,
      })
      setTimeout(function () {
        that.setData({
          pageNumber: parseInt(that.data.pageNumber + 1)
        })
        that.getProductByCategory(id)
      }, 500)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})