// pages/result/result.js
const { $Toast } = require('../../common/iview/dist/base/index');
const app = getApp()
var api = require('../../utils/api.js');
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'您以提交相关资料，正在提交审核',
    resultTitle:'居住证',
    resultStr1:'相关资料以提交',
    resultStr2:'审核为5个工作日内',
    resultStr3:'',
    resultStr4:'', 
    statusStr:"正在审核",
    status:'',
    
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    utils.request(api.getStatus,{openid:app.globalData.openid,replaceCode:app.globalData.replaceCode}).then(function(res){
      console.log(res);
      if(res.code == 200){
        that.setData({
          status:res.msg
        })
        console.log(res.msg)
        if(res.msg == 5){
          that.setData({
            title:"您已提交相关资料，审核驳回",
            resultStr1:'相关申请资料',
            resultStr2:"【需要重新填写提交】",
            statusStr:"审核驳回"
          })
        }else if(res.msg  == 6){

          that.setData({
            title:"您已提交相关资料，审核通过",
            resultTitle:'~恭喜您~',
            resultStr1:'您的居住证',
            resultStr2:"已顺利审核通过",
            resultStr3:'请前往指定地点领取',
            statusStr:"审核已通过！"
          })
        }else if(res.msg  == 7){

          that.setData({
           
            resultStr1:'您的居住信息',
            resultStr2:"账户已注销",
            resultStr3:'请联系工作人员',
            statusStr:"账户已注销！"
          })
        }
      }
    })

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

  },
  gotoPage:function(e){
    if(this.data.status == 5){
      wx.reLaunch ({
        url:"/pages/apply/apply",
      })
    }else if(this.data.status == 6){
      wx.reLaunch ({
        url: "/pages/mycard/mycard",
      })
    }else{
      wx.reLaunch ({
        url: "/pages/index/index",
      })
    }
  }
})