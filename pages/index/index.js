// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSwiper: 0,
    autoplay: true,
    banner: [
      {
        "id": "1125915891812581378",
        "pictureUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190508/89640ecbf8744e9991cf56bf7fe90681.jpg",
        "bannerType": "HOME",
        "pictureId": "1125915883180703746"
      },
      {
        "bannerType": "HOME",
        "id": "1123146750600994818",
        "pictureUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190430/45d08ae9311946f18c54c4042cf81e77.jpg",
        "productId": "1121340374883020801",
        "pictureId": "1123146458836815873",
        "linkType": "PRODUCT"
      },
      {
        "pictureId": "1125577180411457537",
        "id": "1121614701859819521",
        "linkType": "URL",
        "orderNum": 2,
        "link": "https://xianfengapp.gomoretech.com/newretail-admin/#/advertShow?id=1120949662920339458",
        "pictureUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190507/765576150e37473b8cca0dcf784abb1f.jpg",
        "bannerType": "HOME"
      },
      {
        "pictureId": "1119156293718040578",
        "id": "1115523389905498113",
        "linkType": "URL",
        "orderNum": 4,
        "link": "https://xianfengapp.gomoretech.com/newretail-admin/#/advertShow?id=1116605312237121538",
        "pictureUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190419/36e86a922c334a558016ca2dde57f8c1.jpg",
        "bannerType": "HOME"
      }
    ],
    tag: [
      {
        "height": 300,
        "orderNumber": 0,
        "id": "1098021366205296641",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/3038ba31e5b046c29757f30950cc0cfe.png",
        "type": "JIN_GANG",
        "linkModel": "grab_activity"
      },
      {
        "height": 300,
        "orderNumber": 1,
        "id": "1098021366222073858",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/6887d9ff272a4d98ab601dd3c6880508.png",
        "type": "JIN_GANG",
        "linkModel": "invite_member"
      },
      {
        "height": 300,
        "orderNumber": 2,
        "id": "1098021366230462466",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/a774c335ad6243fcb52aa87c44fa28fa.png",
        "type": "JIN_GANG",
        "linkModel": "teambuying_activity"
      },
      {
        "height": 300,
        "orderNumber": 3,
        "id": "1098021366243045378",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/95056367fd8041c9857ff71946b70267.png",
        "type": "JIN_GANG",
        "linkModel": "sign_in"
      },
      {
        "height": 300,
        "orderNumber": 4,
        "id": "1098021366255628290",
        "width": 300,
        "imageUrl": "http://xianfengapp.oss-cn-hangzhou.aliyuncs.com/newretail/20190220/0299e95ba38747dca0f4431958255ae3.png",
        "type": "JIN_GANG",
        "linkModel": "score_mall"
      }
    ],
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    currentSwiper: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
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