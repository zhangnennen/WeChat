// pages/apply/apply.js
const { $Toast } = require('../../common/iview/dist/base/index');
const app = getApp()
var api = require('../../utils/api.js');
var utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgFrontUrl: '',
    imgBackUrl: '',
    isFront: false,
    isBack: false,
    idCard: '',
    name: ''
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
    let that =this;
    utils.request(api.getUserDetail,{openid:app.globalData.openid,replaceCode:app.globalData.replaceCode}).then(function(res){
      console.log(res)
      if(res.code == 200 && res.data){
        that.setData({
          idCard:res.data.idcard,
          name:res.data.username,
          imgFrontUrl:res.data.photoFront,
          imgBackUrl:res.data.photoBack,
          isFront:res.data.photoFront ? true :false,
          isBack:res.data.photoBack ? true :false
        })
      }
    })
  },



  upLoadIdCardFront: function (e) {
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

    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(resImg) {

        $Toast({
          content: '上传中，请稍后...',
          type: 'loading'
      });
        console.log(app.globalData.replaceCode)
        const tempFilePaths = resImg.tempFilePaths[0]
        wx.uploadFile({
          url: api.photo, //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: "photo",
          formData: {
            openid: app.globalData.openid,
            replaceCode:app.globalData.replaceCode
          },
          success(res) {
            if (res.statusCode == 200) {

              var result = JSON.parse(res.data);
              console.log(result);
              if (result.code == 200) {
                console.log(result.data);
                if (result.data.type == 'Front') {
                  console.log(result.data)
                  that.setData({
                    idCard: result.data.id,
                    name: result.data.name,
                    imgFrontUrl: result.data.backUrl,
                    isFront: true
                  })
                  console.log(that.data.isFront)
                  $Toast.hide();
                  $Toast({
                    content: '上传成功',
                    type: 'success'
                  });
                } else {
                  $Toast({
                    content: '请拍摄带头像的一面',
                    type: 'warning'
                  });
                }
              // } else if(result.code == 501 && result.data.msg =="not enough market quota hint: [_jDQ08984808]" ){
              //     $Toast.hide();
              //     $Toast({
              //       content: '上传成功',
              //       type: 'success'
              //     });
              } else{
                $Toast({
                  content: result.msg,
                  type: 'error'
                });
              }
            }
          },
          fail(res) {
            console.log(res);
            $Toast({
              content: '上传失败，请重新上传！',
              type: 'warning'
            });
          },
          complete(res) {

          }
        })
      },
      fail(res) {
        if (res.errMsg == "chooseImage:fail cancel") {
          $Toast({
            content: '请选择文件！',
            type: 'warning'
          });
        }
      }
    })
  },

  upLoadIdCardBack: function (e) {
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

    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(resImg) {
        $Toast({
          content: '上传中，请稍后...',
          type: 'loading'
      });
        const tempFilePaths = resImg.tempFilePaths[0]
        wx.uploadFile({
          url: api.photo, //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: "photo",
          formData: {
            openid: app.globalData.openid,
            replaceCode:app.globalData.replaceCode
          },
          success(res) {
            if (res.statusCode == 200) {
              var result = JSON.parse(res.data);
              if (result.code == 200) {
                if (result.data.type == 'Back') {
                  that.setData({
                    imgBackUrl: result.data.backUrl,
                    isBack: true
                  })
                  $Toast.hide();
                  $Toast({
                    content: '上传成功',
                    type: 'success'
                  });
                } else {
                  $Toast({
                    content: '请拍摄带国徽的一面',
                    type: 'warning'
                  });
                }
              } else {
                $Toast({
                  content: '身份证拍摄不完整，请重新拍摄！',
                  type: 'error'
                });
              }
            }
          },
          fail(res) {
            $Toast({
              content: '上传失败，请重新上传！',
              type: 'warning'
            });
          },
          complete(res) {

          }
        })
      },
      fail(res) {
        if (res.errMsg == "chooseImage:fail cancel") {
          $Toast({
            content: '请选择文件！',
            type: 'warning'
          });
        }
      }
    })
  },
  startAuth: function (e) {
    let that = this;

    wx.redirectTo({
      url: '/pages/apply/basic/basic?idCard=' + that.data.idCard + '&name=' + that.data.name,
    })


    wx.startFacialRecognitionVerify({
      name:that.data.name,
      idCardNumber:that.data.idCard,
      checkAliveType:2,
      success(res){
        console.log(res);
        if(res.errCode == 0){
          utils.request(api.wxFace,{
            openid:app.globalData.openid,
            verifyResult:res.verifyResult
          }).then(function(res1){
            if(res1.code == 200){
              wx.redirectTo({
                url: '/pages/apply/basic/basic?idCard=' + that.data.idCard + '&name=' + that.data.name,
              })
            }else{
              $Toast({
                content: '核验失败',
                type: 'warning'
              });
            }
          })
        }
      },
      fail(res){
        $Toast({
          content: res.errmsg,
          type: 'warning'
        });
      }
    })
  },
  gotonext(e) {
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
    if (this.data.isBack && this.data.isFront) {
      this.startAuth();
      // wx.navigateTo({
      //   url: '/pages/face/face?idCard=' + this.data.idCard + '&name=' + this.data.name,
      // })
      // wx.redirectTo({
      //   url: '/pages/face/face',
      // })
    } else {
      $Toast({
        content: '请按要求拍摄',
        type: 'error'
      });
      return;
    }

    // wx.navigateTo({
    //   url: '/pages/face/face',
    // })

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