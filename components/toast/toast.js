// components/toast/toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dataText: '',
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog(data) {
      this.setData({
        isShow: !this.data.isShow,
        dataText: data
      })
      var _this = this
      // 定时器关闭  
      setTimeout(function () {
        _this.hideDialog()
      }, 1000);
    }
  }
})
