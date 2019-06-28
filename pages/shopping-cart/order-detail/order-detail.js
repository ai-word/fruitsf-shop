// pages/shopping-cart/order-detail/order-detail.js
const Http = require('../../../utils/request.js');
const app = getApp();
var WxParse = require('../../../components/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseSize: false,
    showModal:false,
    rewardModal: false,
    animationData: {},
    packageAmount: 0,
    isAddRess: false,
    categoreyIds: '',
    goodList: [],
    goodsPrice: 0,
    memberAddId: '',
    packages: [],
    totalPrice: '',
    ischecked:0,
    hasPhone: true,
    address: '',
    remark: '',
    cartIds: '',
    freightAmount: 0,//运费
    finalamount: 0,//优惠费用
    couponCode: '',
    isClick: true,
    productAttr: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.hideShareMenu()
    this.setData({
      cartIds: options.cartIds
    })
    this.getHasPhone()
    this.getAwards()
    // this.orderDetail(options.cartIds)
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
    wx.hideShareMenu()
      this.setData({
        finalamount: app.globalData.finalamount,
        couponCode: app.globalData.couponCode
      })
      this.orderDetail(this.data.cartIds)
    if (app.globalData.addressId == '') {
  
    } else {
      this.setData({
        memberAddId: app.globalData.addressId,
        isAddRess: true
      })
      this.getAddDetails(app.globalData.addressId) //id查地址
    }
    this.setData({
      remark: wx.getStorageSync('remark')
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
   * 普通订单详情
   */
  orderDetail(cartIds) {
    let that = this
    Http.HttpRequst(false, '/order/orderDetail?cartIds=' + cartIds, false, '', '', 'post', false, function (res) {
      var totalPrice = 0
      var goodsPrice = 0
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
          totalPrice += res.data.prds[i].product_amount * res.data.prds[i].prdprice;
          goodsPrice += res.data.prds[i].product_amount * res.data.prds[i].prdprice;
          totalWeight += res.data.prds[i].weight
          totalCount += res.data.prds[i].product_amount
        }
        let totalamount = 0
        let productAttr = ''
        if (packages.length!=0) {
          packages[that.data.ischecked].checked = true
          totalPrice += packages[that.data.ischecked].totalamount //计算包装费
          totalamount = packages[that.data.ischecked].totalamount
          productAttr = packages[that.data.ischecked].name
        } else {

        }
        that.setData({
          goodsPrice: goodsPrice,
          categoreyIds: categoreyId,
          totalWeight: totalWeight,
          productAttr: productAttr,
          totalCount: totalCount,
          totalPrice: totalPrice.toFixed(2),
          productAttr: packages[0].name,
          goodList: res.data.prds,
          packages: packages,
          packageAmount: totalamount,
          walletAmount: res.data.wallet
        })
        that.totalMoney(goodsPrice, that.data.freightAmount, that.data.finalamount, that.data.packageAmount)
        //判断地址为空
        console.log(that.data.address, '55566666666666666666')
        if (res.data.address == undefined) {
    
        } else {
          if (app.globalData.addressId == '') {
            that.setData({
              isAddRess: true,
              address: res.data.address,
              memberAddId: res.data.address.id
            })
            that.getExpressFee()
          } else {

          }
        }
      }
    })
  },
  radioText(e) {
    console.log(e, '5555')
    this.setData({
      productAttr: e.currentTarget.dataset.name,
      ischecked: e.currentTarget.dataset.index
    })
  },
  totalMoney(shopPrice, freightAmount, finalamount, packageAmount) {
    var total = Number(shopPrice) - Number(finalamount) + Number(freightAmount) + Number(packageAmount)
    console.log(total,'total')
    this.setData({
      totalPrice: total.toFixed(2)
    })
  },
  /**
   * 包装费
   */
  radioChange(e) {
    var totalPrice = 0
    this.setData({
      packageAmount: e.detail.value,
      // totalPrice: totalPrice.toFixed(2)
    })
    this.totalMoney(this.data.goodsPrice, this.data.freightAmount, this.data.finalamount, this.data.packageAmount)
  },
  /**
   * 根据目的地算运费
   */
  getExpressFee() {
    var that = this
    Http.HttpRequst(false, '/express/getExpressFee?count=' + that.data.totalCount + '&weight=' + that.data.totalWeight + '&memberAddId=' + that.data.memberAddId + '&prdCategoryIds=' + that.data.categoreyIds, true, '', '', 'post', false, function (res) {
      if (res.state == 'ok') {
        that.setData({
          freightAmount: res.data,
        })
        that.totalMoney(that.data.goodsPrice, that.data.freightAmount, that.data.finalamount, that.data.packageAmount)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  placeOrder() {
    var that = this
    if (that.data.isClick) { //防止重复点击
      that.setData({
        isClick: false
      })
      setTimeout(function () {
        that.setData({
          isClick: true
        })
      }, 1000)
    } else {
      return false
    }
  console.log('4444')
    var oderItem = []
    var size = 0
    var item = {
      productId: '',//商品id
      productPic: '',//商品效果图
      productName: '',//商品名称
      productPrice: '',//销售价格
      groupsPrice: '',//拼团价格
      productQuantity: '',//购买数量
      productWeight: '',//总重量
      productCategotyId: '',//分类id
      productAttr: '',
    }
    for (var i = 0; i < that.data.goodList.length; i++) {
      size += that.data.goodList[i].product_amount
      var item = {
        productId: that.data.goodList[i].prdid,//商品id
        productPic: that.data.goodList[i].pic,//商品效果图
        productName: that.data.goodList[i].name,//商品名称
        productPrice: that.data.goodList[i].price,//销售价格
        groupsPrice: '',//拼团价格
        productAttr: that.data.productAttr,
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
    console.log(that.data.address, 'that.data.address')
    if (that.data.address == '') {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1500,
      })
      return false
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

    console.log(params, 'paramsparamsparamsparams')
    Http.HttpRequst(false, '/order/order', true, '', JSON.stringify(params), 'post', false, function (res) {
      console.log(res.state == 'ok')
      if (res.state == 'ok') {
        console.log(res)
        wx.setStorageSync('remark', '')
        wx.setStorageSync('cartNum', 0)
        if (res.data.pay == 'SUCCESS') {
          wx.showToast({
            title: '下单成功！',
            icon: 'nonew',
            duration: 1500,
          })
          setTimeout(() =>{
            wx.navigateTo({
              url: '/pages/my-order/order'
            })
          },2000)
        } else {
          var payInfo = {
            walletAmount: that.data.walletAmount,
            totalPrice: that.data.totalPrice,
            payInfo: res.data,
          }
          app.globalData.payInfo = payInfo
          wx.navigateTo({
            url: '/pages/order-payment/order-payment?ordersn=' + res.data.orderSn
          })
        }
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
        if (that.data.goodList == '' || that.data.goodList == undefined) {
          
        } else {
          that.getExpressFee()
        }
      }
    })
  },
  // 用户购买，分享返现奖励说明
  showRewardModal() {
    this.setData({
      rewardModal: true
    })
  },
  hideRewardModal() {
    this.setData({
      rewardModal: false
    })
  },
  getAwards() {
    let that = this
    Http.HttpRequst(false, '/pay/getAwards', false, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        console.log(res, '44444')
        WxParse.wxParse('article', 'html', res.data.rules, that, 5);
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
    // app.globalData.finalamount = that.data
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
  },
  // 判断用户是否有手机号 如果有责不授权获取手机号,没有则授权
  getHasPhone() {
    let that = this
    console.log('5555')
    Http.HttpRequst(true, '/login/hasPhone', false, '', '', 'get', false, function (res) {
      that.setData({
        hasPhone: res.data
      })
      app.globalData.hasPhone = res.data
    })
  },
  /**
   * 获取手机号码服务端解密用户信息接口，获取手机号码
   */
  getPhoneNumber(e) {
    console.log(wx.getStorageSync('userInfo'))
    // if (app.globalData.userInfo ==)
    console.log(e)
      var userInfo = wx.getStorageSync('userInfo')
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '未授权',
        icon: 'none',
        duration: 1000
      })
    } else {
      var params = {
        signature: userInfo.signature,
        rawData: userInfo.rawData,
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
  }
})