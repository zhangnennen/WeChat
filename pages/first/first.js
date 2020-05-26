// pages/first/first.js
const app = getApp()
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const tem_id = 'VGxyNYhcvTdgeURMNZc0Gd5_a-aEw4SyosFLOfChWUo';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    senduserid: 3,
    character_string1: "",
    isString1: true,
    character_string4: '',
    isString4: true,
    thing2: "",
    isThing2: true,
    thing3: "",
    isThing3: true,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.userInfo)
    this.setData({
      senduserid: app.globalData.userInfo.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  getmsg: function() {
    let that = this;

    let formdata = {
      'character_string1': {
        'value': that.data.character_string1
      },
      'thing2': {
        'value': that.data.thing2
      },
      'character_string4': {
        'value': that.data.character_string4
      },
      'thing3': {
        'value': that.data.thing3
      }
    };
    console.log("用户id:");
    console.log(that.data.senduserid);
    var msgdata = {
      id: that.data.senduserid,
      page: "/pages/msg/msg",
      template_id: tem_id,
      data: formdata
    };
    wx.requestSubscribeMessage({
      tmplIds: [tem_id],
      success(res) {
        if (res[tem_id] == 'accept') {
          //用户同意了订阅，允许订阅消息
          util.request(api.sendmsg, msgdata).then(function(res) {
            console.log(res);
          })
        } else {
          //用户拒绝了订阅，禁用订阅消息
          wx.showToast({
            title: '订阅失败'
          })
        }
      },
      fail(res) {
        console.log(res)
      },
      complete(res) {
        console.log(res)
      }
    })
  },

  inpBlurCode: function(e) {
   
  },
  inptCode: function(e) {
    this.setData({
      isString1: e.detail.value.trim() == "" ? false : true 
    })
    console.log(this.data.isString1)
    this.setData({
      character_string1: e.detail.value
    })
  },
  inptName: function(e) {
    console.log();
    this.setData({
      thing2: e.detail.value
    })
  },
  inptPostCode: function(e) {
    console.log();
    this.setData({
      character_string4: e.detail.value

    })
  },
  inptPostC: function(e) {
    console.log();
    this.setData({
      thing3: e.detail.value

    })
  }

})