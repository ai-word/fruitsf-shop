// pages/commodity-detail/open-regiment/regiment.js
const Http = require('../../../utils/request.js');
const app = getApp();
const Util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    groups: '',
    addingText: false,
    hasPhone: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    that.setData({
      groupId: options.groupId,
      hasPhone: app.globalData.hasPhone
    })
    that.getCurrentUsers(options.groupId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 取得正在拼团用户列表
   */
  getCurrentUsers(id) {
    let params = {
      groupId: id
    }
    let that = this
    Http.HttpRequst(false, '/group/getCurrentGroupsForMore', false, '', params, 'get', false, function (res) {
      console.log(res.data)
      that.setData({
        groups: res.data
      })
      that.countDown()
    })
  },
  countDown() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = Date.parse(new Date());
    let endTimeList = this.data.endTime;
    let countDownArr = []
    // 对结束时间进行处理渲染到页面
    let endTime = Date.parse(new Date(endTimeList));
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu()
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
   * 获取手机号码服务端解密用户信息接口，获取手机号码
   */
  getPhoneNumber(e) {
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '未授权',
        icon: 'none',
        duration: 1000
      })
    } else {
      var params = {
        signature: app.globalData.userInfo.signature,
        rawData: app.globalData.userInfo.rawData,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      var that = this
      Http.HttpRequst(true, '/login/getPhoneNumber', false, '', params, 'get', false, function (res) {
        if (res.state == 'ok') {
          that.setData({
            hasPhone: true
          })
          app.globalData.hasPhone = true
        }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  onInputCancel: function () {
    // 隐藏弹框
    console.log(55566)
    this.setData({
      addingText: false
    })
  },
  /**
     * 取得正在拼团用户列表
     */
  getCurrentUsersList(id) {
    let params = {
      groupInstanId: id
    }
    let that = this
    Http.HttpRequst(false, '/group/getCurrentUsers', false, '', params, 'get', false, function (res) {
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
    var that = this
    wx.navigateTo({
      url: '/pages/commodity-detail/user-regiment/user-regiment?groupId=' + that.data.groupId + '&groupsInstanceId=' + that.data.groupInstanId + '&isType=' + 1
    })
  },
  //物流用户参团
  logSumbitTap(e) {
    var that = this
    wx.navigateTo({
      url: '/pages/logistics-groups/user-gropus/user?groupId=' + that.data.groupId + '&groupsInstanceId=' + that.data.groupInstanId
    })
  },
})