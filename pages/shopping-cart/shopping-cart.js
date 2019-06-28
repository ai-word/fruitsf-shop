const Http = require('../../utils/request.js');
const app = getApp();
// pages/shopping-cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarActiveIndex: 0,
    goodList: [],
    adminShow: false,//管理      
    shopCartList: [],//购物车数据      
    totalPrice: 0,//总金额      
    allChecked: true,//全选      
    hintText: '',//提示的内容
    lenIndex:0,      
    hintShow: false,//是否显示提示
    checkedAll: true,
  },
  getAllCartList() {
    let that = this
    var totalPrice = 0
    Http.HttpRequst(true, '/cart/getAllCarts', true, '', '', 'post', false, function (res) {
      var  goodNum = 0
      for (let i = 0, len = res.data.length; i < len; i++) {//这里是对选中的商品的价格进行总结 
        if (res.data[i].select) {
          totalPrice += res.data[i].product_amount * res.data[i].price;
          console.log(res.data[i].product_amount * res.data[i].price)
          console.log(100.24*3)
          console.log(res.data[i].price)
          goodNum +=res.data[i].product_amount
        }
      }
      that.setData({
        shopCartList: res.data,
        totalPrice: totalPrice.toFixed(2),
      });
      console.log(totalPrice, 'totalPrice')
      that.judgmentAll();//判断是否全选
      var num = wx.getStorageSync('cartNum')
      wx.setStorageSync('cartNum', parseInt(goodNum))
      wx.setTabBarBadge({
        index: 3,
        text: "" + parseInt(goodNum) + ""
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  stopClick() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.toastDialog = this.selectComponent("#toastDialog");
  },
  //点击全选  
  checkboxAllChange: function () {
    let shopcar = this.data.shopCartList,
      allChecked = !this.data.allChecked,//点击全选后allChecked变化
      totalPrice = 0;
    for (let i = 0, len = shopcar.length; i < len; i++) {
      shopcar[i].select = allChecked;//所有商品的选中状态和allChecked值一样
      if (allChecked) {//如果为选中状态则计算商品的价格
        totalPrice += shopcar[i].price * shopcar[i].product_amount;
      }
    } 
    this.setData({
      allChecked: allChecked,
      shopCartList: shopcar,
      totalPrice: totalPrice.toFixed(2)
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  //点击单个选择按钮  
  checkTap: function (e) {
    console.log(this.data.allShopList, '555')
    let Index = e.currentTarget.dataset.index
    let shopcar = this.data.shopCartList
    let totalPrice = Number(this.data.totalPrice)
    shopcar[Index].select = !shopcar[Index].select || false;
    if (shopcar[Index].select) {
      totalPrice += Number(shopcar[Index].product_amount) * Number(shopcar[Index].price);
    } else {
      totalPrice -= Number(shopcar[Index].product_amount) * Number(shopcar[Index].price);
    }
    console.log(totalPrice, 'totalPrice')
    this.setData({
      shopCartList: shopcar,
      totalPrice: totalPrice.toFixed(2),
    });
    this.judgmentAll();//每次按钮点击后都判断是否满足全选的条件  
  },
  andAndSub(productId, productaAmount, price) {
    let params = {
      productId: productId,
      productaAmount: productaAmount,
      price: price
    }
    Http.HttpRequst(false, '/cart/andAndSub', true, '', params, 'post', false, function (res) {
      if (res.state == 'ok') {
        // that.getAllCartList()
      }
    })
  },
  //点击加减按钮  
  numchangeTap: function (e) {
    let Index = e.currentTarget.dataset.index,//点击的商品下标值        
      shopcar = this.data.shopCartList,
      types = e.currentTarget.dataset.types,//是加号还是减号        
      totalPrice = this.data.totalPrice;//总计
    let shopId = e.currentTarget.dataset.id
    let price = shopcar[Index].price
    // let product_amount = shopcar[Index].product_amount
    switch (types) {
      case 'add':
        shopcar[Index].product_amount++; // 对应商品的数量+1   
        
        if (shopcar[Index].select) {
          totalPrice = Number(shopcar[Index].product_amount) * Number(shopcar[Index].price)
        }

        var num = wx.getStorageSync('cartNum')
        var product_amount = shopcar[Index].product_amount;
        wx.setStorageSync('cartNum', parseInt(num + 1))
        this.andAndSub(shopId, product_amount, price)
        wx.setTabBarBadge({
          index: 3,
          text: "" + parseInt(num + 1) + ""
        })    
        console.log(totalPrice)  
        break;
      case 'minus':
        shopcar[Index].product_amount--;//对应商品的数量-1      
        if (shopcar[Index].select) {
          totalPrice = Number(shopcar[Index].product_amount) * Number(shopcar[Index].price)
        }
        var num = wx.getStorageSync('cartNum')
        var product_amount = shopcar[Index].product_amount
        this.andAndSub(shopId, product_amount, price)
        wx.setStorageSync('cartNum', parseInt(num - 1))
        wx.setTabBarBadge({
          index: 3,
          text: "" + parseInt(num - 1) + ""
        })   
        console.log(totalPrice)
        break;
    }
    this.setData({
      shopCartList: shopcar,
      totalPrice: parseFloat(totalPrice).toFixed(2)
    });
  },
  onShow: function () {
    // var shopcarData = app.globalData.shopcarData,//这里我是把购物车的数据放到app.js里的，这里取出来，开发的时候视情况加载自己的数据
    wx.hideShareMenu()
    wx.setStorageSync('remark', '')
    this.getAllCartList()
    app.globalData.addressId = ''
    app.globalData.finalamount = 0
    app.globalData.activeIndex = '-1'
  },
  // 判断是否为全选  
  judgmentAll: function () {
    let shopcar = this.data.shopCartList,
      shoplen = shopcar.length,
      lenIndex = 0;//选中的物品的个数    
    for (let i = 0; i < shoplen; i++) {//计算购物车选中的商品的个数    
      shopcar[i].select && lenIndex++;
    }
    this.setData({
      allChecked: lenIndex == shoplen,//如果购物车选中的个数和购物车里货物的总数相同，则为全选，反
      lenIndex: lenIndex
    });
  },
  /**
   * 删除购物车
   */
  deleteShopCar() {
    let list = this.data.shopCartList
    let str = ''
    let that = this
    for (let i = 0; i < list.length;i++) {
      if (list[i].select == true) {
        str += list[i].cartid + ','
      }
    }
    if (str.length > 0) {
      str = str.substr(0, str.length - 1);
    }
    let params = {
      ids: str
    }
    if (str == '') {
      wx.showToast({
        title: '请选择商品！',
        icon: 'none',
        duration: 15000
      })
      return false
    }
    console.log(params)
    Http.HttpRequst(false, '/cart/delete', true, '', params, 'post', false, function (res) {
      if(res.state == 'ok') {
        that.getAllCartList()
      }
    })
  },
  toPerfectOrder() {
    let dataList = this.data.shopCartList
    let str = ''
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].select == true) {
        str += dataList[i].cartid + ','
      }
    }
    if (str.length > 0) {
      str = str.substr(0, str.length - 1);
    }
    if (str == '') {
      this.toastDialog.showDialog('请选择商品!')
      return false
    }
    if (dataList.length == 0) {
      this.toastDialog.showDialog('请选择商品!')
    } else {
      // let str = ''
      // for (let i = 0; i < dataList.length; i++) {
      //   if (dataList[i].select == true) {
      //     str += dataList[i].cartid + ','
      //   }
      // }
      // if (str.length > 0) {
      //   str = str.substr(0, str.length - 1);
      // }
      wx.navigateTo({
        url: '/pages/shopping-cart/order-detail/order-detail?cartIds=' + str
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  goodDetails(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
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