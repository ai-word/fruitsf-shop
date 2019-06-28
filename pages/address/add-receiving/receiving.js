// pages/address/add-receiving/receiving.js
const Http = require('../../../utils/request.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp();
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
    address: '',
    phoneNumber: '',
    city: '',
    id: '',
    detailAddRess: '',
    tag: 0,
    url: '/addr/save',
    isDefault: false,
    changeAddRess: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'LNXBZ-PIPC4-EWFUB-DG6NM-5HEUJ-VCF5X'
    });
    if (options.id ==undefined) {
      
    }else{
      this.getRess(options.id)
    }
    if (options.edit == undefined) {
      this.getPosition()
    } else {
      this.setData({
        url: '/addr/update',
      })
    }
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
    console.log(e.detail.value)
  },
  // 创建收货地址
  getAddRess() {
    var that = this
    let defaultStatus = 0
    if (that.data.isDefault == true) {
      defaultStatus = 1
    } else {
      defaultStatus = 0
    }
    
    let params = {
      id: that.data.id,
      name: that.data.name,
      phoneNumber: that.data.phoneNumber,
      defaultStatus: defaultStatus,
      postCode: '',
      address: that.data.address,
      province: that.data.region[0],
      city: that.data.region[1],
      region: that.data.region[2],
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
    if (that.data.address == '') {
      that.toastDialog.showDialog('请选择地址')
      return false;
    }
    if (that.data.detailAddRess == '') {
      that.toastDialog.showDialog('请输入详细地址')
      return false;
    }

    console.log(params)
    Http.HttpRequst(false, that.data.url, false, '', params, 'post', false, function (res) {
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
  getRess(id) {
    var that = this
    Http.HttpRequst(false, '/addr/getAdd?id=' + id, false, '', '', 'post', false, function (res) {
      if (res.state == 'ok') {
        if (res.data.defaultStatus == 1) {
          that.setData({
            isDefault: true
          })
        } else {
          that.setData({
            isDefault: false
          })
        }
        if (res.data.tag == 1) {
          that.setData({
            currentLabel: 0
          })
        } else {
          that.setData({
            currentLabel: 1
          })
        }
        that.setData({
          region: [res.data.province, res.data.city, res.data.region],
          name: res.data.name,
          id: res.data.id,
          address: res.data.address,
          phoneNumber: res.data.phoneNumber,
          detailAddRess: res.data.detailAddress,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.changeAddRess == true) {
      this.getPosition()
    }
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
              console.log(res,'555')
              that.setData({
                address: res.name,
                changeAddRess: true
              })
            }
          })
        } else if (res.authSetting['scope.userLocation'] === false) {
          wx.openSetting({
            success(res) {
              console.log(res.authSetting)

            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function (res) {
              wx.getLocation({
                type: 'gcj02',
                success(res) {
                  console.log(res, '资质')
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
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
  //获取经纬度
  getPosition() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            let province = res.result.ad_info.province
            let city = res.result.ad_info.city
            let district = res.result.ad_info.district
            app.globalData.region = [province, city, district]
            that.setData({
              region: [province, city, district],
            })
          }
        })
      },
      fail() {
    
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