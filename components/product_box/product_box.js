// components/product_box/product_box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          pList: newVal
        })
      }
    },
    sHeight: {
      type: Number,
      value: 0
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    product_detail: function (e) {
      var _id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  }
})
