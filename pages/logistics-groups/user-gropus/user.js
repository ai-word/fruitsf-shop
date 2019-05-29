// pages/order-payment/order-payment.js
const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payInfo: '',
    ordersn: '',
    openDetail: '',
    showModal: false,
    commodity: 0,
    freightAmount: 0,
    orderId: '',
    totalPrice: 0,
    packs: '',
    remark: '',
    isPartner: false,
    groupsInstanceId: ''
  },
  addRemarks() {
    app.globalData.finalamount = ''
    wx.navigateTo({
      url: '/pages/addRemarks/addRemarks'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.groupId,
      groupsInstanceId: options.groupsInstanceId,
    })
    this.getStartGrops(options.groupId, options.groupsInstanceId)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //用户开团
  getStartGrops(groupId, groupsInstanceId) {
    let that = this
    Http.HttpRequst(false, '/group/startMemberGroups?groupId=' + groupId + '&groupsInstanceId=' + groupsInstanceId, false, '', '', 'post', false, function (res) {
      console.log(res, '5555')
      if (res.state == 'ok') {
        var packs = res.data.packs
        packs[0].checked = true
        var packageAmount = 0
        var totalPrice = 0
        packageAmount = packs[0].price
        totalPrice += res.data.product.price * res.data.product.num
        totalPrice += packageAmount //计算包装费
        console.log(totalPrice, 'totalPricetotalPricetotalPrice')
        that.setData({
          openDetail: res.data,//详情
          packs: packs, //包装
          totalPrice: totalPrice.toFixed(2),//总金额
          packageAmount: packageAmount,//包装费
          memberAddId: res.data.address.id, //地址id
          address: res.data.address, //地址
          walletAmount: res.data.wallet, //微信钱包
          categoreyIds: res.data.product.categoryid,//分类id
          totalCount: res.data.product.num, //箱数
          totalWeight: res.data.product.weight
        })
        that.getExpressFee()
      }
    })
  },
  /**
   * 根据目的地算运费
   */
  getExpressFee(isAdd) {
    var that = this
    Http.HttpRequst(false, '/express/getExpressFee?count=' + this.data.totalCount + '&weight=' + this.data.totalWeight + '&memberAddId=' + this.data.memberAddId + '&prdCategoryIds=' + this.data.categoreyIds, true, '', '', 'post', false, function (res) {
      if (res.state == 'ok') {
        var totalPrice = 0
        totalPrice = Number(that.data.totalPrice - that.data.freightAmount) + res.data
        console.log(that.data.totalPrice, that.data.freightAmount, '运费')
        that.setData({
          freightAmount: res.data,
          totalPrice: totalPrice.toFixed(2)
        })
        if (isAdd == true) {

        } else { }
      }
    })
  },
  //点击加减按钮  
  numchangeTap: function (e) {
    var shopcar = this.data.openDetail
    console.log(shopcar)
    // this.data.freightAmount =  0
    var types = e.currentTarget.dataset.types//是加号还是减号        
    var totalPrice = Number(this.data.totalPrice)//总计
    var totalCount = this.data.totalCount
    var totalWeight = this.data.totalWeight
    switch (types) {
      case 'add':
        shopcar.product.num++; // 对应商品的数量+1
        totalPrice += shopcar.product.price
        console.log(totalPrice)
        totalCount = shopcar.product.num, //箱数
          totalWeight = shopcar.product.weight * shopcar.product.num//重量
        // that.getExpressFee()
        console.log(shopcar.product.num)
        break;
      case 'minus':
        if (shopcar.product.num == 1) {

        } else {
          shopcar.product.num--;//对应商品的数量-1
          totalPrice -= shopcar.product.price
          totalCount = shopcar.product.num, //箱数
            console.log(shopcar.product.num)
          totalWeight = shopcar.product.weight * shopcar.product.num //重量
        }
        break;
    }
    console.log(totalCount)
    this.setData({
      openDetail: shopcar,
      totalCount: totalCount,
      totalWeight: totalWeight,
      totalPrice: Number(totalPrice).toFixed(2)
    });
    if (shopcar.product.num == 1) {
      // this.getExpressFee(true)
    } else {
      this.getExpressFee(true) //点击加减计算地址
    }
  },
  getAddDetails(id) {
    var that = this
    let params = {
      id: id
    }
    Http.HttpRequst(false, '/addr/getAdd', true, '', params, 'get', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          address: res.data
        })
        that.getExpressFee()
      }
    })
  },
  showPayModal() {
    this.setData({
      showModal: true
    })
  },
  hidePayToast() {
    this.setData({
      showModal: false
    })
  },
  /**
 * 包装费
 */
  radioChange(e) {
    var totalPrice = 0
    totalPrice = Number(this.data.totalPrice) - Number(this.data.packageAmount) + Number(e.detail.value)
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      packageAmount: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.finalamount) {
      var totalPrice = Number(this.data.totalPrice) - Number(app.globalData.finalamount)
      this.setData({
        finalamount: app.globalData.finalamount,
        totalPrice: totalPrice.toFixed(2),
        couponCode: app.globalData.couponCode
      })
    }
    console.log(app.globalData.addressId, '55555')
    if (app.globalData.addressId) {
      this.setData({
        memberAddId: app.globalData.addressId
      })
      // this.getExpressFee() //算运费
      this.getAddDetails(app.globalData.addressId) //id查地址
    }
    this.setData({
      remark: wx.getStorageSync('remark')
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
  goAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 团长
   */
  orderMemberGroups() {
    var oderItem = []
    var that = this
    var product = that.data.openDetail.product
    var item = {
      productId: product.id,//商品id
      productPic: product.pic,//商品效果图
      productName: product.name,//商品名称
      productPrice: product.salesprice * product.num,//销售价格
      groupsPrice: product.price * product.num,//拼团价格
      productQuantity: product.num,//购买数量
      productWeight: product.weight * product.num,//总重量
      productCategotyId: product.categoryid//分类id
    }
    oderItem.push(item)
    // }
    console.log(oderItem)


    // 我们默认优先使用钱包，自动帮用户计算好。
    // 分3中情况：  1.钱包的钱 >= 待支付的钱，就不提交到微信支付；
    // 2.钱包没钱， 全部走微信支付；--- 需要提交到微信；
    // 3.钱包的钱不够，部分钱包，部分微信；--- 微信支付的部分需要提交到微信：
    var wxAmount = 0
    var walletAmount = 0
    if (that.data.walletAmount >= that.data.totalPrice) {
      wxAmount = 0
      walletAmount = that.data.totalPrice
    } else {
      wxAmount = that.data.totalPrice - that.data.walletAmount
      walletAmount = that.data.walletAmount
    }
    var order = {
      groupsId: that.data.groupId,//拼团id
      productId: product.id,//商品id
      isExpress: 2, //是否自提1是2物流
      totalAmount: Number(that.data.totalPrice), //订单总金额 商品数量*单价 +包装金额 +运费总额
      payAmount: Number(that.data.totalPrice), // 应付金额 总额-优惠券
      wxAmount: wxAmount, // 微信支付金额
      walletAmount: walletAmount, //钱包支付金额
      packageAmount: that.data.packageAmount,//包装金额
      freightAmount: that.data.freightAmount,//运费金额
      couponAmount: 0,//优惠券抵用金额
      receiverName: that.data.address.name, // 收货人姓名
      receiverPhone: that.data.address.phoneNumber,// 收货人电话
      receiverProvince: that.data.address.province,//省份
      receiverCity: that.data.address.city,//城市
      receiverRegion: that.data.address.region,//区
      receiverDetailAddress: that.data.address.detailAddress,//详细地址
      note: that.data.remark,//备注
    }

    var params = {
      groupsInstanceId: that.data.groupsInstanceId,
      order: order,
      oderItem: oderItem
    }
    if (that.data.address == '') {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    console.log(params, 'paramsparamsparamsparams')
    Http.HttpRequst(false, '/order/orderMemberGroups', true, '', JSON.stringify(params), 'post', false, function (res) {
      console.log(res.state == 'ok')
      if (res.state == 'ok') {
        wx.setStorageSync('remark', '')
        if (res.data.pay == 'SUCCESS') {
          wx.showToast({
            title: '下单成功！',
            icon: 'nonew',
            duration: 1500,
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/my-order/order'
            })
          }, 2000)
        } else {
          app.globalData.payInfo = res.data
          wx.navigateTo({
            url: '/pages/logistics-payment/payment?ordersn=' + res.data.orderSn
          })
        }
      }
    })
  },
})