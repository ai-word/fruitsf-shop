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
    allShopList: [],//选择的货物      
    hintText: '',//提示的内容      
    hintShow: false,//是否显示提示
    checkedAll: true,
    allShopList: []
  },
  getAllCartList() {
    let that = this
    Http.HttpRequst(true, '/cart/getAllCarts', true, '', '', 'post', false, function (res) {
      that.setData({
        shopCartList: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllCartList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //点击全选  
  checkboxAllChange: function () {
    let shopcar = this.data.shopCartList,
      allChecked = !this.data.allChecked,//点击全选后allChecked变化
      totalPrice = 0;
    for (let i = 0, len = shopcar.length; i < len; i++) {
      shopcar[i].select = allChecked;//所有商品的选中状态和allChecked值一样
      if (allChecked) {//如果为选中状态则计算商品的价格
        totalPrice += shopcar[i].price * shopcar[i].num;
      }
    }
    this.data.allShopList = allChecked ? shopcar : [];//如果选中状态为true那么所有商品为选中状态，将物品加入选中变量，否则为空    
    this.setData({
      allChecked: allChecked,
      shopCartList: shopcar,
      totalPrice: totalPrice,
      allShopList: this.data.allShopList
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  //点击单个选择按钮  
  checkTap: function (e) {
    console.log(this.data.allShopList, '555')
    let Index = e.currentTarget.dataset.index,
      shopcar = this.data.shopCartList,
      totalPrice = this.data.totalPrice,
      allShopList = this.data.allShopList;
    shopcar[Index].select = !shopcar[Index].select || false;
    if (shopcar[Index].select) {
      totalPrice += shopcar[Index].product_amount * shopcar[Index].price;
      // allShopList.push(shopcar[Index]);
      allShopList[Index].select = true
    } else {
      totalPrice -= shopcar[Index].product_amount * shopcar[Index].price;
      allShopList[Index].select = false
    }
    this.setData({
      shopCartList: shopcar,
      totalPrice: totalPrice,
      allShopList: allShopList
    });
    this.judgmentAll();//每次按钮点击后都判断是否满足全选的条件  
  },
    //点击加减按钮  
  numchangeTap: function (e) {
    let Index = e.currentTarget.dataset.index,//点击的商品下标值        
      shopcar = this.data.shopCartList,
      types = e.currentTarget.dataset.types,//是加号还是减号        
      totalPrice = this.data.totalPrice;//总计    
    switch (types) {
      case 'add':
        shopcar[Index].product_amount++;//对应商品的数量+1      
        shopcar[Index].select && (totalPrice += parseInt(shopcar[Index].price));//如果商品为选中的，则合计价格+商品单价      
        break;
      case 'minus':
        shopcar[Index].product_amount--;//对应商品的数量-1      
        shopcar[Index].select && (totalPrice -= parseInt(shopcar[Index].price));//如果商品为选中的，则合计价格-商品单价      
        break;
    }
    this.setData({
      shopCartList: shopcar,
      totalPrice: totalPrice
    });
  },
  onShow: function () {
    var shopcarData = app.globalData.shopcarData,//这里我是把购物车的数据放到app.js里的，这里取出来，开发的时候视情况加载自己的数据
      totalPrice = 0,
      allShopList = this.data.allShopList;
    for (let i = 0, len = shopcarData.length; i < len; i++) {//这里是对选中的商品的价格进行总结 
      if (shopcarData[i].select) {
        totalPrice += shopcarData[i].product_amount * shopcarData[i].price;
        allShopList.push(shopcarData[i]);
      }
    }
    this.setData({
      shopCartList: shopcarData,
      totalPrice: totalPrice,
      allShopList: allShopList
    });
    this.judgmentAll();//判断是否全选  
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
      allChecked: lenIndex == shoplen//如果购物车选中的个数和购物车里货物的总数相同，则为全选，反之为未全选    
    });
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