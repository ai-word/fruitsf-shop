// pages/address/address.js
const Http = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    isDelete: false,
    isChecked: false,
    addRessId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getAllAddress()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.toastDialog = this.selectComponent("#toastDialog");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAllAddress()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  checkTap(e) {
    var data = this.data.addressList
    let id = e.currentTarget.dataset.id
    console.log(id)
    for(var i= 0;i<data.length;i++) {
      if (data[i].id == id) {
        data[i].select = true
      } else {
        data[i].select = false
      }
    }
    this.setData({
      addressList: data,
      addRessId: id
    })
  },
  submitDelete() {
    let that = this
    if (this.data.addRessId == '') {
      that.toastDialog.showDialog('请选择要删除的地址')
      return false
    }
    let params = {
      id: this.data.addRessId
    }
    Http.HttpRequst(false, '/addr/delete', false, '', params, 'get', false, function (res) {
      if(res.state == 'ok') {
        that.getAllAddress()
        that.setData({
          addRessId: ''
        })
        that.toastDialog.showDialog('删除成功！')
      }
    })
  },
  getAllAddress() {
    let that = this
    Http.HttpRequst(false, '/addr/getAllAddress', false, '', '', 'get', false, function (res) {
  
      for(var i=0;i<res.data.length;i++) {
        res.data[i].select = false
      }
      that.setData({
        addressList: res.data,
      })

    })
  },
  deleteShopCar() {
    var isDelete = !this.data.isDelete || false
    this.setData({
      isDelete: isDelete
    })
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
  goAddress() {
    wx.navigateTo({
      url: '/pages/address/add-receiving/receiving'
    })
  },
  goToShop(e) {
    app.globalData.addressId = e.currentTarget.dataset.id
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})