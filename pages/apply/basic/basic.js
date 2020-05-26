// pages/apply/basic/basic.js
var pelUtil = require('../../../utils/peopleBasicInfo.js');
const app = getApp()
var utils = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
const { $Toast } = require('../../../common/iview/dist/base/index');
const areaList = require('./area.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMessage: "",
    errorMessageIdcard: "",
    errorColor: false,
    isDatePicker: false,
    isAddresssPicker: false,
    pickerShow: false,
    pickerTitle: "",
    pickerName: "",
    pickerColumns: [],
    pickerColumns1: [],
    username: "",
    oldname: "",
    phone: "",
    idCard: "",
    sex: "",
    height: "",
    nation: "",
    birth: "",
    household: "",
    householdNum: "",
    education: "",
    political: "",
    blood: "",
    marriage: "",
    faith: "",
    military: "",
    isRegister: "",
    police: "",
    work: "",
    use: "",
    mailBox: "",
    urgentName: "",
    urgentPhone: "",
    localQixian:"",
    areaList: null,
    userId: null,
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
    console.log(options)
    if (options.idCard) {
      this.setData({
        idCard: options.idCard,
        username: options.name,
      })
    }
    this.setData({
      areaList: areaList.default
    })
  },
  onReady: function () {

  },
  onShow: function () {
    $Toast.hide();
    let that = this;
    utils.request(api.getUserDetail, { openid: app.globalData.openid, replaceCode: app.globalData.replaceCode }).then(function (res) {
      console.log(res);
      if (res.code == 200 && res.data) {

        that.setData({
          userId: res.data.id,
          username: res.data.username,
          oldname: res.data.oldName,
          phone: res.data.phone,
          idCard: res.data.idcard,
          sex: res.data.sex + '',
          height: res.data.height,
          nation: res.data.nation,
          birth: res.data.birth,
          household: res.data.household,
          householdNum: res.data.householdNum,
          education: res.data.education,
          political: res.data.political,
          blood: res.data.blood,
          marriage: res.data.marriage,
          faith: res.data.faith,
          military: res.data.military,
          isRegister: res.data.isDJ == 1 ? "是" : "否",
          work: res.data.work,
          use: res.data.use,
          mailBox: res.data.mailbox,
          urgentName: res.data.urgentName,
          urgentPhone: res.data.urgentPhone,
          isModify: true,
          police:res.data.policeStation
        })
      }
    })
  },
  //表单选择 

  inputName: function (e) {
    this.setData({
      username: e.detail
    })
  },

  inputOldName(e) {
    this.setData({
      oldname: e.detail
    });
  },

  inputIdCard: function (e) {
    this.setData({
      idCard: e.detail,
      errorMessageIdcard: "",
      errorColor: false
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
  inputPhoneBlur(e) {

    var isPhoneNum = utils.ValidatePhone(e.detail.value)
    if (!isPhoneNum) {
      this.setData({
        errorMessage: "请检查手机号码！"
      })
    }else{
      this.setData({
        errorMessageIdcard: ""
      })
    }
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail,
      errorMessage: "",
      errorColor: false
    });
  },
  inputHeight(e) {

    this.setData({
      height: e.detail.value
    });


  },
  onRadioChange(event) {
    this.setData({
      sex: event.detail
    });

  },
  choiceNation(e) {
    this.setPicker("民族", "nation", pelUtil.nation)
  },
  choiceBirth(e) {
    this.setData({
      isDatePicker: true
    })
    this.setPicker("出生日期", "birth", pelUtil.nation)
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
      birth: utils.formatDate(new Date(e.detail), "-")
    });
  },
  onDatePickeInput(e) {
    this.setData({
      currentDate: e.detail
    });
  },
  //普通picker
  onPickerCancel(e) {
    this.setData({
      pickerShow: false,
      isAddresssPicker: false
    });
  },
  onPickerConfirm(e) {
    switch (this.data.pickerName) {
      case 'nation':
        this.setData({
          nation: e.detail.value.text
        });
        break;
      // case 'birth':
      //   this.setData({
      //     birth: e.detail.value.text
      //   });
      //   break;
      case 'household':
        this.setData({
          household: e.detail.values[0].name + e.detail.values[1].name + e.detail.values[2].name,
          isAddresssPicker: false
        });
        break;
      case 'householdNum':
        console.log(e)
        this.setData({
          householdNum: e.detail.values[0].name + e.detail.values[1].name + e.detail.values[2].name,
          localQixian:e.detail.values[2].name,
          isAddresssPicker: false
        });
        if (this.data.householdNum.indexOf('乌兰察布')==-1) {
          $Toast({
            content: '现居住地不属于乌兰察布市，无法办理居住证！',
            type: 'warning'
          });
          
        };
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
      case 'register':
        this.setData({
          isRegister: e.detail.value
        });
        break;
      case 'police':
        this.setData({
          police: e.detail.value
        });
        break;
      case 'work':
        this.setData({
          work: e.detail.value
        });
        break;
      case 'use':
        this.setData({
          use: e.detail.value
        });
        break;
    }
    this.setData({
      pickerShow: false
    });
  },
  //普通picker 多级联动 
  onPickerChange(e) {
    if (this.data.pickerName == "household" || this.data.pickerName == "householdNum") {
      console.log(e.detail);
      const { picker, value, index } = e.detail;
      if (index == 0) {
        var co_2 = Object.keys(pelUtil.household[value[0]]);
        picker.setColumnValues(1, Object.keys(pelUtil.household[value[0]]));
        picker.setColumnValues(2, pelUtil.household[value[0]][co_2[0]]);
      } else if (index == 1) {
        picker.setColumnValues(2, pelUtil.household[value[0]][value[1]]);
      }

    }
  },

  //设置 picker内容
  setPicker(title, name, pelUtilValue) {
    this.setData({
      pickerTitle: title,
      pickerName: name,
      pickerColumns: pelUtilValue,
      pickerShow: true
    });

  },

  choiceHousehold(e) {
    this.setData({
      isAddresssPicker: true
    })
    this.setPicker("户籍地省市区", "household", this.data.isAddresssPicker)
  },
  choiceHouseholdNum(e) {
    this.setData({
      isAddresssPicker: true
    })
    this.setPicker("现居住所在地", "householdNum", this.data.isAddresssPicker)
  },
  choiceEducation(e) {
    this.setPicker("文化程度", "education", pelUtil.education)
  },
  choicePolitical(e) {
    this.setPicker("政治面貌", "political", pelUtil.political)
  },
  choiceBlood(e) {
    this.setPicker("血型", "blood", pelUtil.blood)
  },
  choiceMarriage(e) {
    this.setPicker("婚姻状况", "marriage", pelUtil.marriage)
  },
  choiceFaith(e) {
    this.setPicker("宗教信仰", "faith", pelUtil.faith)
  },
  choiceMilitary(e) {
    this.setPicker("兵役状况", "military", pelUtil.military)
  },
  matChatStr(str){
    var len = pelUtil.police.length;
    var arr = [];
    var reg = new RegExp(str);
    for(var i=0;i<len;i++){
        //如果字符串中不包含目标字符会返回-1
        if(pelUtil.police[i].match(reg)){
            console.log(pelUtil.police[i])
            arr.push(pelUtil.police[i]);
        }
    }
    return arr;
  },
  choicePolice(e) {
    var qiXianStr = "";
    if(this.data.localQixian){
      qiXianStr = this.data.localQixian
    }else{
      qiXianStr = this.data.householdNum.slice(11)
    }
    var list = this.matChatStr(qiXianStr);

    this.setPicker("所属派出所", "police", list)
  },
  choiceRegister(e) {
    this.setPicker("是否登记", "register", pelUtil.register)
  },
  choiceWork(e) {
    this.setPicker("人员身份", "work", pelUtil.work)
  },
  choiceUse(e) {
    this.setPicker("居住事由", "use", pelUtil.use)
  },


  inputMailBox(e) {
    this.setData({
      mailBox: e.detail
    });
  },
  inputUrgentName(e) {
    this.setData({
      urgentName: e.detail
    });
  },
  inputUrgentPhone(e) {
    this.setData({
      urgentPhone: e.detail
    });
  },

  //表单选择 end
  gotonext(e) {
    let that = this;
    if (!that.data.username) {
      $Toast({
        content: '请输入名字！',
        type: 'warning'
      });
      return;
    };

    if (!that.data.oldname) {
      $Toast({
        content: '请输入曾用名！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.idCard) {
      $Toast({
        content: '请输入身份号码！',
        type: 'warning'
      });
      return;
    }else{

      var isIdCard = utils.idCardNoUtil(that.data.idCard)

      if (!isIdCard) {
        this.setData({
          errorMessageIdcard: "请检查身份证号码！"
        })
        return;
      }

    }
    if (!that.data.phone) {
      $Toast({
        content: '请输入手机号！',
        type: 'warning'
      });
      return;
    }else{
      var isPhoneNum = utils.ValidatePhone(that.data.phone)
      if (!isPhoneNum) {
        $Toast({
          content: '请检查手机号码！',
          type: 'warning'
        });
        return;
      }
    }
    if (!that.data.sex) {
      $Toast({
        content: '请选择性别！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.height) {
      $Toast({
        content: '请输入身高！',
        type: 'warning'
      });
      return;
    } else {

      if (100 > parseInt(that.data.height) || parseInt(that.data.height) > 230) {
        $Toast({
          content: '请输入正确身高！',
          type: 'warning'
        });
        return;
      }
    };
    if (!that.data.nation) {
      $Toast({
        content: '请选择民族！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.birth) {
      $Toast({
        content: '请选择出生日期！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.household) {
      $Toast({
        content: '请选择户籍地省市区！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.householdNum) {
      console.log(that.data.police)

      $Toast({
        content: '请选择户口所在地！',
        type: 'warning'
      });
      return;
    }else{
      if (that.data.householdNum.indexOf('乌兰察布')==-1) {
        $Toast({
          content: '现居住地不属于乌兰察布市，无法办理居住证！',
          type: 'warning'
        });
        return;
      };
    };
    if (!that.data.education) {
      $Toast({
        content: '请选择文化程度！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.political) {
      $Toast({
        content: '请选择政治面貌！',
        type: 'warning'
      });
      return;
    };
    // if (!that.data.blood) {
    //   $Toast({
    //     content: '请选择血型！',
    //     type: 'warning'
    //   });
    //   return;
    // };
    if (!that.data.marriage) {
      $Toast({
        content: '请选择婚姻状况！',
        type: 'warning'
      });
      return;
    };

    if (!that.data.faith) {
      $Toast({
        content: '请选择宗教信仰！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.military) {
      $Toast({
        content: '请选择兵役状况！',
        type: 'warning'
      });
      return;
    };

    if (!that.data.isRegister) {
      $Toast({
        content: '请选择派出所是是否登记！',
        type: 'warning'
      });
      return;
    };

    if (!that.data.police) {
      $Toast({
        content: '请选择所属派出所！',
        type: 'warning'
      });
      return;
    };
    if (that.data.police.length == 0) {
      $Toast({
        content: '请选择派出所！',
        type: 'warning'
      });
      return;
    };

    if (!that.data.work) {
      $Toast({
        content: '请选择人员身份！',
        type: 'warning'
      });
      return;
    };
    if (!that.data.use) {
      $Toast({
        content: '请选择办理居住证用途！',
        type: 'warning'
      });
      return;
    };

    if (that.data.mailBox) {

      var isEmail = utils.checkEmail(that.data.mailBox)

      if (!isEmail) {
        $Toast({
          content: '请检查紧急联系人邮箱！',
          type: 'warning'
        });
        return;
      }
    }

    if (that.data.urgentPhone) {

      var isPhoneNum = utils.ValidatePhone(that.data.urgentPhone)
      if (!isPhoneNum) {
        $Toast({
          content: '请检查紧急联系人手机号！',
          type: 'warning'
        });
        return;
      }
    };

    $Toast({
      content: '正在提交...',
      type: 'loading'
    });

    if (that.data.household == that.data.householdNum) {
      $Toast({
        content: '本地居住者，无需办理居住证！',
        type: 'warning'
      });
      return;
    }
    utils.request(api.complateUserInfo, {
      openid: app.globalData.openid,
      status: "4",
      userinfo: JSON.stringify({
        id: that.data.userId,
        username: that.data.username,
        oldName: that.data.oldname,
        phone: that.data.phone,
        idCard: that.data.idCard,
        sex: that.data.sex,
        height: that.data.height,
        nation: that.data.nation,
        birth: that.data.birth,
        household: that.data.household,
        householdNum: that.data.householdNum,
        education: that.data.education,
        political: that.data.political,
        blood: that.data.blood,
        marriage: that.data.marriage,
        faith: that.data.faith,
        military: that.data.military,
        isDJ: that.data.isRegister == "否" ? 0 : 1,
        work: that.data.work,
        use: that.data.use,
        mailbox: that.data.mailBox,
        urgentName: that.data.urgentName,
        urgentPhone: that.data.urgentPhone,
        replaceCode: app.globalData.replaceCode,
        policeStation:that.data.police
      })
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
          url: '../live/live',
        })

      } else {
        $Toast({
          content: res.msg,
          type: 'warning'
        });
      }
    })


  },

  isInputNull: function (str, titil) {
    if (str == '') {
      $Toast({
        content: titil,
        type: 'warning'
      });
      return false;
    };
    return true;
  }


})