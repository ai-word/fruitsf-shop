// pages/detail/detail.js
const Http = require('../../utils/request.js');
const Util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSwiper: 0,
    autoplay: true,
    banner: [],
    goodList: [],
    activityList: [],
    indexGroups: [],
    indexPrd: [],
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    pageNumber: 1,
    pageSize: 10,
    hasmoreData: false,
    loaderMore: true,
    hiddenloading: false,
    hide_good_box: true,
    bus_x: 0,
    bus_y: 0,
    hasPhone: true,
    shareId: '',
    show: false,
    addingText: false
  },
  onInputCancel: function () {
    // 隐藏弹框
    console.log(55566)
    this.setData({
      addingText: false
    })
  },
  /**
   * 悬赏弹框组件
   */
  onShowModal: function (e) {
    // 显示弹框
    this.setData({
      addingText: true
    })
  },
  ifGetUserInfo: function() {
    wx.getSetting({
      success: res => {
        console.log(res.authSetting, '23333')
        if (res.authSetting['scope.userInfo']) {
          if (wx.getStorageSync('token')) {
            this.setData({
              hasUserInfo: true
            })
            this.pageInit()
          } else {
            this.setData({
              showAuthorizeBtn: true
            })
          }
        } else {
          this.setData({
            showAuthorizeBtn: true
          })
        }
      }
    })

  },
  bannerClick(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/banner-detail/banner-detail?id='+ e.currentTarget.dataset.id
    })
  },
  searchClick() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  invitation() {
    wx.navigateTo({
      url: '/pages/invitation/invitation'
    })
  },
  newShop(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.url
    })
  },
  clickGroup(e) {
    console.log(e.currentTarget.dataset.url)
    wx.navigateTo({
      url: '/pages/commodity-detail/detail?id=' + e.currentTarget.dataset.url + '&type=2'
    })
  },
  // 判断用户是否有手机号 如果有责不授权获取手机号,没有则授权
  getHasPhone() {
    let that = this
    console.log('5555')
    Http.HttpRequst(true, '/login/hasPhone', false, '', '', 'get', false, function (res) {
      that.setData({
        hasPhone: res.data
      })
    })
  },
  addBox() {

  },
  getBanner() {
    let that = this
    console.log('5555')
    Http.HttpRequst(true, '/idx/getBanner', false, '', '', 'get', false, function(res) {
      console.log(res, '5555')
      that.setData({
        banner: res.data
      })
    })
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
    Http.HttpRequst(false, '/idx/recommandPruduct', false, '', params, 'get', false, function(res) {
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
    Util.addShopCart(e.currentTarget.dataset.id, e.currentTarget.dataset.price);
    this.showCartMovie(e);
  },
  showCartMovie(e){
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
  addGoodToCartFn(){

  },
  getIdxPrd() {
    let that = this
    Http.HttpRequst(true, '/idx/getIdxPrd', false, '', '', 'get', false, function(res) {
      console.log(res, '5555')
      that.setData({
        indexPrd: res.data
      })
    })
  },
  getActivityList() {
    let that = this
    Http.HttpRequst(true, '/idx/getAdvs', false, '', '', 'get', false, function(res) {
      that.setData({
        activityList: res.data
      })
    })
  },
  getIndexGroupsList() {
    let that = this
    Http.HttpRequst(true, '/idx/getRecommandGroups', false, '', '', 'get', false, function(res) {
      that.setData({
        indexGroups: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (app.globalData.token) {
      this.getBanner()
      this.getHasPhone()
      this.recommandPruduct()
      this.getIdxPrd()
      this.getActivityList()
      this.getIndexGroupsList();
    } else {
      app.loginReadyCallback = res => {
        this.getBanner()
        this.getHasPhone()
        this.recommandPruduct()
        this.getIdxPrd()
        this.getActivityList()
        this.getIndexGroupsList();
      }
    }
    var _windowHeight = wx.getSystemInfoSync().windowHeight;
    

    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      that.setData({
        shareId: scene.split("&")[0]
      })
      app.globalData.shareId = scene.split("&")[0]
    } else {
      if (options.uid == undefined) {

      } else {
        this.setData({
          shareId: options.uid
        })
        app.globalData.shareId = options.uid
      }
    }
    // 目标终点元素 - 购物车的位置坐标
    this.busPos = {};
    this.busPos['x'] = 260; 
    this.busPos['y'] = _windowHeight + 50;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  goPing() {
    console.log(4444)
    wx.switchTab({
      url: '/pages/assemble/assemble'
    })
  },
  goCoupon() {
    wx.navigateTo({
      url: '/pages/coupon/coupon'
    })
  },
  goShopDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },
  payCode() {
    wx.navigateTo({
      url: '/pages/payment-code/code'
    })
  },
  swiperChange: function (e) {
    if (e.detail.source == "touch") {
      this.setData({
        currentSwiper: e.detail.current
      })
    }
    if (e.detail.source == "autoplay") {
      this.setData({
        currentSwiper: e.detail.current
      })
    }
  },
  imageLoad: function(e) { //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    // 获取用户信息
    if (wx.getStorageSync('cartNum') != 0 || wx.getStorageSync('cartNum') != '') {
      wx.setTabBarBadge({
        index: 3,
        text: "" + wx.getStorageSync("cartNum") + ""
      })
    }
    wx.getSetting({
      success: res => {
        console.log(res.authSetting['scope.userInfo'], '5555566')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.switchTab({
            url: '/pages/index/index'
          })
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              console.log(res, '666666666666')
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.reLaunch({
            url: '/pages/authorize/authorize'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('触底了');
    var that = this
    if (that.data.loaderMore) {
      that.setData({
        hasmoreData: false,
        hiddenloading: true,
      })
      setTimeout(function() {
        that.setData({
          pageNumber: parseInt(that.data.pageNumber + 1)
        })
        that.recommandPruduct()
      }, 500)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log(app.globalData.uid, '5555555555555')
    var uid = ''
    if (app.globalData.uid == '') {
      uid = wx.getStorageSync('uid')
    } else {
      uid = app.globalData.uid
    }
    let that = this
    return {
      title: '优品四季,新鲜才好吃!',
      path: '/pages/index/index?uid=' + uid,
      imageUrl: '',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})