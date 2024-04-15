// pages/management/event_edit/match_edit/match_edit.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const {formatTime, splitDateTime} = require("../../../../utils/timeFormatter")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventId: Number,
    hasBegun: false,
    strTimeInfo: String,
    strDate: String,
    strTime: String,
    name: String,
    stage: String,
    tag: String,
    stageList: Array,
    stageNameList: Array,
    tagNameList: Array,
    matchId: Number,
    time: String,
    homeTeam: Array,
    awayTeam: Array,
    homeTeamId: Number,
    awayTeamId: Number,
    homeTeamScore: Number,
    awayTeamScore: Number,
    homeTeamPenalty: Number,
    awayTeamPenalty: Number,
    matchPlayerActionList: Array,
    refereeList: Array,
    matchEvent: Array,
    modalHidden: true, // 控制模态框显示隐藏
    array: [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']]
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      matchId: options.id,
    })
    this.fetchData(this.data.matchId);
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
    this.fetchData(this.data.matchId);
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
    this.fetchData(this.data.matchId);
    wx.stopPullDownRefresh();
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

  fetchData: function (id) {
    // 显示加载提示框，提示用户正在加载
    wx.showLoading({
      title: '加载中',
      mask: true // 创建一个蒙层，防止用户操作
    });

    var that = this;
    // 模拟网络请求
    wx.request({
      url: URL + '/match/get?id=' + that.data.matchId,
      success(res) {
        console.log("match->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        var date = new Date(res.data.time)
        let strTimeInfo = formatTime(date)
        let hasBegun = new Date() > date
        let { strDate, strTime } = splitDateTime(strTimeInfo)
        console.log(res.data.time)
        console.log(date)
        console.log(strTimeInfo)
        // 基本数据
        that.setData({
          hasBegun: hasBegun,
          strTimeInfo: strTimeInfo,
          strDate: strDate,
          strTime: strTime,

          matchId: res.data.matchId,
          time: res.data.time,
          homeTeamId: res.data.homeTeam.teamId,
          awayTeamId: res.data.awayTeam.teamId,
          homeTeamScore: res.data.homeTeam.score,
          awayTeamScore: res.data.awayTeam.score,
          homeTeamPenalty: res.data.homeTeam.penalty,
          awayTeamPenalty: res.data.awayTeam.penalty,
          homeTeam: res.data.homeTeam,
          awayTeam: res.data.awayTeam,
          refereeList: res.data.refereeList,
          matchPlayerActionList: res.data.matchPlayerActionList,
          stage: res.data.event.stage,
          tag: res.data.event.tag,
          matchEvent: res.data.matchEvent,
          eventId: res.data.event.eventId,
        });
      },
      fail(err) {
        console.log('请求失败', err);
        // 可以显示失败的提示信息，或者做一些错误处理
      },
      complete() {
        // 无论请求成功还是失败都会执行
        wx.hideLoading(); // 关闭加载提示框
        that.load(that.data.eventId);
      }
    });
  },

  load: function(eventId){
    // 显示加载提示框，提示用户正在加载
    wx.showLoading({
      title: '加载中',
      mask: true 
    });
    var that = this;
    // 模拟网络请求
    wx.request({
      url: URL + '/event/get?id=' + eventId,
      success(res) {
        console.log("event->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        // 将 stageList 中的每个 stageName 提取出来存储到 stageNameList 中
        const stageNameList = res.data.stageList.map(stage => stage.stageName);
        console.log("stageNameList->");
        console.log(stageNameList);
        const selectedStage = res.data.stageList.find(stage => stage.stageName === that.data.stage);
        const tagNameList = selectedStage.tags.map(tag => tag.tagName);
        // 基本数据
        that.setData({
          stageList: res.data.stageList,
          stageNameList: stageNameList,
          tagNameList: tagNameList,
        });
        console.log('stageList->');
        console.log(that.data.stageList);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        // 无论请求成功还是失败都会执行
        wx.hideLoading(); // 关闭加载提示框
      }
    });
  },

  // 引入模态框的通用方法
  showModal: function (title, content, confirmText, cancelText, confirmCallback, cancelCallback) {
    wx.showModal({
      title: title,
      content: content,
      confirmText: confirmText,
      cancelText: cancelText,
      success(res) {
        if (res.confirm) {
          confirmCallback();
        } else if (res.cancel) {
          cancelCallback();
        }
      }
    });
  },

  // 处理日期选择器选择完成事件
  bindDateChange: function (e) {
    // 更新页面上的日期显示
    this.setData({
      strDate: e.detail.value
    });
  },

  // 处理时间选择器选择完成事件
  bindTimeChange: function (e) {
    // 更新页面上的时间显示
    this.setData({
      strTime: e.detail.value
    });
  },

  bindStageChange: function (e){
    // 更新页面上的比赛阶段显示
    const selectedStage = this.data.stageList.find(stage => stage.stageName === this.data.stageNameList[e.detail.value]);
    const tagNameList = selectedStage.tags.map(tag => tag.tagName);
    this.setData({
      stage: this.data.stageNameList[e.detail.value],
      tag: "",
      tagNameList: tagNameList,
    });
  },
  
  bindTagChange: function (e){
    // 更新页面上的比赛组别显示
    this.setData({
      tag: this.data.tagNameList[e.detail.value],
    });
  },

  // 处理比分选择器选择完成事件
  bindPickerChangeScore: function (e) {
    const value = e.detail.value;
    // 更新页面上的比分显示
    this.setData({
      homeTeamScore: this.data.array[0][value[0]],
      awayTeamScore: this.data.array[0][value[1]]
    });
  },

  // 处理点球比分选择器选择完成事件
  bindPickerChangePenalty: function (e) {
    const value = e.detail.value;
    // 更新页面上的点球比分显示
    this.setData({
      homeTeamPenalty: this.data.array[0][value[0]],
      awayTeamPenalty: this.data.array[0][value[1]]
    });
  },

  // 点击确认修改按钮，弹出确认修改模态框
  showConfirmModal() {
    this.showModal(
      '确认修改',
      '确定要进行修改吗？',
      '确认',
      '取消',
      this.confirmEdit, // 点击确认时的回调函数
      () => {} // 点击取消时的回调函数，这里不做任何操作
    );
  },

  // 点击取消比赛按钮，弹出确认取消模态框
  showCancelModal() {
    this.showModal(
      '确认取消比赛',
      '确定要取消这场比赛吗？',
      '确认取消',
      '我再想想',
      this.deleteMatch, // 点击确认取消时的回调函数
      () => {} // 点击我再想想时的回调函数，这里不做任何操作
    );
  },

  // 处理提交信息修改
  confirmEdit() {
    // 显示加载提示框，提示用户正在加载
    wx.showLoading({
      title: '加载中',
      mask: true // 创建一个蒙层，防止用户操作
    });

    let sqlTimestamp = this.data.strDate + 'T' + this.data.strTime + ":00.000+00:00"; // 转换为 ISO 
    this.setData({
      time: sqlTimestamp,
    });

    // 构造要发送给后端的数据
    const dataToUpdate = {
      matchId: this.data.matchId,
      time: this.data.time,
      homeTeam: this.data.homeTeam,
      awayTeam: this.data.awayTeam,
      homeTeamId: this.data.homeTeamId,
      awayTeamId: this.data.awayTeamId,
      homeTeamScore: this.data.homeTeamScore,
      awayTeamScore: this.data.awayTeamScore,
      homeTeamPenalty: this.data.homeTeamPenalty,
      awayTeamPenalty: this.data.awayTeamPenalty,
      refereeList: this.data.refereeList,
      matchPlayerActionList: this.data.matchPlayerActionList,
      matchEvent: {
        stage: this.data.stage,
        tag: this.data.tag,
      },
    };
    console.log(dataToUpdate);
    // 发送请求到后端接口
    wx.request({
      url: URL + '/match/update', // 后端接口地址
      method: 'PUT', // 请求方法
      data: dataToUpdate, // 要发送的数据
      success: res => {
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log('比赛信息更新成功', res.data);
      },
      fail: err => {
        console.error('比赛信息更新失败', err);
      },
      complete() {
        // 无论请求成功还是失败都会执行
        wx.hideLoading(); // 关闭加载提示框
      }
    });
  },

  deleteMatch() {
    
  },

  // 处理邀请队伍
  inviteTeam: function(e) {
    const dataset = e.currentTarget.dataset 
    wx.navigateTo({
      url: '/pages/management/match_edit/invite_team/invite_team?id=' + dataset.id,
    })
  },

})