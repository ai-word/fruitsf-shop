// pages/shopping-cart/order-detail/order-detail.js
const Http = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseSize: false,
    animationData: {},
    items: [
      {
        name: '礼品装',
        value: 0,
      },
      {
        name: '家庭装',
        value: 1
      }
    ],
    packageAmount: 0,
    categoreyIds: '',
    goodList: [],
    packages: [],
    totalPrice: '',
    address: '',
    remark: '',
    cartIds: '',
    freightAmount: 0,//运费
    finalamount: 0,//优惠费用
    couponCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cartIds: options.cartIds
    })
    this.orderDetail(options.cartIds)
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
   * 普通订单详情
   */
  orderDetail(cartIds) {
    let that = this
    Http.HttpRequst(false, '/order/orderDetail?cartIds=' + cartIds, false, '', '', 'post', false, function (res) {
      var totalPrice = 0
      var totalWeight = 0
      var totalCount = 0
      if (res.state == 'ok') {
        let packages = res.data.packages

        let categoreyId = '';
        for (var i = 0; i < res.data.prds.length; i++) {
          categoreyId = categoreyId + res.data.prds[i].product_category_id;
          if (i < res.data.prds.length - 1) {
            categoreyId = categoreyId + ',';
          }
          totalPrice += res.data.prds[i].product_amount * res.data.prds[i].price;
          totalWeight += res.data.prds[i].weight
          totalCount += res.data.prds[i].product_amount
        }
        let totalamount = 0
        if (packages.length!=0) {
          packages[0].checked = true
          totalPrice += packages[0].totalamount //计算包装费
          totalamount = packages[0].totalamount
        } else {

        }

        that.setData({
          categoreyIds: categoreyId,
          totalWeight: totalWeight,
          totalCount: totalCount,
          totalPrice: totalPrice.toFixed(2),
          memberAddId: res.data.address.id,
          address: res.data.address,
          goodList: res.data.prds,
          packages: packages,
          packageAmount: totalamount,
          walletAmount: res.data.wallet
        })
        that.getExpressFee()
      }
    })
  },
  /**
   * 包装费
   */
  radioChange(e) {
    var totalPrice = 0
    console.log(e.detail.value)
    totalPrice = Number(this.data.totalPrice) - Number(this.data.packageAmount) + Number(e.detail.value)
    console.log(totalPrice)
    this.setData({
      packageAmount: e.detail.value,
      totalPrice: totalPrice.toFixed(2)
    })
  },
  /**
   * 根据目的地算运费
   */
  getExpressFee() {
    var that = this
    Http.HttpRequst(false, '/express/getExpressFee?count=' + this.data.totalCount + '&weight=' + this.data.totalWeight + '&memberAddId=' + this.data.memberAddId + '&prdCategoryIds=' + this.data.categoreyIds, true, '', '', 'post', false, function (res) {
      if (res.state == 'ok') {
        var totalPrice = 0
        totalPrice = Number(that.data.totalPrice - that.data.freightAmount) + res.data
        console.log(res, '运费')
        that.setData({
          freightAmount: res.data,
          totalPrice: totalPrice.toFixed(2)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  placeOrder() {
    var oderItem = []
    var that = this
    var size = 0
    var item = {
      productId: '',//商品id
      productPic: '',//商品效果图
      productName: '',//商品名称
      productPrice: '',//销售价格
      groupsPrice: '',//拼团价格
      productQuantity: '',//购买数量
      productWeight: '',//总重量
      productCategotyId: ''//分类id
    }
    for (var i = 0; i < that.data.goodList.length; i++) {
      size += that.data.goodList[i].product_amount
      var item = {
        productId: that.data.goodList[i].prdid,//商品id
        productPic: that.data.goodList[i].pic,//商品效果图
        productName: that.data.goodList[i].name,//商品名称
        productPrice: that.data.goodList[i].price,//销售价格
        groupsPrice: '',//拼团价格
        productQuantity: that.data.goodList[i].product_amount,//购买数量
        productWeight: that.data.goodList[i].weight,//总重量
        productCategotyId: that.data.goodList[i].product_category_id//分类id
      }
      oderItem.push(item)
    }
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
      totalAmount: that.data.totalPrice, //订单总金额 商品数量*单价 +包装金额 +运费总额
      payAmount: that.data.totalPrice, // 应付金额 总额-优惠券
      wxAmount: wxAmount, // 微信支付金额
      walletAmount: walletAmount, //钱包支付金额
      packageAmount: that.data.packageAmount,//包装金额
      freightAmount: that.data.freightAmount,//运费金额
      promotionAmount: '',//促销优化金额
      couponAmount: that.data.finalamount,//优惠券抵用金额
      receiverName: that.data.address.name, // 收货人姓名
      receiverPhone: that.data.address.phoneNumber,// 收货人电话
      receiverPostCode: '',//收货人邮编
      receiverProvince: that.data.address.province,//省份
      receiverCity: that.data.address.city,//城市
      receiverRegion: that.data.address.region,//区
      receiverDetailAddress: that.data.address.detailAddress,//详细地址
      note: that.data.remark,//备注
      couponCode: that.data.couponCode,// 优惠券码
    }

    var params = {
      order: order,
      oderItem: oderItem
    }
    if (that.data.address == '') {
      wx:wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    console.log(params, 'paramsparamsparamsparams')
    Http.HttpRequst(false, '/order/order', true, '', JSON.stringify(params), 'post', false, function (res) {
      console.log(res.state == 'ok')
      if (res.state == 'ok') {
        console.log(res)
        var payInfo = {
          walletAmount: that.data.walletAmount,
          totalPrice: that.data.totalPrice,
          payInfo: res.data,
          
        }
        app.globalData.payInfo = payInfo
        wx.setStorageSync('remark', '')
        wx.setStorageSync('cartNum', 0)
        wx.navigateTo({
          url: '/pages/order-payment/order-payment?ordersn=' + res.data.orderSn
        })
      }
    })
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

  },
  addRemarks() {
    app.globalData.finalamount = ''
    wx.navigateTo({
      url: '/pages/addRemarks/addRemarks'
    })
  },
  mycoupon() {
    console.log(this.data.cartIds, 'this.data.cartIds')
    wx.navigateTo({
      url: '/pages/my-coupon/coupon/coupon?cartIds=' + this.data.cartIds
    })
  },
  goAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  }
})