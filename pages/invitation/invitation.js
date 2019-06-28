// pages/invitation/nvitation.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isLogin: false,
    shareId: '',
    openId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isApplyPartners()
    if (options.uid == undefined) {

    } else {
      this.setData({
        shareId: options.uid
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  isApplyPartners() {
    let that = this
    Http.HttpRequst(false, '/sales/isApplyPartners', false, '', '', 'get', false, function (res) {
      that.setData({
        isShow: res.data.isApply
      })
    })
  },
  cashback() {
    wx.navigateTo({
      url: '/pages/balance/balance',
    })
  },
  //申请合作伙伴
  applyPartners() {
    let that = this
    Http.HttpRequst(false, '/sales/applyPartners', false, '', '', 'get', false, function (res) {
      console.log(res.data)
      if(res.state == 'ok') {
        wx.showToast({
          title: res.data,
          icon:'none',
          duration:1500
        })
        that.isApplyPartners()
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取用户信息
    var that = this
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
  //保存分享记录
  addShareNum(url, status) {
    let that = this
    var params = {
      url: url,
      type: 1,
      url_type: status,
    }
    Http.HttpRequst(false, '/idx/share', true, '', params, 'post', false, function (res) {

    })
  },
  onShareAppMessage: function () {
    this.addShareNum('https://pic.xuerank.com/share/share.png',2)

    var uid = ''
    if (app.globalData.uid == '') {
      uid = wx.getStorageSync('uid')
    } else {
      uid = app.globalData.uid
    }
    let that = this
    return {
      title: '邀请有礼,荐者有份',
      path: '/pages/invitation/invitation?uid=' + uid,
      success: (res) => {

      },
      fail: (res) => {
      }
    }
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index'
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
            console.log(res)
            that.setData({
              uid: res.data.data.uid
            })
            wx.getStorageSync('uid', res.data.data.uid)
            app.globalData.uid = res.data.data.uid
          }
        });
        //授权成功后，跳转进入小程序首页
        that.setData({
          isLogin: true,
        })
      } else {
        //用户按了拒绝按钮
        wx.showToast({
          title: '未授权',
          icon: 'none',
          duration: 2000,
        })
      }
    }
})