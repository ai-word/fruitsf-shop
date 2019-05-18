// pages/commodity-detail/detail.js
const Http = require('../../utils/request.js');
var WxParse = require('../../components/wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    isIndex: 0,
    isNull: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let id = options.id
    if (options.isIndex) {
      this.setData({
        isIndex: options.isIndex
      })
    }
    this.setData({
      groupId: id
    })
    this.getGroupInfo(id)
    this.getCurrentUsers(id)
  },
  getGroupInfo(id) { //取得拼团详情页
    let params = {
      productId: id
    }
    let that = this
    Http.HttpRequst(false, '/prd/getProductInfoById', false, '', params, 'get', false, function (res) {

      that.setData({
        groupPics: res.data.prdPics,
        groups: res.data.prdInfo,
        groupInfo: res.data.prdDesc,
      })
      if (JSON.stringify(res.data.prdDesc) == '{}') {
        console.log(5555)
        that.setData({
          isNull: true
        })
      } else{
        that.setData({
          picContent: res.data.prdDesc.de.content,
          isNull: false
        })
        WxParse.wxParse('article', 'html', res.data.prdDesc.de.content, that, 5);
      }
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
  onSubmitTap() {
    let params = {
      groupId: this.data.groupId,
      groupsInstanceId: this.data.groupInstanId
    }
    let that = this
    Http.HttpRequst(false, '/group/startMemberGroups', false, '', params, 'post', false, function (res) {
      console.log(res)
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
    Http.HttpRequst(false, '/group/getCurrentGroups', false, '', params, 'get', false, function (res) {
      console.log(res.data)
      that.setData({
        currentUser: res.data
      })

    })
  },
  toList() {
    wx.navigateTo({
      url: '/pages/commodity-detail/open-regiment/regiment?groupId=' + this.data.groupId
    })
  },
  swiperChange: function (e) {
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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