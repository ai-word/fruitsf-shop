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
    orderId: '',
    totalPrice: 0,
    packs: '',
    remark: '',
    isPartner: false,
    groupsInstanceId:''
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

  //团长开团
  getStartGrops(groupId, groupsInstanceId) {
    // let that = this
    let that = this
    Http.HttpRequst(false, '/group/startMemberGroups?groupId=' + groupId + '&groupsInstanceId=' + groupsInstanceId, false, '', '', 'post', false, function (res) {
      console.log(res)
      if (res.state == 'ok') {
        var packs = res.data.packs
        packs[0].checked = true
        var packageAmount = 0
        var totalPrice = 0
        packageAmount = packs[0].price
        totalPrice += res.data.product.price * res.data.product.num
        totalPrice += packageAmount //计算包装费
        that.setData({
          openDetail: res.data,
          packs: packs,
          totalPrice: totalPrice.toFixed(2),
          packageAmount: packageAmount,
          address: res.data.address,
          walletAmount: res.data.wallet
        })
      }
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
  //点击加减按钮  
  numchangeTap: function (e) {
    var shopcar = this.data.openDetail
    console.log(shopcar)
    var types = e.currentTarget.dataset.types//是加号还是减号        
    var totalPrice = Number(this.data.totalPrice)//总计
    switch (types) {
      case 'add':
        shopcar.product.num++; // 对应商品的数量+1
        totalPrice += shopcar.product.price
        console.log(totalPrice)
        break;
      case 'minus':
        if (shopcar.product.num == 1) {

        } else {
          shopcar.product.num--;//对应商品的数量-1
          totalPrice -= shopcar.product.price
        }
        break;
    }
    console.log(totalPrice)
    this.setData({
      openDetail: shopcar,
      totalPrice: Number(totalPrice).toFixed(2)
    });
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
    console.log(app.globalData.payInfo)
    this.setData({
      payInfo: app.globalData.payInfo,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 团员下单
   */
  orderMemberGroups() {
    var oderItem = []
    var that = this
    var product = that.data.openDetail.product
    // for (var i = 0; i < product.length; i++) {
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
      isExpress: 1, //是否自提0是1物流
      totalAmount: Number(that.data.totalPrice), //订单总金额 商品数量*单价 +包装金额 +运费总额
      payAmount: Number(that.data.totalPrice), // 应付金额 总额-优惠券
      wxAmount: wxAmount, // 微信支付金额
      walletAmount: walletAmount, //钱包支付金额
      packageAmount: that.data.packageAmount,//包装金额
      freightAmount: 0,//运费金额
      couponAmount: 0,//优惠券抵用金额
      receiverName: that.data.address.name, // 收货人姓名
      receiverPhone: that.data.address.phoneNumber,// 收货人电话
      // receiverProvince: that.data.address.province,//省份
      // receiverCity: that.data.address.city,//城市
      // receiverRegion: that.data.address.region,//区
      // receiverDetailAddress: that.data.address.detailAddress,//详细地址
      note: that.data.remark,//备注
    }

    var params = {
      groupsInstanceId: that.data.groupsInstanceId,
      order: order,
      oderItem: oderItem
    }
    // if (that.data.address == '') {
    //   wx.showToast({
    //     title: '请选择收货地址',
    //     icon: 'none',
    //     duration: 1500,
    //   })
    //   return false
    // }
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
          // var payInfo = {
          //   walletAmount: that.data.walletAmount,
          //   totalPrice: that.data.totalPrice,
          //   payInfo: res.data,
          // }
          app.globalData.payInfo = res.data
          wx.navigateTo({
            url: '/pages/commodity-detail/self-mention/self-mention?ordersn=' + res.data.orderSn
          })
        }
      }
    })
  },
})