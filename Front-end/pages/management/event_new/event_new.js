// pages/management/event_new/event_new.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '/assets/cup.svg',
    name: '创建新赛事名称',
    description: '编辑赛事简介',
    modalHiddenEname: true, // 控制模态框显示隐藏
    modalHiddenEdes: true,

    teamList : [],
    eventId: 0,
    stageList: [],
    eventType: '',
    eventTypeList: ['杯赛', '联赛'],
    groupNumber: [],
    teamNumber: [],
    turnNumber: [],
    gNumber: 0,
    tNumber: 0,
    tuNumber: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化groupNumber数组
    var groupArr = [];
    for (var i = 2; i <= 8; i++) {
      groupArr.push(i);
    }

    // 初始化teamNumber数组
    var teamArr = [];
    for (var j = 2; j <= 16; j*=2) {
      teamArr.push(j);
    }


    // 初始化turnNumber数组
    var turnArr = [];
    for (var k = 1; k <= 20; k++) {
      turnArr.push(k);
    }

    // 更新data中的数组
    this.setData({
      groupNumber: groupArr,
      teamNumber: teamArr,
      turnNumber: turnArr
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  inputEventName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  inputEventDes: function (e) {
    this.setData({
      description: e.detail.value
    });
  },

  changeEventType: function (e) {
    const eventType = this.data.eventTypeList[e.detail.value]
    var stageList
    if(eventType == '杯赛') {
      stageList = [{stageName: '小组赛', tags: []}, {stageName: '淘汰赛', tags: []}]
    } else if(eventType == '联赛') {
      stageList = [{stageName: '联赛', tags: []}]
    }
    this.setData({
      eventType: eventType,
      stageList: stageList
    });

  },

  groupNumberChange: function (e) {
    const gNumber = this.data.groupNumber[e.detail.value]
    this.setData({
      gNumber: gNumber
    });
  },

  teamNumberChange: function (e) {
    const tNumber = this.data.teamNumber[e.detail.value]
    this.setData({
      tNumber: tNumber
    });
  },

  turnNumberChange: function (e) {
    const tuNumber = this.data.turnNumber[e.detail.value]
    this.setData({
      tuNumber: tuNumber
    });
  },
  
  // 点击确认创建按钮，弹出确认修改模态框
  showCreateModal() {
    var that = this
    wx.showModal({
      title: '确认创建',
      content: '确定要进行创建赛事吗？',
      confirmText: '确认',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.confirmCreate() // 点击确认时的回调函数
        } else if (res.cancel) {
          () => {} // 点击取消时的回调函数，这里不做任何操作
        }
      }
    });
  },

  confirmCreate: function (){
    var that = this;
    var stageList = [];
    // 根据不同的eventType设置不同的stageList
    if ( that.data.eventType !== '杯赛' && that.data.eventType !== '联赛') {
      wx.showToast({
        title: '请选择赛事类型',
        icon: 'none',
        duration: 2000
      });
    } else if ((that.data.gNumber === 0 || that.data.tNumber === 0) &&  that.data.eventType === '杯赛') {
      wx.showToast({
        title: '请选择小组数和出线队伍数',
        icon: 'none',
        duration: 2000
      });
    } else if (that.data.tuNumber === 0  &&  that.data.eventType === '联赛') {
      wx.showToast({
        title: '请选择联赛总轮数',
        icon: 'none',
        duration: 2000
      });
    } else {
      if (that.data.eventType === '杯赛') {
        // 杯赛有两个阶段：小组赛和淘汰赛
        var groupStage = {
          stageName: '小组赛',
          tags: []
        };

        // 添加小组赛的tag
        for (var i = 0; i < that.data.gNumber; i++) {
          groupStage.tags.push({
            tagName: String.fromCharCode(65 + i) + '组', // A组、B组...
            matches: []
          });
        }

        // 添加淘汰赛的tag
        var eliminationStage = {
          stageName: '淘汰赛',
          tags: [] // 可根据需要自定义
        };

        switch(that.data.tNumber) { 
          case 2:
            eliminationStage.tags.push({
              tagName: '决赛',
              matches: []
            })
            break
          case 4:
            eliminationStage.tags.push(
              {
                tagName: '决赛',
                matches: []
              },
              {
                tagName: '三四名决赛',
                matches: []
              },
              {
                tagName: '半决赛',
                matches: []
              }
            )
          break
          case 8:
            eliminationStage.tags.push(
              {
                tagName: '决赛',
                matches: []
              },
              {
                tagName: '三四名决赛',
                matches: []
              },
              {
                tagName: '半决赛',
                matches: []
              },
              {
                tagName: '四分之一决赛',
                matches: []
              }
            )
            break
          case 16:
            eliminationStage.tags.push(
              {
                tagName: '决赛',
                matches: []
              },
              {
                tagName: '三四名决赛',
                matches: []
              },
              {
                tagName: '半决赛',
                matches: []
              },
              {
                tagName: '四分之一决赛',
                matches: []
              },
              {
                tagName: '八分之一决赛',
                matches: []
              }
            )
            break   
          default:
            break
        }
        // 将两个阶段加入stageList
        stageList.push(groupStage, eliminationStage);
      } else if (that.data.eventType === '联赛') {
        // 联赛只有一个阶段：联赛
        var leagueStage = {
          stageName: '联赛',
          tags: []
        };

        // 添加联赛的tag
        for (var j = 1; j <= that.data.tuNumber; j++) {
          leagueStage.tags.push({
            tagName: '第' + j + '轮',
            matches: []
          });
        }

        // 将联赛阶段加入stageList
        stageList.push(leagueStage);
      }


      // 构造要发送给后端的数据
      const dataToUpdate = {
        name: this.data.name,
        description: this.data.description,
        stageList: stageList,
      };
      console.log(dataToUpdate)
      // 发送请求到后端接口
      wx.request({
        url: URL + '/event/create?ownerId=' + userId, // 后端接口地址
        method: 'POST', // 请求方法
        data: dataToUpdate, // 要发送的数据
        success: res => {
          // 请求成功的处理逻辑
          // 获取成功信息并显示在 toast 中
          const successMsg = res.data ? res.data : '创建成功'; // 假设后端返回的成功信息在 res.data.message 中
          wx.showToast({
            title: successMsg,
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 2000);
            }
          });
        },
        fail: err => {
          // 请求失败的处理逻辑
          console.error('赛事创建失败', err);
          // 可以显示失败的提示信息或进行其他操作
          // 显示失败信息
          wx.showToast({
            title: '创建失败，请重试',
            icon: 'none',
            duration: 2000
          });
        },
      });
    }
  },
})