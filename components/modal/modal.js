// components/modal/modal.js
Component({
  properties: {
    multiline: {
      type: Boolean,
      value: false
    },
    userList: {
      type: Array,
      value: ''
    },
    groupsNum: {
      type: Number,
      value: ''  
    },
    gold: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    }
  },

  data: {
    modalBottom: '',
    modalHeight: '',
    text: '',
    shadowAnimation: 'shadowDisplay',
    modalAnimation: 'modalDisplay',
    shadowOpacity: '0.65',
    modalOpacity: '1',
    tag: ["5", '10', "15", "20", "60"],
    currentItem: -1,
    isShow: false
  },

  attached: function () {
    var res = wx.getSystemInfoSync()

    this.setData({
      modalBottom:250,
      // modalHeight: 189
    })
  },

  methods: {
    // 监听用户输入
    onInput: function (e) {
      this.setData({
        text: e.detail.value
      })
    },
    tagClick: function (e) {
      console.log(e)
      var that = this
      that.setData({
        text: e.currentTarget.dataset.text,
        isShow: false,
        currentItem: e.currentTarget.dataset.index,
      })
    },
    // 隐藏输入框
    hideInputBox: function () {
      this.setData({
        shadowAnimation: 'shadowHide',
        modalAnimation: 'modalHide',
        shadowOpacity: '0',
        modalOpacity: '0'
      })
    },
    onCancelTap: function () {
      var that = this
      this.hideInputBox()
      console.log('444')
      setTimeout(function () {
        that.triggerEvent('inputCancel')
      }, 350)
    },

    onConfirmTap: function () {
      var that = this
      // this.hideInputBox()

      setTimeout(function () {
        that.triggerEvent('inputConfirm', that.data.text)
      }, 350)
    },
    custom: function () {
      this.setData({
        isShow: true,
        currentItem: '-1',
      })
    },
    // 捕获背景的点击事件以防止冒泡
    tapCatcher: function () { },
    getValue: function (e) {
      this.setData({
        text: e.detail.value
      })
    }
  }
})