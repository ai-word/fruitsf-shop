// pages/address/add-receiving/receiving.js
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userGenders: '-1',
    currentLabel: '-1',
    genders: [{
      name: "先生",
      value: "MALE",
      id: 0
    }, {
      name: "女士",
      value: "FEMALE",
      id: 1
    }],
    labels: [{
      name: "家",
      id: 1
    }, {
      name: "公司",
      id: 2
    }],
    defaultStatus: 0,
    name: '',
    region: ["省", "市", "区"],
    details: '',
    phoneNumber: '',
    city: '',
    detailAddRess: '',
    tag: 0,
    isDefault: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  handlePhone(e){
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  handleDefault: function (e) {
    this.setData({
      isDefault: e.detail.value
    });
  },
  // 创建收货地址
  getAddRess() {
    var that = this
    let defaultStatus = 0
    if (!that.data.isDefault) {
      defaultStatus = 1
    } else {
      defaultStatus = 0
    }
    
    let params = {
      name: that.data.name,
      phoneNumber: that.data.phoneNumber,
      defaultStatus: defaultStatus,
      postCode: '',
      city: that.data.region[0],
      region: that.data.details,
      detailAddRess: that.data.detailAddRess,
      tag: that.data.tag
    }
    if (that.data.name == '') {
      that.toastDialog.showDialog('请输入联系人')
      return false;
    }
    if (that.data.phoneNumber == '') {
      that.toastDialog.showDialog('请输入手机号码')
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(that.data.phoneNumber))) {
      that.toastDialog.showDialog('手机号有误')
      return false;
    }
    if (that.data.region[0] == '省') {
      that.toastDialog.showDialog('请选择城市')
      return false;
    }
    if (that.data.details == '') {
      that.toastDialog.showDialog('请选择地址')
      return false;
    }
    if (that.data.detailAddRess == '') {
      that.toastDialog.showDialog('请输入详细地址')
      return false;
    }
    console.log(params)
    Http.HttpRequst(false, '/addr/save', false, '', params, 'post', false, function (res) {
      if (res.state == 'ok') {
        that.toastDialog.showDialog('保存成功！')
        setTimeout(() =>{
          wx.navigateBack({
            delta: 1
          });
        },1000)
      }
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  handleHouseNumber(e){
    this.setData({
      detailAddRess: e.detail.value
    })
  },
  handleClick(e) {
    if (e.currentTarget.dataset.type == 'label') {
      this.setData({
        currentLabel: e.currentTarget.dataset.index,
        tag: e.currentTarget.dataset.id
      })
    } else{
      this.setData({
        userGenders: e.currentTarget.dataset.index
      })
    }
  },
  bindDateChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  chooseAddress() {
    var that = this
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.userLocation'] == true, 'userLocation')
        if (res.authSetting['scope.userLocation'] === true) {
          wx.chooseLocation({
            success(res) {
              console.log(res)
              that.setData({
                details: res.name,
                detailAddRess:res.address
              })
            }
          })
        } else if (res.authSetting['scope.userLocation'] === false) {
          wx.openSetting({
            success: function (res) {
              console.log(res.authSetting)
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function () {
              wx.chooseLocation({
                success(res) {
                  that.setData({
                    details: res.name,
                    detailAddRess: res.address
                  })
                }
              })
            },
            fail: function (res) {

            }
          })
        }
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})