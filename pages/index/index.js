// pages/detail/detail.js
const Http = require('../../utils/request.js');
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
    indexPrd: [],
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    currentSwiper: 0,
    pageNumber: 1,
    pageSize: 10,
    hasmoreData: false,
    loaderMore: true,
    hiddenloading: false,
  },
  ifGetUserInfo: function () {
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
  getBanner() {
    let that = this
    console.log('5555')
    Http.HttpRequst(true, '/idx/getBanner', false, '', '', 'get', false, function (res) {
      console.log(res,'5555')
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
  getIdxPrd() { 
    let that = this
    Http.HttpRequst(true, '/idx/getIdxPrd', false, '', '', 'get', false, function (res) {
      console.log(res, '5555')
      that.setData({
        indexPrd: res.data
      })
    })
  },
  getActivityList() {
    let that = this
    Http.HttpRequst(true, '/idx/getAdvs', false, '', '', 'get', false, function (res) {
      that.setData({
        activityList: res.data
      })
    })
  },
    /**
   * 获取手机号码服务端解密用户信息接口，获取手机号码
   */
  getPhoneNumber(e) {
    console.log(e)
    console.log(app.globalData.userInfo)
    console.log(e.detail.encryptedData)
    var params = {
      signature: app.globalData.userInfo.signature,
      rawData: app.globalData.userInfo.rawData,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    Http.HttpRequst(true, '/login/getPhoneNumber', false, '', params, 'get', false, function (res) {
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBanner()
    this.recommandPruduct()
    this.getIdxPrd()
    this.getActivityList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  imageLoad: function (e) {//获取图片真实宽度  
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
  onShow: function () {
    console.log(this.data.code, 'this.data.code')
    if (this.data.code) {
      this.ifGetUserInfo()
    } else {
      this.employIdCallback = res => {
        this.ifGetUserInfo()
      }
    }
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
        that.recommandPruduct()
      }, 500)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})