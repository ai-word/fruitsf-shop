// pages/total-revenue/revenue.j
import F2 from '../../components/f2-canvas/lib/f2';
// const F2 = require('@antv/f2/lib/index'); // 引入 F2
// require('@antv/f2/lib/interaction/pan'); // 引入图表平移交互
let chart = null;
let chart1 = null
const Http = require('../../utils/request.js');
const app = getApp();
var revenue = []
var addNum = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    activeIndex: '-1',
    years: ['2019', '2020', '2021','2022','2023'],
    year: '2019',
    revenue: [],
    addNum:[],
    income: {
      onInit: function (canvas, width, height) {
        const data = revenue
        const chart = new F2.Chart({
          el: canvas,
          width,
          height
        });
 

        chart.source(data, {
          sales: {
            tickCount: 5
          }
        });
        chart.tooltip({
          showItemMarker: false,
          onShow(ev) {
            const { items } = ev;
            items[0].name = null;
            items[0].name = items[0].title;
            items[0].value = '¥ ' + items[0].value;
          }
        });

        chart.interval().position('month*money').color('#BFF1CF');

        chart.render();

        // 绘制柱状图文本
        var offset = -5;
        var canvas = chart.get('canvas');
        var group = canvas.addGroup();
        var shapes = {};
        data.map(function (obj) {
          var point = chart.getPosition(obj);
          var text = group.addShape('text', {
            attrs: {
              x: point.x,
              y: point.y + offset,
              text: obj.money,
              textAlign: 'center',
              textBaseline: 'bottom',
              fill: '#212121'
            }
          });

          shapes[obj.month] = text; // 缓存该 shape, 便于后续查找
        });
        return chart;
      }
    },
    expenditure: {
      onInit: function (canvas, width, height) {
        // const data = [
        //   { year: '1月', sales: 38 },
        //   { year: '2月', sales: 52 },
        //   { year: '3月', sales: 61 },
        //   { year: '4月', sales: 145 },
        //   { year: '5月', sales: 145 },
        //   { year: '6月', sales: 48 },
        //   { year: '7月', sales: 38 },
        //   { year: '8月', sales: 38 },
        //   { year: '9月', sales: 38 },
        //   { year: '10月', sales: 38 },
        //   { year: '11月', sales: 38 },
        //   { year: '12月', sales: 38 },
        // ];
        const data = addNum
        console.log(addNum,'addNum')
        console.log(addNum,'addNum')
        const chart1 = new F2.Chart({
          el: canvas,
          width,
          height
        });


        chart1.source(data, {
          sales: {
            tickCount: 5
          }
        });
        chart1.tooltip({
          showItemMarker: false,
          onShow(ev) {
            const { items } = ev;
            items[0].name = null;
            items[0].name = items[0].title;
            items[0].value = '¥ ' + items[0].value;
          }
        });

        chart1.interval().position('month*num').color('#8EBCF3');

        chart1.render();

        // 绘制柱状图文本
        var offset = -5;
        var canvas = chart1.get('canvas');
        var group = canvas.addGroup();
        var shapes = {};
        data.map(function (obj) {
          var point = chart1.getPosition(obj);
          var text = group.addShape('text', {
            attrs: {
              x: point.x,
              y: point.y + offset,
              text: obj.num,
              textAlign: 'center',
              textBaseline: 'bottom',
              fill: '#212121'
            }
          });

          shapes[obj.month] = text; // 缓存该 shape, 便于后续查找
        });
        return chart1;
      }
    },
  },
  translate: function () {
    this.setData({
      isShow: this.data.isShow == true ? false : true
    })
    // this.animation.translate(0, 0).step()
    // this.setData({ animation: this.animation.export() })
  },

  success: function () {
    this.setData({
      isRuleTrue: false
    })
    this.animation.translate(0, 0).step()
    this.setData({ animation: this.animation.export() })
  },
  tryDriver: function () {
    this.setData({
      background: "#89dcf8"
    })
  },
  activeClick(e){
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      year: e.currentTarget.dataset.years
    })
    this.getStaticByYear()
    this.getStaticAward()
    this.getStaticsNumber()
  },
  getStaticByYear() {
    let that = this
    Http.HttpRequst(false, '/wallet/getStaticByYear?year=' + that.data.year, false, '', '', 'get', false, function (res) {
      if(res.state == 'ok') {
        that.setData({
          money: res.data.money,
          num: res.data.num,
          membernum: res.data.membernum
        })
      }
    })
  },
  // 根据年度，统计月收益金额
  getStaticAward() {
    let that = this
    Http.HttpRequst(false, '/wallet/getStaticAward?year=' + that.data.year, false, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        revenue = res.data
        that.setData({
          revenue: res.data
        })
        that.ecComponent.init(that.data.income)
      }
    })
  },
  // 根据年度，统计月增加用户数
  getStaticsNumber() {
    let that = this
    Http.HttpRequst(false, '/wallet/staticsNumber?year=' + that.data.year, false, '', '', 'get', false, function (res) {
      if (res.state == 'ok') {
        addNum = res.data
        that.setData({
          addNum: res.data
        })
        that.expenditureId.init(that.data.expenditure)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ecComponent = this.selectComponent('#column-dom')
    this.expenditureId = this.selectComponent('#expenditure')
    this.getStaticByYear()
    this.getStaticAward()
    this.getStaticsNumber()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation()
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