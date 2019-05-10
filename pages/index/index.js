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
    tag: [
      {
        "height": 300,
        "orderNumber": 0,
        "id": "1098021366205296641",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/3038ba31e5b046c29757f30950cc0cfe.png",
        "type": "JIN_GANG",
        "linkModel": "grab_activity"
      },
      {
        "height": 300,
        "orderNumber": 1,
        "id": "1098021366222073858",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/6887d9ff272a4d98ab601dd3c6880508.png",
        "type": "JIN_GANG",
        "linkModel": "invite_member"
      },
      {
        "height": 300,
        "orderNumber": 2,
        "id": "1098021366230462466",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/a774c335ad6243fcb52aa87c44fa28fa.png",
        "type": "JIN_GANG",
        "linkModel": "teambuying_activity"
      },
      {
        "height": 300,
        "orderNumber": 3,
        "id": "1098021366243045378",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/95056367fd8041c9857ff71946b70267.png",
        "type": "JIN_GANG",
        "linkModel": "sign_in"
      },
      {
        "height": 300,
        "orderNumber": 4,
        "id": "1098021366255628290",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/0299e95ba38747dca0f4431958255ae3.png",
        "type": "JIN_GANG",
        "linkModel": "score_mall"
      }
    ],
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    currentSwiper: 0
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
      // that.setData({
      //   banner: res.data.data
      // })
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})