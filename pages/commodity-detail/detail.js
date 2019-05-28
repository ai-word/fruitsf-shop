// pages/commodity-detail/detail.js
const Http = require('../../utils/request.js');
var WxParse = require('../../components/wxParse/wxParse.js');
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
    countdownTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let id = options.id
    this.setData({
      groupId: id
    })
    this.getGroupInfo(id)
    this.getCurrentUsers(id)
    let endTimeList = ''
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    // goodsList.forEach(o => { 
    //   endTimeList.push(o.actEndTime)
    // })
    // console.log(endTimeList)
    this.setData({ actEndTimeList: '2019-5-30 10:00:43' });
    // 执行倒计时函数
    this.countDown();
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
        endTime: res.data.groups.get_endtime
      })
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
  onInputConfirm: function (e) { //赠送金币
    // 隐藏弹框
    console.log(e)
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
    // let params = {
    //   groupId: this.data.groupId,
    //   groupsInstanceId: this.data.groupInstanId
    // }
    var that =this
    wx.navigateTo({
      url: '/pages/commodity-detail/user-regiment/user-regiment?groupId=' + that.data.groupId + '&groupsInstanceId=' + that.data.groupInstanId
    })
  },
  /**
   * 立即开团
   */
  openOrder(e) {
    wx.navigateTo({
      url: '/pages/commodity-detail/open-regiment/open-regiment?groupId=' + e.currentTarget.dataset.id
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.endTime;
    let countDownArr = []
    // 对结束时间进行处理渲染到页面
    let endTime = new Date(endTimeList).getTime();
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {//活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    countDownArr.push(obj);
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDown: countDownArr })
    setTimeout(this.countDown, 1000);
  },
  countDownTimer() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.endTime;
    let countDownArr = []
    // 对结束时间进行处理渲染到页面
    let endTime = new Date(endTimeList).getTime();
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {//活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    countDownArr.push(obj);
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr })
    setTimeout(this.countDownTimer, 1000);
  }
})