//index.js
//获取应用实例
const app = getApp()
var utils = require("../../utils/util.js");
var api = require("../../utils/api.js");
const { $Toast } = require('../../common/iview/dist/base/index');
import Dialog from '../../common/module/weapp/dist/dialog/dialog';

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    isLogin: 0,
    isread: false,
    status: null,
    visible2: false,
    show: false,
    isApplyCard: '',
    helpStatus: null,
    isTap:false,
    shipArray: [
      {
        replaceCode: 1,
        name: '父亲',
        icon: 'noselect',
      },
      {
        replaceCode: 2,
        name: '母亲',
        icon: 'noselect'
      },
      {
        replaceCode: 3,
        name: '儿子',
        icon: 'noselect'
      },
      {
        replaceCode: 4,
        name: '女儿',
        icon: 'noselect'
      },
      // {
      //   name: '祖父',
      // },
      // {
      //   name: '祖母',
      // },
      // {
      //   name: '外祖父',
      // },
      // {
      //   name: '外祖母',
      // },
      {
        replaceCode: 5,
        name: '其他',
        icon: 'noselect'
      }
    ],
    current:'',
    isAuth:false
  },


  onLoad: function () {

  },

  onShow: function () {
    if (app.globalData.isLogin) {
      this.setData({
        isLogin: 1
      })
    }
    // console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true 
      })
      let that = this;
      utils.request(api.isAuth, { openid: app.globalData.openid }).then(function (res) {
        if (res.code == 200) {
          app.globalData.isLogin = true;
          that.setData({
            isAuth:true
          })

        } else {
          app.globalData.isLogin = false;
          that.setData({
            isAuth:false
          })
        }
      })

    }
    app.globalData.replaceCode = 0;
    let that = this;
    that.setData({
      isTap:false
  });
    utils.request(api.getStatus, { openid: app.globalData.openid, replaceCode: app.globalData.replaceCode }).then(function (res) {

      if (res.code == 200) {
        that.setData({
          status: res.msg
        })
      } else {
        that.setData({
          status: 0
        })
      }
    })
  },
  getUserInfo: function (e) {
    let that = this;
    wx.login({
      success: function (res) {

        if (res.code) {
          utils.request(api.auth, {
            code: res.code
          }).then(function (res) {
            if (res.code == 200) {
              app.globalData.openid = res.data.openid
              app.globalData.unionid = res.data.unionid
              wx.setStorageSync('openid', res.data.openid);
              wx.setStorageSync('unionid', res.data.unionid);
              wx.getUserInfo({
                success: res => {
                  wx.setStorageSync('userInfo', res.userInfo);
                  app.globalData.userInfo = res.userInfo
                  var strName = utils.utf16toEntities(res.userInfo.nickName);
                  var tmp = res.userInfo;
                  tmp.nickName = strName;
                  // 保存用户信息到服务端
                  // console.log(JSON.stringify(tmp))
                  // console.log(app.globalData.openid)
                  utils.request(api.updateUserInfo, {
                    userinfo: JSON.stringify(tmp),
                    openid: app.globalData.openid
                  }).then(function (res) {
                    if (res.code == 200) {
                      $Toast({
                        content: '登录成功',
                        type: 'success'
                      });
                      that.onShow();
                      // setTimeout(function () {
                      //   wx.redirectTo({
                      //     url: '/pages/userInfo/userInfo'
                      //   }), 2000
                      // })
                    } else {
                      $Toast({
                        content: '登录失败',
                        type: 'fail'
                      });
                      return;
                    }
                  })
                }
              })
            }
          });
        } else {

        }
      }
    })
  },

  gotoRead: function (e) {
    wx.navigateTo({
      url: '/pages/xuzhi/xuzhi',
    })
  },

  onIsreadChange: function (e) {
    this.setData({
      isread: e.detail
    });
  },
  gotoMycard: function (e) {
    let that = this;
    app.globalData.replaceCode = 0;
    that.getAscyStatus()
    if (app.globalData.isLogin == false) {
      wx.redirectTo({
        url: '../mycard/mycard',
      })

    } else {
      this.setData({
        isTap:true
    });
      // if(that.data.isread == false){
      //   $Toast({
      //     content: '请勾选我已阅读居住办理须知！',
      //     type: 'warning'
      //   });
      //   return;
      // }
      utils.request(api.isRegister, { unionid: app.globalData.unionid }).then(function (res) {

        if (res.code == 200) {
          wx.navigateTo({
            url: '../mycard/mycard',
          })
        } else if (res.code == 501) {
          wx.navigateTo({
            url: '/pages/webPage/web',
          })
        }
      })
    }
  },
  gotoApplycard: function (e) {
    let that = this;
    app.globalData.replaceCode = 0;
    if (app.globalData.isLogin == false) {
      wx.redirectTo({
        url: '../apply/apply',
      })
    } else {

      if (that.data.isread == false) {
        $Toast({
          content: '请勾选我已阅读居住办理须知！',
          type: 'warning'
        });
        return;
      }
      this.setData({
        isTap:true
    });
      if (that.data.status == 6) {
        $Toast({
          content: '您已申请成功，请点击我的居住证进行查看！',
          type: 'warning'
        });
        that.setData({
          isTap:false
        })
        return;
      } else if (that.data.status == 4) {
        Dialog.confirm({
          title: '提示',
          message: '您有正在申请中的居住证，是否继续申请?'
        }).then((res) => {
          // on confirm
          utils.request(api.isRegister, { unionid: app.globalData.unionid }).then(function (res) {
            if (res.code == 200) {
              wx.navigateTo({
                url: '../apply/apply',
              })
            } else if (res.code == 501) {

              $Toast({
                content: '您没有注册市民卡信息或市民卡信息有缺失，请完成信息注册后再打开居住证申领小程序进行申领！',
                type: 'warning'
              });

              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/webPage/web',
                })
              }, 2000);
            }
          })
        }).catch(() => {
          // on cancel
          that.setData({
            isTap:false
          })
          return;
        });
      } else if (that.data.status == 5) {
        // on confirm
        utils.request(api.isRegister, { unionid: app.globalData.unionid }).then(function (res) {
          if (res.code == 200) {
            wx.navigateTo({
              url: '../apply/apply',
            })
          } else if (res.code == 501) {

            $Toast({
              content: '您没有注册市民卡信息或市民卡信息有缺失，请完成信息注册后再打开居住证申领小程序进行申领！',
              type: 'warning'
            });
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/webPage/web',
              })
            }, 2000);
          }
        })
      } else {
        utils.request(api.isRegister, { unionid: app.globalData.unionid }).then(function (res) {
          if (res.code == 200) {
            app.globalData.replaceCode = 0;
            wx.navigateTo({
              url: '../apply/apply',
            })
          } else if (res.code == 501) {

            $Toast({
              content: '您没有注册市民卡信息或市民卡信息有缺失，请完成信息注册后再打开居住证申领小程序进行申领！',
              type: 'warning'
            });

            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/webPage/web',
              })
            }, 2000);
          }
        })
      }
    }
  },
  gotoHelpApplycard: function (e) {
    let that = this;

    that.getAscyStatus()
    if (app.globalData.isLogin == false) {
      wx.redirectTo({
        url: '../apply/apply',
      })
    } else {
      if (that.data.isread == false) {
        $Toast({
          content: '请勾选我已阅读居住办理须知！',
          type: 'warning'
        });
        return;
      }
      that.setData({
        show: true,
        isApplyCard: true,
        isTap:true
      })
    }

  },
  handleClick(e) {
      this.setData({
          current: e.detail.value
      });
  },
  bindTapOk:function() {
    let that = this;
    var tmpReplaceCode = null;
    that.data.shipArray.forEach(element => {
      if (element.name == that.data.current) {
        tmpReplaceCode = element.replaceCode;
        app.globalData.replaceCode = element.replaceCode;
      }
    });
    setTimeout(() => {
      that.setData({
        show: false
      })
      utils.request(api.getStatus, { openid: app.globalData.openid, replaceCode: tmpReplaceCode }).then(function (res) {

        if (res.code == 200) {
          that.setData({
            helpStatus: res.msg
          })
        } else {
          that.setData({
            helpStatus: 0
          })
        }
        if (that.data.isApplyCard) {
          if (that.data.helpStatus == 6) {
            $Toast({
              content: '您已申请成功，请点击我的居住证进行查看！',
              type: 'warning'
            });
            that.setData({
              isTap:false
            })
            return;
          } else if (that.data.helpStatus == 4) {
            Dialog.confirm({
              title: '提示',
              message: '您有正在申请中的居住证，是否继续申请?'
            }).then((res) => {
              wx.navigateTo({
                url: '../apply/apply',
              })
            })
          } else {
            wx.navigateTo({
              url: '../apply/apply',
            })
          }
        } else {
          wx.navigateTo({
            url: '../mycard/mycard',
          })
        }
      }, 100);
    })
    
  },
  bindTapCancle:function(){
    this.setData({
      show: false,
      isTap:false
  });
  },

  gotoMyHelpcard: function () {
    let that = this;
    that.getAscyStatus()
    if (app.globalData.isLogin == false) {
      wx.redirectTo({
        url: '../apply/apply',
      })
    } else {
      if (that.data.isread == false) {
        $Toast({
          content: '请勾选我已阅读居住办理须知！',
          type: 'warning'
        });
        return;
      }
      that.setData({
        show: true,
        isApplyCard: false,
        isTap:false
      })
    }
  },

  // handleClick1({ detail }) {
  //   this.data.shipArray.forEach(element => {
  //     if (element.name == this.data.shipArray[detail.index]['name']) {
  //       element.icon = "select"
  //     } else {
  //       element.icon = "noselect"
  //     }
  //   });
  //   this.setData({
  //     shipArray: this.data.shipArray
  //   })
  //   setTimeout(() => {
  //     this.setData({
  //       show: false
  //     })
  //     app.globalData.replaceCode = detail.index + 1
  //     wx.navigateTo({
  //       url: '../mycard/mycard',
  //     })
  //   }, 500);

  // },

  getAscyStatus: function () {
    let that = this;
    utils.request(api.getStatus, { openid: app.globalData.openid, replaceCode: app.globalData.replaceCode }).then(function (res) {

      if (res.code == 200) {
        that.setData({
          status: res.msg
        })
      } else {
        that.setData({
          status: 0
        })
      }
    })
  },
  /**
   * 是否登录
   */
  isLogin: () => {
    return app.globalData.userInfo == null ? false : true;
  },
  onShareAppMessage: function () {
    return {
      title: "居住证线上办理",
      path: '/pages/index/index',
    }
  }
})
