//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    this.globalData.userInfo = wx.getStorageSync('userInfo');
    this.globalData.openid = wx.getStorageSync('openid');
    this.globalData.unionid = wx.getStorageSync('unionid');
  },
  globalData: {
    userInfo: null,
    isLogin: false,
    openid: null,
    unionid:null,
    replaceCode:0,
  }
})