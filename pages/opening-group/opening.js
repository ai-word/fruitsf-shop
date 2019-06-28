// pages/pay-success/pay-success.js
const Http = require('../../utils/request.js');
const app = getApp();
const Util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommandList: '',
    product: '',
    endTime: '',
    painting: {},
    shareImage: '',
    orderSn: '',
    hideShareModal: true,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    isLogin: false,
    uid: '',
    shareId: '',
    isShare: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  onLoad: function (options) {
    let that = this
    this.userLogin()
    if (options.scene) {  //次判断是通过扫码进来的
      var scene = decodeURIComponent(options.scene);
      console.log(scene.split("&")[2])
      that.setData({
        shareId: scene.split("&")[0],
        orderSn: scene.split("&")[1]
      })
      this.getRecommand2Groups()
      this.getOrderInfo(scene.split("&")[1])
    } else {
      if (options.orderSn == undefined) {

      } else {
        this.setData({
          orderSn: options.orderSn
        })
        this.getRecommand2Groups()
        this.getOrderInfo(options.orderSn)
      }
      if (options.uid == undefined) {

      } else {
        that.setData({
          shareId: options.uid
        })
      }
    }


  },
  countDown() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = Date.parse(new Date());
    let endTimeList = this.data.endTime;
    let endTime = ''
    let countDownArr = []
    // 对结束时间进行处理渲染到页面
    if (endTimeList == undefined) {

    } else {
      endTime = Date.parse(new Date(endTimeList.replace(/-/g, "/")));
    }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  userLogin() {
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code, 'res.coderes.coderes.code')
        app.globalData.code = res.code
        wx.request({
          url: app.globalData.baseUrl + '/login/',
          data: {
            code: res.code,
          },
          success: function (res) {
            console.log(res, 'resres')
            if (res.statusCode === 200) {
              console.log(res.data.sessionId)
              wx.setStorageSync('sessionkey', res.data.sessionId)
              if (that.employIdCallback) {
                that.employIdCallback(res.data.sessionId)
              }
            } else {

            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              console.log(res, '666666666666')
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
          that.setData({
            isLogin: true,
          })
        } else {
         
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail, '5')
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      console.log(wx.getStorageSync('sessionkey'))
      app.globalData.userInfo = e.detail
      wx.request({
        url: app.globalData.baseUrl + '/login/info',
        data: {
          rawData: e.detail.rawData,
          signature: e.detail.signature,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          uid: that.data.shareId
        },
        header: {
          'content-type': 'application/json',
          'wxa-sessionid': wx.getStorageSync('sessionkey')
        },
        success: function (res) {
          app.globalData.uid = res.data.data.uid
          that.setData({
            uid: res.data.data.uid
          })
          wx.setStorageSync('uid', res.data.data.uid)
        }
      });
      //授权成功后，跳转进入小程序首页
      that.setData({
        isLogin: true,
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  goShopList(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/commodity-detail/detail?id=' + id + '&type=' + type,
    })
  },
  getOrderInfo(orderSn) {
    var that = this
    Http.HttpRequst(false, '/group/successGroupInfo?orderSn=' + that.data.orderSn, true, '', '', 'post', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          users: res.data.users,
          product: res.data.product,
          endTime: res.data.product.countdown
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
  goShopDetail(e) {
    var type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.instanceid
    var groupId = e.currentTarget.dataset.groupid
    if(type == 1) {
      wx.navigateTo({
        url: '/pages/commodity-detail/user-regiment/user-regiment?groupsInstanceId=' + id + '&groupId=' + groupId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/logistics-groups/user-gropus/user?groupsInstanceId=' + id + '&groupId=' + groupId,
      })   
    }
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
    if (this.data.isShare == 0) {

    } else{
      wx.switchTab({
        url: '/pages/shopping-cart/shopping-cart',
      })
    }
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
  addShareNum(url) {
    let that = this
    var params = {
      url: url,
      type: 3,
      url_type: 2,
    }
    Http.HttpRequst(false, '/idx/share', true, '', params, 'post', false, function (res) {

    })
  },
  hideShareModal() {
    this.setData({
      hideShareModal: true
    })
  }
})