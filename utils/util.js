const Http = require('request.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//将日期转换为秒数
const strToTime = function(date_str){
  date_str = date_str.replace(new RegExp("-","gm"),"/");
  var time = new Date(date_str).getTime();
  return time / 1000;
}
/**
 * 返回和当前时间的差值
 */
const getTimeNowgap = function(check_time){
  var now = new Date().getTime();
  return (check_time - now / 1000);
}
/**
 * 将秒格式化为时分秒
 */
const parseTimeToDay = (time)=>{
  let obj = {};
  if(time > 0){
    let day = parseInt(time / (60 * 60 * 24));
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    obj = {
      day: timeFormat(day),
      hou: timeFormat(hou),
      min: timeFormat(min),
      sec: timeFormat(sec)
    }
  }else{
    obj = {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    }
  }
  return obj;
}
const timeFormat = (param)=>{
  return param < 10 ? '0' + param : param;
}
//添加商品到购物车
const addShopCart = function(shop_id,shop_price,callback = null){
  let params = {
    productId: shop_id, //商品id
    productaAmount: 1, //商品数量
    price: shop_price //商品单价
  }
  Http.HttpRequst(true, '/cart/save', true, '', params, 'post', false, function (res) {
    console.log(res, '5555')
    var num = wx.getStorageSync('cartNum')
    wx.setStorageSync('cartNum', parseInt(1 + num))
    wx.setTabBarBadge({
      index: 3,
      text: "" + parseInt(1 + num) + ""
    })
    if(callback){
      callback();
    }
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}





module.exports = {
  formatTime: formatTime,
  strToTime: strToTime,
  getTimeNowgap: getTimeNowgap,
  addShopCart: addShopCart,
  parseTimeToDay: parseTimeToDay,
  timeFormat: timeFormat
}
