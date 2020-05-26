var pelUtil = require('../../../utils/peopleBasicInfo.js');
const app = getApp()
var utils = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
const { $Toast } = require('../../../common/iview/dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMessageIdcard: "",
    errorMessage: "",
    errorColor: false,
    isDatePicker: false,
    pickerShow: false,
    pickerTitle: "",
    pickerName: "",
    liveDate: '',
    liveReason: '',
    liveType: '',
    liveHouseType: '',
    liveAddress: '',
    liveArray: [{
      shipname: '',
      shipidcard: '',
      shipphone: '',
      shiprelation: '',
    }],
    liveId: '',
    pId: 0,
    userId:null,
    currentDate: new Date().getTime(),
    minDate: new Date("1960-01-01 00:00:00"),//new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    utils.request(api.getUserDetail, { openid: app.globalData.openid ,replaceCode:app.globalData.replaceCode}).then(function (res) {
      console.log(res);
      if (res.code == 200 && res.data) {
        console.log(res.data);
        that.setData({
          userId:res.data.id,
          liveDate: res.data.fromDate,
          liveReason: res.data.liveReason,
          liveType: res.data.liveModel,
          liveHouseType: res.data.liveRoomType,
          liveAddress: res.data.liveAddress,
          liveArray: res.data.ships.length == 0 ? [{
            shipname: '',
            shipphone: '',
            shipidcard: '',
            shiprelation: '',
          }] : res.data.ships,
          liveId: res.data.liveId
        })
      } 
      if (res.data.liveModel == "单身居住") {
        that.setData({
          liveArray: [],
          isAdd: true
        })
      }else{
        this.setData({
          isAdd: false,
          liveArray: [{
            shipname: '',
            shipidcard: '',
            shipphone: '',
            shiprelation: '',
          }],
        })
      }
      if (res.data.marriage == "未婚") {
        pelUtil.relationShip = ['父母', '祖父母或外祖父母', '兄弟姐妹', '其他']
      } else {
        pelUtil.relationShip = ['父母', '配偶', '子女', '祖父母或外祖父母', '兄弟姐妹', '其他']
      }
    })
  },

  choiceLiveDate: function (e) {
    this.setData({
      isDatePicker: true
    })
    this.setPicker("来本地日期", "birth", pelUtil.nation)
  },

  //日期 picker
  onDatePickerCancel(e) {
    this.setData({
      pickerShow: false,
      isDatePicker: false
    });
  },
  onDatePickerConfirm(e) {
    this.setData({
      pickerShow: false,
      isDatePicker: false,
      liveDate: utils.formatDate(new Date(e.detail), "-")
    });
  },

  //普通picker
  onPickerCancel(e) {
    this.setData({
      pickerShow: false
    });
  },

  onPickerConfirm(e) {
    switch (this.data.pickerName) {
      case 'nation':
        this.setData({
          nation: e.detail.value.text
        });
        break;
      case 'household':
        this.setData({
          household: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
        });
        break;
      case 'householdNum':
        this.setData({
          householdNum: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
        });
        break;
      case 'education':
        this.setData({
          education: e.detail.value
        });
        break;
      case 'political':
        this.setData({
          political: e.detail.value
        });
        break;
      case 'blood':
        this.setData({
          blood: e.detail.value
        });
        break;
      case 'marriage':
        this.setData({
          marriage: e.detail.value
        });
        break;
      case 'faith':
        this.setData({
          faith: e.detail.value
        });
        break;
      case 'military':
        this.setData({
          military: e.detail.value
        });
        break;
      case 'liveType':
        this.setData({
          liveType: e.detail.value
        });
        console.log(e.detail.value)
        if (e.detail.value == "单身居住") {
          this.setData({
            isAdd: true,
            liveArray: []
          })
        }else{
          this.setData({
            isAdd: false,
            liveArray: [{
              shipname: '',
              shipidcard: '',
              shipphone: '',
              shiprelation: '',
            }],
          })
        }

      
        break;
      case 'liveHouseType':
        this.setData({
          liveHouseType: e.detail.value
        });
        break;
      case 'relationShip':
        var tmpArry = this.data.liveArray;
        for (var i in tmpArry) {
          if (this.data.pId == i) {
            tmpArry[i].shiprelation = e.detail.value;
          }
        }
        this.setData({
          liveArray: tmpArry,
        })
        break;


    }
    this.setData({
      pickerShow: false
    });
  },

  //设置 picker内容
  setPicker(title, name, pelUtilValue, j) {
    this.setData({
      pickerTitle: title,
      pickerName: name,
      pickerColumns: pelUtilValue,
      pickerShow: true,
      pId: j,
    });
  },


  inputLiveReason: function (e) {
    this.setData({
      liveReason: e.detail
    })
  },
  choiceLiveType: function (e) {

    this.setPicker("居住方式", "liveType", pelUtil.liveType)
  },
  choiceLiveHouseType: function (e) {
    this.setPicker("住所类型", "liveHouseType", pelUtil.houseType)
  },
  inputLiveAddress: function (e) {
    this.setData({
      liveAddress: e.detail
    })
  },

  inputToName: function (e) {

    var tmpArry = this.data.liveArray;
    for (var i in tmpArry) {
      if (e.currentTarget.dataset.index == i) {
        tmpArry[i].shipname = e.detail;
      }
    }
    this.setData({
      liveArray: tmpArry,
    })

  },
  inputIdCard: function (e) {
    var tmpArryId = this.data.liveArray;
    for (var i in tmpArryId) {
      if (e.currentTarget.dataset.index == i) {
        tmpArryId[i].shipidcard = e.detail;
      }
    }
    this.setData({
      liveArray: tmpArryId,
    })
  },
  inputIdCardBlur: function (e) {
    var isIdCard = utils.idCardNoUtil(e.detail.value)
    if (!isIdCard) {
      this.setData({
        errorMessageIdcard: "请检查身份证号码！"
      })
    }else{
      this.setData({
        errorMessageIdcard: ""
      })
    }
  },
  inputToPhone: function (e) {
    var tmpArry = this.data.liveArray;
    for (var i in tmpArry) {
      if (e.currentTarget.dataset.index == i) {
        tmpArry[i].shipphone = e.detail;
      }
    }
    this.setData({
      liveArray: tmpArry,
    })
  },
  inputPhoneBlur: function (e) {

    var isPhoneNum = utils.ValidatePhone(e.detail.value)
    if (!isPhoneNum) {
      this.setData({
        errorMessage: "请检查手机号码！"
      })
    }
  },
  choiceToRelationShipType: function (e) {
    this.setPicker("与本人关系", "relationShip", pelUtil.relationShip, e.currentTarget.dataset.index);
  },
  addArray: function () {
    this.data.liveArray.push({
      shipname: '',
      shipphone: '',
      shiprelation: '',
      shipidcard: '',
    })
  },

  addPeople: function (e) {
    this.addArray();
    this.setData({
      liveArray: this.data.liveArray
    }
    )
  },
  delArray: function (id) {

    this.data.liveArray.splice(id, 1);
  },
  delPeople: function (e) {
    this.delArray(e.currentTarget.dataset.index);
    this.setData({
      liveArray: this.data.liveArray
    }
    )
  },

  //表单选择 end
  gotonext(e) {

    let that = this;
    if (!that.data.liveDate) {
      $Toast({
        content: '请选择来本地日期！',
        type: 'warning'
      });
      return;
    } else {

      var str = utils.dayDiff(that.data.liveDate,utils.formatDate( new Date(),'-'));
      if(str < 180){
        $Toast({
          content: '您来本地不足6个月,不满足申请本地居住证条件！',
          type: 'warning'
        });
        return;
      }
    }

    // if (!that.data.liveReason) {
    //   $Toast({
    //     content: '请填写居住事由！',
    //     type: 'warning'
    //   });
    //   return;
    // };
    if (!that.data.liveType) {
      $Toast({
        content: '请选择居住方式！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.liveHouseType) {
      $Toast({
        content: '请选择住所类型！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.liveAddress) {
      $Toast({
        content: '请填写详细地址！',
        type: 'warning'
      });
      return;
    };

    if (that.data.liveArray.length > 0) {
      console.log(that.data.liveArray)
      for (const iterator of that.data.liveArray) {
        console.log(iterator.shipidcard)
        if (!iterator.shipname || !iterator.shipphone || !iterator.shiprelation || !iterator.shipidcard) {
          if (!iterator.shipname) {
            $Toast({
              content: '请同居者填写名字！',
              type: 'warning'
            });
            return;
          }
          if (!iterator.shipidcard) {
            $Toast({
              content: '请填写共同居住者身份证号码！',
              type: 'warning'
            });
            return;
          }
          if (iterator.shipidcard) {
            var isIdCard = utils.idCardNoUtil(iterator.shipidcard)
            console.log(isIdCard)
            if (!isIdCard) {
              this.setData({
                errorMessageIdcard: "请检查身份证号码！"
              })
              return;
            }
          };

          if (!iterator.shipphone) {
            $Toast({
              content: '请填写共同居住者电话号码！',
              type: 'warning'
            });
            return;
          }
          if (iterator.shipphone) {
            var isPhoneNum = utils.ValidatePhone(iterator.shipphone)
            if (!isPhoneNum) {
              $Toast({
                content: '请检查手机号码！',
                type: 'warning'
              });
              return;
            }
          }

          if (!iterator.shiprelation) {
            $Toast({
              content: '请选择同居者与本人关系！',
              type: 'warning'
            });
            return;
          }
        }

      }
    }

    $Toast({
      content: '正在提交...',
      type: 'loading'
    });
    console.log(JSON.stringify(that.data.liveArray))
    console.log(that.data.liveArray.length)
    utils.request(api.comLive, {
      openid: app.globalData.openid,
      live: JSON.stringify({
        id:that.data.userId,
        fromDate: that.data.liveDate,
        // liveReason: that.data.liveReason,
        liveModel: that.data.liveType,
        liveRoomType: that.data.liveHouseType,
        liveAddress: that.data.liveAddress,
        liveMaterial: '',
        liveStatus: '',
        liveId: that.data.liveId,
        shipStrs: that.data.liveArray.length > 0 ? JSON.stringify(that.data.liveArray) : ''
      }),
    }).then(function (res) {
      if (res.code == 200) {
        $Toast({
          content: res.msg,
          type: 'success'
        });
        setTimeout(() => {
          $Toast.hide();
        }, 2000);
        wx.navigateTo({
          url: '../../bookPage/bookPage',
        })
      } else {
        $Toast({
          content: res.msg,
          type: 'fail'
        });
      }

    });

  }
})