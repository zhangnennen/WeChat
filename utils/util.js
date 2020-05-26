
const formatDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = (date, stemp) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join(stemp);
}



const formatTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function dateDiff(startDate, endDate, isSplit) {
  var start_date = new Date(startDate.replace(/-/g, "/"));
  var end_date = new Date(endDate.replace(/-/g, "/"));
  //时间差的毫秒数
  var dateDiff = end_date.getTime() - start_date.getTime();
  //计算出相差天数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));

  //计算天数后剩余的毫秒数
  var leave1 = dateDiff % (24 * 3600 * 1000);

  //计算出小时数
  var hours = Math.floor(leave1 / (3600 * 1000));

  //计算相差分钟数
  //计算小时数后剩余的毫秒数
  var leave2 = leave1 % (3600 * 1000)
  //计算相差分钟数
  var minutes = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数
  var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)

  return isSplit ? { day: dayDiff <= 0 ? "" : dayDiff + " 天", time: hours + ":" + minutes + ":" + seconds } : dayDiff <= 0 ? "" : dayDiff + " 天" + hours + ":" + minutes + ":" + seconds;
}

function dayDiff(startDate, endDate, isSplit) {
  var start_date = new Date(startDate.replace(/-/g, "/"));
  var end_date = new Date(endDate.replace(/-/g, "/"));
  var dateDiff = end_date.getTime() - start_date.getTime();
  //计算出相差天数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));

  return isSplit ? { day: dayDiff <= 0 ? "" : dayDiff} : dayDiff <= 0 ? "" : dayDiff;
}


// function formatTime(date) {
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()

//   var hour = date.getHours()
//   var minute = date.getMinutes()
//   var second = date.getSeconds()


//   return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// function formatNumber(n) {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

/**
 * 封装微信的的request
 */
function request(url, data = {}, method = "POST") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}


function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}


function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/error.png'
  })
}

function showRightToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/Smile.png'
  })
}

function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

function utf16toEntities(str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
  return str.replace(patt, function (char) {
    var H, L, code;
    if (char.length === 2) {
      H = char.charCodeAt(0); // 取出高位  
      L = char.charCodeAt(1); // 取出低位  
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
      return "&#" + code + ";";
    } else {
      return char;
    }
  });
}

//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
function entitiesToUtf16(str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800;
    let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00;
    return String.fromCharCode(H, L);
  });
}


function ValidatePhone(val) {
  var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;//手机号码
  var isMob = /^0?1[3|4|5|8][0-9]\d{8}$/;// 座机格式
  if (isMob.test(val) || isPhone.test(val)) {
    return true;
  }
  else {
    return false;
  }
}


function idCardNoUtil(val) {
  if (checkCode(val)) {
    var date = val.substring(6, 14);
    if (checkDate(date)) {
      if (checkProv(val.substring(0, 2))) {
        return true;
      }
    }
  }
  return false;
}

//省级地址码校验
var checkProv = function (val) {
  var pattern = /^[1-9][0-9]/;
  var provs = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门" };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true;
    }
  }
  return false;
}
//出生日期码校验
var checkDate = function (val) {
  var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(val)) {
    var year = val.substring(0, 4);
    var month = val.substring(4, 6);
    var date = val.substring(6, 8);
    var date2 = new Date(year + "-" + month + "-" + date);
    if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
      return true;
    }
  }
  return false;
}
//校验码校验
var checkCode = function (val) {
  var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  var code = val.substring(17);
  if (p.test(val)) {
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  return false;
};

 function checkEmail(email) {
  let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (str.test(email)) {
    return true
  } else {
    return false
  }
}


module.exports = {
  formatDateTime,
  request,
  formatDate,
  formatTime,
  get,
  post,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
  isEmpty,
  showRightToast,
  checkEmail,
  formatTime: formatTime,
  utf16toEntities: utf16toEntities,
  entitiesToUtf16: entitiesToUtf16,
  dateDiff: dateDiff,
  ValidatePhone: ValidatePhone,
  idCardNoUtil: idCardNoUtil,
  dayDiff:dayDiff
}

