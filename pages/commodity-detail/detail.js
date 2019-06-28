// pages/commodity-detail/detail.js
const Http = require('../../utils/request.js');
var WxParse = require('../../components/wxParse/wxParse.js');
const Util = require('../../utils/util.js');
import Poster from '../../components/poster/poster';
const app = getApp();
let goodsList = [
  { actEndTime: '2019-5-30 10:00:43' }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDownList: [],
    countDown: [],
    actEndTimeList: [],
    actStrTimeList: [],
    groupDetail: '',
    groupPics: '',
    currentSwiper: 1,
    autoplay: true,
    groups: '',
    currentUser: '',
    groupId: '',
    groupInfo: '',
    picContent: '',
    currentUserList: '',
    groupInstanId: '',
    groupsUser: '',
    endTime: '',
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    groupType: 1,
    countdownTime: '',
    painting: {},
    shareImage: '',
    hideShareModal: true,
    isLogin: false,
    shareId: '',
    qrcodeUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.userLogin()
    if (options.scene) {  //次判断是通过扫码进来的
      var scene = decodeURIComponent(options.scene);
      console.log(scene.split("&")[2])
      that.setData({
        shareId: scene.split("&")[0],
        groupId: scene.split("&")[1],
        groupType: scene.split("&")[2]
      })
      this.getGroupInfo(scene.split("&")[1])
      this.getCurrentUsers(scene.split("&")[1])
      this.getMyCode(scene.split("&")[1])
    } else { //非扫码
      let id = options.id
      this.setData({
        groupId: id,
        groupType: options.type
      })
      this.getGroupInfo(id)
      this.getCurrentUsers(id)
      this.getMyCode(id)
      if (options.uid == undefined) {

      } else {
        that.setData({
          shareId: options.uid
        })
      }
    }
  },
  getGroupInfo(id) { //取得拼团详情页
    let params = {
      groupId: id
    }
    let that = this
    Http.HttpRequst(false, '/group/getGroupInfo', false, '', params, 'get', false, function(res) {

      that.setData({
        groupPics: res.data.groupPics,
        groups: res.data.groups,
        groupInfo: res.data.groupInfo,
        picContent: res.data.groupInfo.de.content,
        // startTime: res.data.groups.get_starttime,
        endTime: res.data.groups.end_time
      });
      // 执行倒计时函数
      that.countDown();
      WxParse.wxParse('article', 'html', res.data.groupInfo.de.content, that, 5);
    })
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
    console.log(e)
    console.log(111111)
    let id = e.currentTarget.dataset.groupid
    this.setData({
      addingText: true,
      countdownTime: e.currentTarget.dataset.time,
      groupInstanId: e.currentTarget.dataset.groupid
    })
    this.getCurrentUsersList(id)
  },
/**
   * 取得正在拼团用户列表
   */
  getCurrentUsersList(id) {
    let params = {
      groupInstanId: id
    }
    let that = this
    Http.HttpRequst(false, '/group/getCurrentUsers', false, '', params, 'get', false, function(res) {
      console.log(res.data.groups, '5555')
      that.setData({
        currentUserList: res.data.groupUsers,
        groupsUser: res.data.groups
      })
    })
  },
 /**
   * 用户参团
   */
  onSubmitTap(e) {
    var that =this
    wx.navigateTo({
      url: '/pages/commodity-detail/user-regiment/user-regiment?groupId=' + that.data.groupId + '&groupsInstanceId=' + that.data.groupInstanId +'&isType=' +1
    })
  },
  //物流用户参团
  logSumbitTap(e) {
    var that = this
    wx.navigateTo({
      url: '/pages/logistics-groups/user-gropus/user?groupId=' + that.data.groupId + '&groupsInstanceId=' + that.data.groupInstanId
    })
  },
  //团长开团
  getStartGrops(groupId) {
    let that = this
    Http.HttpRequst(false, '/group/startGroups?groupId=' + groupId, false, '', '', 'get', false, function (res) {
      console.log(res, '5555')
      if (res.state == 'ok') {
        if (that.data.groupType == 1) {
          wx.navigateTo({
            url: '/pages/commodity-detail/open-regiment/open-regiment?groupId=' + groupId
          })
        } else {
          wx.navigateTo({
            url: '/pages/logistics-groups/logistics?groupId=' + groupId
          })
        }
      } else if (res.state == 'fail') {
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 4000,
        })
      }
    })
  },
  /**
   * 立即开团
   */
  openOrder(e) {
    this.getStartGrops(e.currentTarget.dataset.id)
  },
  /**
   * 取得正在拼团列表
   */
  getCurrentUsers(id) {
    let params = {
      groupId: id
    }
    let that = this
    Http.HttpRequst(false, '/group/getCurrentGroups', false, '', params, 'get', false, function(res) {
      console.log(res.data)
      that.setData({
        currentUser: res.data
      })

    })
  },
  toList() {
    wx.navigateTo({
      url: '/pages/commodity-detail/open-list/open-list?groupId=' + this.data.groupId
    })
  },
  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current + 1
    })
  },
  goTabIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      hideModal: true
    })
    app.globalData.addressId = ''
    wx.setStorageSync('remark','')
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
  onReachBottom: function() {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   console.log("来自页面内转发按钮");
    // }
    // else {
    //   console.log("来自右上角转发菜单")
    // }
    var uid = ''
    if (app.globalData.uid == '') {
      uid = wx.getStorageSync('uid')
    } else {
      uid = app.globalData.uid
    }
    this.addShareNum(that.data.groups.pic,2)
    let that = this
    let title = that.data.groups.multi_price + '元-' + that.data.groups.name + '>>快来购买'
    return {
      title: title,
      path: '/pages/commodity-detail/detail?id=' + that.data.groupId + '&uid=' + uid + '&groupType=' + that.data.groupType,
      imageUrl: that.data.groups.pic,
      success: (res) => {
      },
      fail: (res) => {
      },
      complete: (res) => {
  
      }
    }
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
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
  hideShareModal() {
    this.setData({
      hideShareModal: true
    })
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
  onPosterSuccess(e) {
    const { detail } = e;
    console.log(e)
    this.setData({
      shareImage: detail
    })
    wx.hideLoading()
  },
  onPosterFail(err) {
    console.error(err);
  },
  //小程序码
  getMyCode(id) {
    let that = this
    var uid = ''
    console.log(wx.getStorageSync('uid'), 'wx.getStorageSyn')
    if (app.globalData.uid == '') {
      uid = wx.getStorageSync('uid')
    } else {
      uid = app.globalData.uid
    }
    var params = {
      page: 'pages/commodity-detail/detail',
      scene: uid + '&' + id + '&' + that.data.groupType
    }
    Http.HttpRequst(false, '/login/getShareQrcode', false, '', params, 'get', false, function (res) {
      that.setData({
        qrcodeUrl: res.path
      })
    })
  },
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
    that.addShareNum(that.data.groups.pic, 1)
    console.log(that.data.groups.pic, 'that.data.groups.pic')
    const posterConfig = {
      jdConfig: {
        width: 750,
        height: 1334,
        // backgroundColor: '#DCF3D1',
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
                text: '￥' + that.data.groups.multi_price,
                fontSize: 38,
                color: '#FFA20E',
              },
              {
                text: '￥' + that.data.groups.singe_price,
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
            text: that.data.groups.name,
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
            url: that.data.groups.img,
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