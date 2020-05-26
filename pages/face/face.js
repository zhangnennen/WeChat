 // pages/face/face.js
const AUTH_MODE = 'facial'
const app = getApp()
var utils = require('../../utils/util.js');
var api = require('../../utils/api.js');
const { $Toast } = require('../../common/iview/dist/base/index');
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    idCard:'',
    name:'',
    isVertify:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if(options.idCard){
    //   this.setData({
    //     idCard:options.idCard,
    //     name:options.name
    //   })
    // }

    // this.ctx = wx.createCameraContext()



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

    let that =this;
    utils.request(api.getUserDetail,{openid:app.globalData.openid,replaceCode:app.globalData.replaceCode}).then(function(res){
      if(res.code == 200 && res.data){
        that.setData({
          idCard:res.data.idcard,
          name:res.data.username,
        })
        if(!that.data.isVertify){

          that.startAuth();
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

  goNext:function(){
    wx.navigateTo({
      url: '/pages/apply/basic/basic',
    })
  },

  startAuth: function (e) {
    let that = this;
    wx.startFacialRecognitionVerify({
      name:this.data.name,
      idCardNumber:that.data.idCard,
      checkAliveType:2,
      success(res){
        if(res.errCode == 0){
          that.setData({
            isVertify:true
          })
          utils.request(api.wxFace,{
            openid:app.globalData.openid,
            verifyResult:res.verifyResult
          }).then(function(res1){
            console.log(res1);
            if(res1.code == 200){

              wx.redirectTo({
                url: '/pages/apply/basic/basic?idCard=' + that.data.idCard + '&name=' + that.data.name,
              })
            }else{
              $Toast({
                content: '核验失败',
                type: 'loading'
              });
            }
          })
        }
      },
      fail(res){
        console.log(res);
      }
    })




    // wx.navigateTo({
    //   url: '/pages/apply/basic/basic?idCard=' + this.data.idCard + '&name=' + this.data.name
    // })
    // return;
    // if (!this.ctx) {
    //   //创建拍照组件
    //   if (wx.createCameraContext()) {
    //     this.ctx = wx.createCameraContext();
    //   } else {
    //     $Toast({
    //       content: '当前微信版本过低，请升级到最新微信版本！',
    //       type: 'error'
    //     });
    //   }
    // }
    // $Toast({
    //   content: '正在认证...',
    //   type: 'loading'
    // });
    // this.ctx.takePhoto({
    //   quality: 'high',
    //   success: (res) => {
    //     wx.uploadFile({
    //       url: api.baiduFace, //仅为示例，非真实的接口地址
    //       filePath: res.tempImagePath,
    //       name: "photo",
    //       formData: {
    //         openid: app.globalData.openid
    //       },
    //       success(res) {
    //         if (res.statusCode == 200) {
    //           var result = JSON.parse(res.data);
    //           console.log(result);
    //           if (result.code == 200) {
    //             console.log(result.data);
    //             $Toast({
    //               content: '认证通过！',
    //               type: 'success'
    //             });
    //             wx.redirectTo({
    //               url: '/pages/apply/basic/basic?idCard=' + this.data.idCard + '&name=' + this.data.name,
    //             })

    //           } else if (result.code == 501) {
    //             $Toast({
    //               content: "认证失败，请重试",
    //               type: 'error'
    //             });
    //           }
    //         }
    //       },
    //       fail(res) {
    //         console.log(res);
    //         $Toast({
    //           content: '请重新认证！',
    //           type: 'warning'
    //         });
    //       },
    //       complete(res) {

    //       }
    //     })
    //   },
    //   fail: (res) => {
    //     console.log(res);
    //   }
    // })
    
  },
  error: function () {
    wx.showModal({
      title: '警告',
      content: '若不授权使用摄像头，将无法使用拍照识别功能！',
      cancelText: '不授权',
      cancelColor: '#1ba9ba',
      confirmText: '授权',
      confirmColor: '#1ba9ba',
      success(res) {
        //允许打开授权页面
        if (res.confirm) {
          //调起客户端小程序设置界面，返回用户设置的操作结果
          wx.openSetting({
            success(res) {
              res.authSetting = {
                "scope.camera": true
              }
              wx.redirectTo({
                url: '/pages/face/face',
              })
            },
            fail(err) {
              console.log('err', err);
            }
          })
        } else if (res.cancel) {//拒绝打开授权页面
          wx.redirectTo({
            url: '/pages/apply/apply',
          })
        }
      }
    })
  }
})