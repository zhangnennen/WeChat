// pages/bookPage/bookPage.js
const { $Toast } = require('../../common/iview/dist/base/index');
const app = getApp()
var api = require('../../utils/api.js');
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgArray: ['', '', '', '', '', '', '', ''],
    imgId: 0,
    liveId: '',
    isUpLoad: false,
    tmpArray: ['', '', '', '', '', '', '', ''],
    userId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    utils.request(api.getUserDetail, { openid: app.globalData.openid ,replaceCode:app.globalData.replaceCode}).then(function (res) {
      if (res.code == 200  && res.data) {
        that.setData({
          userId:res.data.id,
          liveId: res.data.liveId,
          imgArray: res.data.materials.length == 0 ? ['', '', '', '', '', '', '', ''] : res.data.materials,
          tmpArray: res.data.materials.length == 0 ? ['', '', '', '', '', '', '', ''] : res.data.materials.slice(0, 8)
        })

        that.data.imgArray.forEach(element => {
          if (element != '') {
            that.setData({
              isUpLoad: true
            })
          }
        });
      }
    })
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
  chooseLoadImg: function (e) {
    console.log(e)
    let that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success(resImg) {
        const tempFilePaths = resImg.tempFilePaths[0]
        $Toast({
          content: '正在上传...',
          type: 'loading'
        });
        wx.uploadFile({
          url: api.upload, //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: "img",
          success(res) {
            console.log(res);
            if (res.statusCode == 200) {
              var result = JSON.parse(res.data);
              if (result.code == 200) {
                $Toast.hide();
                console.log(that.data.imgId)
                that.data.imgArray[e.currentTarget.dataset.index] = result.data
                that.data.tmpArray[e.currentTarget.dataset.index] = result.data
                console.log(that.data.imgArray);
                console.log(that.data.tmpArray);
                that.setData({
                  imgArray: that.data.imgArray,
                  tmpArray: that.data.tmpArray.slice(0, 8)
                })
              }
            } else {
              $Toast({
                content: '图片超出5M,请重新选择！',
                type: 'warning'
              });
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
  addMoreArray: function (e) {
    console.log(e)
    let that = this;
    if (that.data.imgArray.length < 8) {
      $Toast({
        content: '请点击上方上传图片！',
        type: 'warning'
      });
    }

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success(resImg) {
        const tempFilePaths = resImg.tempFilePaths[0]

        $Toast({
          content: '正在上传...',
          type: 'loading'
        });
        wx.uploadFile({
          url: api.upload, //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: "img",
          success(res) {

            if (res.statusCode == 200) {
              $Toast.hide()
              var result = JSON.parse(res.data);
              if (result.code == 200) {
                that.data.imgArray.push(result.data)
              }
              $Toast({
                content: '上传成功！',
                type: 'success'
              });
            } else {
              $Toast({
                content: '图片超出5M,请重新选择！',
                type: 'warning'
              });
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
  delArray: function (e) {
    let that = this;
    utils.request(api.uploaddel, { url: that.data.imgArray[e.currentTarget.dataset.index] }).then(function (res) {
      console.log(res);
      if (res.code == 200) {
        that.data.imgArray[e.currentTarget.dataset.index] = ''

        that.setData({
          imgArray: that.data.imgArray
        })
        that.data.imgId -= 1;
      }
    })

  },

  upLoadImg: function (e) {



    let that = this;

    if (that.data.imgArray.length == 0) {
      $Toast({
        content: '请上传资料！',
        type: 'warning'
      });
      return;
    }

    $Toast({
      content: '正在上传...',
      type: 'loading'
    }); 
    console.log(that.data.imgArray)
    utils.request(api.comLiveMater, {
      arrMaters: JSON.stringify(that.data.imgArray),
      liveId: that.data.liveId,
      id:that.data.userId
      // openid: app.globalData.openid
    }).then(function (res) {
      $Toast.hide();
      console.log(res);
      if (res.code == 200) {
        $Toast({
          content: res.msg,
          type: 'success'
        });
        that.setData({
          isUpLoad: true
        })
      } else {
        $Toast({
          content: '上传失败，请重试！',
          type: 'warning'
        });
      }
    })
  },

  // onIsreadChange: function (e) {
  //   this.setData({
  //     isread: e.detail
  //   })
  // },
  gotonext: function (e) {
    if (this.data.isUpLoad == false) {
      $Toast({
        content: '请上传资料！',
        type: 'warning'
      });
      return;
    }
    // if(this.data.isread == false){
    //   $Toast({
    //     content: '请勾选居住办理须知！',
    //     type: 'warning'
    //   });
    //   return;
    // }
    wx.navigateTo({
      url: '/pages/result/result',
    })
  }
})