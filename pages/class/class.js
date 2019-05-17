// pages/class/class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    goodsItem: [],
    category: [{
      menuName: '全部分类'
    },
    {
      menuName: '全部分类'
    },
      {
        menuName: '全部分类'
      }, {
        menuName: '全部分类'
      },
      {
        menuName: '全部分类'
      }],
    tabSelected: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'https://xianfengapp.gomoretech.com/newretail/api/mall/product/store/getMenuProduct?storeId=31310086&business=RETAIL',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res.data, '55')
        that.setData({
          category: res.data.data,
          goodsItem: res.data.data[0].products
        })
        console.log(res.data.data[0].products)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  clickCategory: function (e) {
    this.setData({
      tabSelected: e.currentTarget.dataset.idx,
      isScrollTo: !0
    });
  },
  tapClassify: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    if (id === that.data.classifyViewed) {
      that.setData({
        scrolltop: 0,
      })
    } else {
      that.setData({
        classifyViewed: id,
      });
      console.log('id:', that.data.classifyViewed)
      for (var i = 0; i < that.data.categories.length; i++) {
        if (id === that.data.categories[i].id) {
          that.setData({
            page: 1,
            scrolltop: 0,
            goodsListCurrent: that.data.goodsList[i]
          })
        }
      }
    }
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