//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
  


    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      //wx.getUpdateManager()检查是否存在新版本
      wx.getUpdateManager().onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log("是否有新版本：" + res.hasUpdate);
        if (res.hasUpdate) {//如果有新版本
          // 小程序有新版本，会主动触发下载操作（无需开发者触发）
          wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，单击确定重启应用',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  wx.getUpdateManager().applyUpdate();
                }
              }
            })

          })
          // 小程序有新版本，会主动触发下载操作（无需开发者触发）
          wx.getUpdateManager().onUpdateFailed(function () {//当新版本下载失败，会进行回调
            wx.showModal({
              title: '提示',
              content: '检查到有新版本，但下载失败，请检查网络设置',
              showCancel: false,
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onShow() {
    // 登录
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = res.code
        // that.setData({
        //   code: res.code
        // })
        console.log(res.code, 'res.coderes.coderes.coderes.coderes.coderes.code')
        wx.request({
          url: that.globalData.baseUrl + '/login/',
          data: {
            code: res.code,
          },
          success: function (res) {
            console.log(res, 'resres')
            if (res.statusCode === 200) {
              console.log(res.data.sessionId)
              that.globalData.token = res.data.sessionId
              console.log(that.globalData.token,'sessionkey')
              wx.setStorageSync('sessionkey', res.data.sessionId)
              if (that.loginReadyCallback) {
                that.loginReadyCallback(res.data.sessionId)
              }
            } else {

            }
          }
        })
      }
    })
  },
  globalData: {
    sessionkey: '',
    code: '',
    userInfo: null,
    baseUrl: 'https://www.xuerank.com',
    cartNum: '',
    addressId:'',
    finalamount: 0,
    payInfo: '',
    uid: '',
    region: [],
    shareId: '',
    hasPhone: true,
    couponCode: '',
    activeIndex: '-1'
  },
  bezier: function (pots, amount) {
    // 购物车动画特效算法
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0];//点击
      pointB = points[1];//中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  }
})