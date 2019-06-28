// pages/pay-success/pay-success.js
const Http = require('../../utils/request.js');
const app = getApp();
const Util = require('../../utils/util.js');
import Poster from '../../components/poster/poster';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommandList: '',
    product: '',
    endTime: '2019-06-13 00:00:00',
    painting: {},
    uid: '',
    shareImage: '',
    hideShareModal: true,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    qrcodeUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderSn: options.orderSn
    })
    this.getRecommand2Groups()
    this.getOrderInfo(options.orderSn)
    this.getMyCode()
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goDetail(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/commodity-detail/detail?id=' + id +'&type=' + type,
    })
  },
  getOrderInfo(orderSn) {
    var that = this
    // 'G-110704061825056768'
    Http.HttpRequst(false, '/group/successGroupInfo?orderSn=' + orderSn, true, '', '', 'post', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          users: res.data.users,
          product: res.data.product
        })
        // 执行倒计时函数
        that.countDown()
      }
    })
  },
  //取消订单
  getRecommand2Groups() {
    var that = this
    Http.HttpRequst(false, '/group/getRecommand2Groups', true, '', '', 'post', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          recommandList: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      hideModal: true
    })
  },
  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  countDown() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = Date.parse(new Date());
    let endTimeList = this.data.endTime;
    let countDownArr = []
    // 对结束时间进行处理渲染到页面
    let endTime = Date.parse(new Date(endTimeList.replace(/-/g, "/")));
    let obj = null;
    // 如果活动未结束，对时间进行处理
    // console.log("endTime=" + endTime);
    // console.log("newTime=" + newTime);
    let time = (endTime - newTime) / 1000;
    obj = Util.parseTimeToDay(time);
    // countDownArr.push(obj);
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDown: obj })
    setTimeout(this.countDown, 1000);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.switchTab({
      url: '/pages/shopping-cart/shopping-cart',
    })
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

  //保存分享记录
  addShareNum(url,status) {
    let that = this
    var params = {
      url: url,
      type: 2,
      url_type: status,
    }
    Http.HttpRequst(false, '/idx/share', true, '', params, 'post', false, function (res) {

    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(app.globalData.uid, 'app.globalData.uid')
    console.log(wx.getStorageSync('uid'))
    var uid = ''
    if (app.globalData.uid == '') {
      uid = wx.getStorageSync('uid')
    } else{
      uid = app.globalData.uid
    }
    let that = this
    let title = that.data.product.multi_price + '元-' + that.data.product.name + '>>快来购买'
    that.addShareNum(that.data.product.img,2)
    return {
      title: title,
      path: '/pages/opening-group/opening?orderSn=' + that.data.orderSn + '&uid=' + uid,
      imageUrl: that.data.product.img,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  hideShareModal() {
    this.setData({
      hideShareModal: true
    })
  },
  //生成成功
  onPosterSuccess(e) {
    const { detail } = e;
    this.setData({
      shareImage: detail
    })
    wx.hideLoading()
  },
  onPosterFail(err) {
    console.error(err);
  },
  //小程序码
  getMyCode() {
    let that = this
    var uid = ''
    console.log(wx.getStorageSync('uid'), 'wx.getStorageSyn')
    if (app.globalData.uid == '') {
      uid = wx.getStorageSync('uid')
    } else {
      uid = app.globalData.uid
    }
    var params = {
      page: 'pages/opening-group/opening',
      scene: uid + '&' + that.data.orderSn
    }
    Http.HttpRequst(false, '/login/getShareQrcode', false, '', params, 'get', false, function (res) {
      that.setData({
        qrcodeUrl: res.path
      })
    })
  },
  //分享朋友圈
  showShareModal() {
    var that = this
    that.setData({
      hideShareModal: false,
      hideModal: true,
    })
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    that.addShareNum(that.data.product.img, 1)
    const posterConfig = {
      jdConfig: {
        width: 750,
        height: 1334,
        debug: false,
        blocks: [
          {
            width: 508,
            height: 609,
            x: 121,
            y: 200,
            backgroundColor: "#37D260",
            borderRadius: 20,
          },
          {
            width: 508,
            height: 609,
            zIndex: 100,
          },
        ],
        texts: [
          {
            x: 260,
            y: 90,
            baseLine: 'top',
            text: '挑新鲜水果 上优品四季',
            fontSize: 32,
            color: '#212121',
          },
          {
            x: 140,
            y: 778,
            baseLine: 'middle',
            zIndex: 201,
            text: [
              {
                text: '￥' + that.data.product.multi_price,
                fontSize: 38,
                color: '#FFA20E',
              },
              {
                text: '￥' + that.data.product.singe_price,
                fontSize: 24,
                textDecoration: "line-through",
                color: '#969696',
                marginLeft: 32
              }
            ]
          },
          {
            x: 140,
            y: 730,
            baseLine: 'middle',
            textAlign: "left",
            text: that.data.product.name,
            fontSize: 32,
            width: 480,
            color: '#FFFFFF',
            zIndex: 201
          },
          {
            x: 375,
            y: 1200,
            textAlign: 'center',
            baseLine: 'top',
            text: '长按识别图中“优品四季”小程序',
            fontSize: 30,
            width: 480,
            color: '#080808',
          },
          {
            x: 375,
            y: 1250,
            width: 480,
            textAlign: 'center',
            baseLine: 'top',
            text: '分享赚钱，最高返现10元/箱',
            fontSize: 30,
            color: '#F16650',
          },
        ],
        images: [
          {
            width: 1000,
            height: 1772,
            url: 'https://pic.xuerank.com/share/share_back.png',
          },
          {
            width: 172,
            height: 172,
            x: 100,
            y: 30,
            url: 'https://pic.xuerank.com/share/share_logo.png',
          },
          {
            width: 498,
            height: 498,
            x: 126,
            y: 205,
            url: that.data.product.img,
            borderRadius: 10
          },
          {
            width: 300,
            height: 300,
            x: 225,
            y: 840,
            url: that.data.qrcodeUrl,
          }
        ]
      }
    }
    that.setData({ posterConfig: posterConfig.jdConfig }, () => {
      Poster.create(true)
    })    
  },
  eventSave() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          hideShareModal: true
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  }
})