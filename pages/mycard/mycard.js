// pages/mycard/mycard.js
const { $Toast } = require('../../common/iview/dist/base/index');
const app = getApp()
var api = require('../../utils/api.js');
var utils = require('../../utils/util.js')

var countTooGetLocation = 0;
var total_micro_second = 0;
var starRun = 0;
var totalSecond  = 0;
var oriMeters = 0.0;
/* 毫秒级倒计时 */
function count_down(that) { 

    if (starRun == 0) {
      return;
    }

    if (countTooGetLocation >= 100) {
      var time = date_format(total_micro_second);
      that.updateTime(time);
    }

  	if (countTooGetLocation >= 5000) { //1000为1s
        that.getLocation();
        countTooGetLocation = 0;
  	}   
    

 setTimeout
  	setTimeout(function(){
		countTooGetLocation += 10;
    total_micro_second += 10;
		count_down(that);
    }
    ,10
    )
}


// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  	// 秒数
  	var second = Math.floor(micro_second / 1000);
  	// 小时位
  	var hr = Math.floor(second / 3600);
  	// 分钟位
  	var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  	// 秒位
	var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;


	return hr + ":" + min + ":" + sec + " ";
}


function getDistance(lat1, lng1, lat2, lng2) { 
    var dis = 0;
    var radLat1 = toRadians(lat1);
    var radLat2 = toRadians(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRadians(lng1) - toRadians(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;

    function toRadians(d) {  return d * Math.PI / 180;}
} 

function fill_zero_prefix(num) {
	return num < 10 ? "0" + num : num
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    sex:'',
    birth:'',
    address:'',
    idCard:'',
    police:'',
    dataTimeStr:'',
    frontImg:'',



    clock: '',
    isLocation:false,
    tglatitude: 41.034591529971784,
    tglongitude: 113.1159231398201, 
    latitude: 0,
    longitude: 0,
    markers: [],
    covers: [],
    meters: 0.00,
    time: "0:00:00",
    callGetPhone: '0474-8211313',
    status:'',
    statusStr:"正在审核",
    phone:'',
    reason:'',
    nation:'',
    policeStation:'',
    householdNum:'',
    authTimeStr:'',
    endauthTimeStr:'',
    photoFront:'',
    birthArray:[],
    height:0,
    width:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
  onShow: function () {
    this.setData({
      height: wx.getSystemInfoSync().screenHeight,
      width:wx.getSystemInfoSync().screenWidth
    })
    console.log(this.data.height)
    console.log(this.data.width)
    if (app.globalData.isLogin == false) {
      $Toast({
        content: '请先登录',
        type: 'warning'
    });
      setTimeout(function () {
        app.globalData.isLogin = true;
        wx.redirectTo({
          url: '/pages/index/index'
        })
      }, 2000)
      return;
    }
    

    let that =this;
    // that.getTgLocation()
    count_down(that);
    utils.request(api.getUserDetail,{openid:app.globalData.openid,replaceCode:app.globalData.replaceCode}).then(function(res){
      if(res.code == 200){
        console.log(res.data);
        that.setData({
          name:res.data.username,
          sex:res.data.sex == 1 ? "男" : "女",
          birth:res.data.birth,

          birthArray:res.data.birth.split('-'),

          phone:res.data.phone,
          idCard:res.data.idcard,
          address:res.data.household,
          householdNum:res.data.householdNum + res.data.liveAddress,
          dataTimeStr:res.data.idcardDate,
          status:res.data.status,
          statusStr:res.data.status == 4?"正在审核！":"审核驳回！",
          reason:res.data.reason,
          nation:res.data.nation,
          policeStation:res.data.policeStation,
          authTimeStr:res.data.authTimeStr,
          photoFront:res.data.idcardTx
          // endauthTimeStr:Number(res.data.authTimeStr)+10000
        })
        var year = Number(that.data.authTimeStr.slice(0,4))+1;
        var newy = year + that.data.authTimeStr.slice(4,that.data.authTimeStr.length);
        that.setData({
          endauthTimeStr:newy
        })
      }
    })
  },

  openLocation:function (){
    var that = this
    console.log(that.data.tglatitude),
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
          wx.openLocation({
            latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
            longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
            scale: 18, // 缩放比例
          })
      },
    })
  },
  openTgLocation: function () {
    wx.vibrateLong();
    let that = this
    wx.openLocation({
      latitude: that.data.tglatitude,
      longitude: that.data.tglongitude,
      scale: 18, // 缩放比例
    })
  },
  starRun :function () {
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    count_down(this);
    this.getLocation();
  },
  stopRun:function () {
    starRun = 0;
    count_down(this);
  },
  updateTime:function (time) {

    var data = this.data;
    data.time = time;
    this.data = data;
    this.setData ({
      time : time,
    })

  },
  getLocation:function () {
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        console.log(res);
        //make datas 
        var newCover = {
            latitude: res.latitude,
            longitude: res.longitude,
          };
        var oriCovers = that.data.covers;
        
        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
          oriCovers.push(newCover);
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len-1];
      

        var newMeters = getDistance(lastCover.latitude,lastCover.longitude,res.latitude,res.longitude)/1000;
        
        if (newMeters < 0.0015){
            newMeters = 0.0;
        }

        oriMeters = oriMeters + newMeters; 

        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);

        oriCovers.push(newCover);
        
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [],
          covers: oriCovers,
          meters:showMeters,
        });
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
    // 拨打电话给收件人
   callGetPhone(e) {
    // 号码
     let telPhone = e.currentTarget.dataset.getphone;
     this.callPhone(telPhone);
   },
  callPhone(phoneNumber) {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function (e) {
        console.log(e)
        console.log("拨打电话失败！")
      }
    })
  },
//****************************
  getTgLocation: function () {
    let that = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        //make datas 
        var newCover = {
          latitude: that.data.tglatitude,
          longitude: that.data.tglongitude,
          iconPath: "/static/images/location_red_blue.png",
        };

        var newMeters = getDistance(newCover.latitude, newCover.longitude, res.latitude, res.longitude) / 1000;
        if (newMeters < 0.0015) {
          newMeters = 0.0;
        }
        var meters = new Number(newMeters);
        var showMeters = meters.toFixed(2);

        var oriCovers = that.data.covers;
        oriCovers.push(newCover);

        that.setData({
          latitude: that.data.tglatitude,//res.latitude,
          longitude: that.data.tglongitude,//res.longitude,
          markers: [],
          covers: oriCovers,
          meters: showMeters,
        });
      },
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "我的居住证",
      path: '/pages/index/index',
    }
  }
})