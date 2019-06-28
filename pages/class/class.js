// pages/class/class.js
const Http = require('../../utils/request.js');
const Util = require('../../utils/util.js');
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
    categoryId: '',
    hide_good_box: true,
    bus_x: 0,
    bus_y: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getAllCategory()
    var _windowHeight = wx.getSystemInfoSync().windowHeight;

    // 目标终点元素 - 购物车的位置坐标
    this.busPos = {};
    this.busPos['x'] = 260;
    this.busPos['y'] = _windowHeight + 50;
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
  goShopDetail(e) {
    let id = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
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
  //添加商品至购物车
  addShopCart(e){
    Util.addShopCart(e.currentTarget.dataset.id, e.currentTarget.dataset.price);
    this.showCartMovie(e);
  },
  showCartMovie(e) {
    // 如果good_box正在运动，不能重复点击
    if (!this.data.hide_good_box) return;
    this.finger = {};
    var topPoint = {};
    //点击点的坐标
    this.finger['x'] = e.touches["0"].clientX;
    this.finger['y'] = e.touches["0"].clientY;

    //控制点的y值定在低的点的上方150处
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }

    //控制点的x值在点击点和购物车之间
    if (this.finger['x' > this.busPos['x']]) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    } else {
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    }

    this.linePos = app.bezier([this.busPos, topPoint, this.finger], 20);
    this.startAnimation();
  },
  startAnimation: function () {
    var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'];
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    index = bezier_points.length;
    this.timer = setInterval(function () {
      index--;
      // 设置球的位置
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      // 到最后一个点的时候，开始购物车的一系列变化，并清除定时器，隐藏小球
      if (index < 1) {
        clearInterval(that.timer);
        that.addGoodToCartFn();
        that.setData({
          hide_good_box: true
        })
      }
    }, 33);
  },
  addGoodToCartFn() {

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