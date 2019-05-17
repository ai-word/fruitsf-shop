const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    // 登录
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
        },
        header: {
          'content-type': 'application/json',
          'wxa-sessionid': wx.getStorageSync('sessionkey')
        },
        success: function (res) {
          console.log(res)
        }
      });
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '/pages/index/index'
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
  }
})