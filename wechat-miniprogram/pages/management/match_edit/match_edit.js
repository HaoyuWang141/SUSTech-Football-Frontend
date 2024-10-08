// pages/management/match_edit/match_edit.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const {
  formatTime,
  splitDateTime
} = require("../../../utils/timeFormatter")

Page({
  data: {
    matchId: 0,
    hasBegun: false,
    strTimeInfo: '',
    strDate: '',
    strTime: '',
    name: '',
    tempHomeTeamId: 0,
    tempAwayTeamId: 0,
    time: '',
    homeTeam: [],
    awayTeam: [],
    homeTeamId: 0,
    awayTeamId: 0,
    homeTeamName: '',
    awayTeamName: '',
    homeTeamLogoUrl: '',
    awayTeamLogoUrl: '',
    homeTeamScore: 0,
    awayTeamScore: 0,
    homeTeamPenalty: 0,
    awayTeamPenalty: 0,
    matchPlayerActionList: [],
    refereeList: [{
      refereeId: 0,
      name: "",
      photoUrl: "",
      bio: "",
      userId: 0,
      matchList: []
    }],
    matchEvent: {
      eventId: 0,
      matchStage: "",
      matchTag: "",
      eventName: ""
    },
    modalHidden: true, // 控制模态框显示隐藏
    array: [
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    ],
    status: '',
    statusArray: ['PENDING', 'ONGOING', 'FINISHED'],
    strStatus: '',
    strStatusArray: ['未开始', '正在进行', '已结束'],
  },

  onLoad(options) {
    this.setData({
      matchId: options.id
    })
    this.fetchData();
  },

  onShow() {
    this.fetchData();
  },

  onPullDownRefresh() {
    this.fetchData();
    wx.stopPullDownRefresh();
  },

  fetchData() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    var that = this;
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
        let hasBegun = res.data.status != "PENDING"
        let strStatus
        switch (res.data.status) {
          case "PENDING":
            strStatus = "未开始"
            break
          case "ONGOING":
            strStatus = "正在进行"
            break
          case "FINISHED":
            strStatus = "已结束"
        }
        let {
          strDate,
          strTime
        } = splitDateTime(strTimeInfo)
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
          homeTeam: res.data.homeTeam,
          awayTeam: res.data.awayTeam,
          homeTeamName: res.data.homeTeam.name,
          awayTeamName: res.data.awayTeam.name,
          homeTeamLogoUrl: res.data.homeTeam.logoUrl,
          awayTeamLogoUrl: res.data.awayTeam.logoUrl,
          homeTeamId: res.data.homeTeam.teamId,
          awayTeamId: res.data.awayTeam.teamId,
          homeTeamScore: res.data.homeTeam.score,
          awayTeamScore: res.data.awayTeam.score,
          homeTeamPenalty: res.data.homeTeam.penalty,
          awayTeamPenalty: res.data.awayTeam.penalty,
          refereeList: res.data.refereeList,
          status: res.data.status,
          strStatus: strStatus
        });
      },
      fail(err) {
        console.log('请求失败', err);
        // 显示失败信息
        wx.showToast({
          title: '请求失败，请重试',
          icon: 'error',
        });
      },
      complete() {
        // 无论请求成功还是失败都会执行
        wx.hideLoading(); // 关闭加载提示框
        if (that.data.tempHomeTeamId !== 0) {
          console.log('homeTeamId');
          console.log(that.data.tempHomeTeamId);
          wx.request({
            url: URL + '/team/get?id=' + that.data.tempHomeTeamId,
            success(res) {
              console.log("homeTeam->")
              console.log(res.data)
              if (res.statusCode !== 200) {
                console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                return
              }
              // 基本数据
              that.setData({
                homeTeamId: res.data.teamId,
                homeTeamName: res.data.name,
                homeTeamLogoUrl: res.data.logoUrl,
              });
            },
            fail(err) {
              console.log('请求失败', err);
              // 可以显示失败的提示信息，或者做一些错误处理
            },
            complete() {
              // 无论请求成功还是失败都会执行
              wx.hideLoading(); // 关闭加载提示框
            }
          });
        }

        if (that.data.tempAwayTeamId !== 0) {
          console.log('awayTeamId');
          console.log(that.data.tempAwayTeamId)
          wx.request({
            url: URL + '/team/get?id=' + that.data.tempAwayTeamId,
            success(res) {
              console.log("awayTeam->")
              console.log(res.data)
              if (res.statusCode !== 200) {
                console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                return
              }
              // 基本数据
              that.setData({
                awayTeamId: res.data.teamId,
                awayTeamName: res.data.name,
                awayTeamLogoUrl: res.data.logoUrl,
              });
            },
            fail(err) {
              console.log('请求失败', err);
              // 可以显示失败的提示信息，或者做一些错误处理
            },
            complete() {
              // 无论请求成功还是失败都会执行
              wx.hideLoading(); // 关闭加载提示框
            }
          });
        }
      }
    });
  },

  // 引入模态框的通用方法
  showModal: function (title, content, confirmText, confirmColor, cancelText, confirmCallback, cancelCallback) {
    wx.showModal({
      title: title,
      content: content,
      confirmText: confirmText,
      confirmColor: confirmColor,
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
    var that = this
    wx.showModal({
      title: '确认修改',
      content: '确定要进行修改吗？',
      confirmText: '确认',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.confirmEdit() // 点击确认时的回调函数
        } else if (res.cancel) {
          () => {} // 点击取消时的回调函数，这里不做任何操作
        }
      }
    })
  },

  // 点击取消比赛按钮，弹出确认取消模态框
  showCancelModal() {
    this.showModal(
      '确认取消比赛',
      '确定要取消这场比赛吗？',
      '确认取消',
      '#FF0000',
      '我再想想',
      this.deleteMatch, // 点击确认取消时的回调函数
      () => {} // 点击我再想想时的回调函数，这里不做任何操作
    );
  },

  // 处理提交信息修改
  confirmEdit() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    let sqlTimestamp = this.data.strDate + 'T' + this.data.strTime + ":00.000+08:00"; // 转换为 ISO 
    that.setData({
      time: sqlTimestamp,
    });
    const dataToUpdate = {
      matchId: this.data.matchId,
      homeTeamId: this.data.homeTeamId,
      awayTeamId: this.data.awayTeamId,
      time: this.data.time,
      status: this.data.status,
      homeTeamScore: this.data.homeTeamScore,
      awayTeamScore: this.data.awayTeamScore,
      homeTeamPenalty: this.data.homeTeamPenalty,
      awayTeamPenalty: this.data.awayTeamPenalty,
    };
    console.log('dataToUpdate->');
    console.log(dataToUpdate);
    wx.request({
      url: URL + '/match/update',
      method: 'PUT',
      data: dataToUpdate,
      success: res => {
        wx.hideLoading()
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '修改失败',
            icon: "error",
          })
          return
        }
        console.log('比赛信息更新成功', res.data);
        wx.navigateBack({
          success: () => {
            setTimeout(function () {
              wx.showToast({
                title: "修改成功",
                icon: "success",
              })
            }, 500)
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        console.error('比赛信息修改失败', err);
        // 显示失败信息
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'error',
        });
      },
    });
  },

  deleteMatch() {
    var that = this;
    wx.showLoading({
      title: '删除中',
      mask: true
    })
    wx.request({
      url: URL + '/match/delete?matchId=' + that.data.matchId + '&userId=' + userId,
      method: 'DELETE',
      success(res) {
        wx.hideLoading()
        console.log("delete match->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败，请重试',
            icon: 'error',
          });
          return
        }
        wx.navigateBack({
          success: () => {
            setTimeout(function () {
              wx.showToast({
                title: "删除成功",
                icon: "success",
              })
            }, 500)
          }
        })
      },
      fail(err) {
        wx.hideLoading()
        console.error('友谊赛删除失败', err);
        wx.showToast({
          title: '删除失败，请重试',
          icon: "error",
        });
      },
    });
  },

  gotoInviteReferee: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/invite/invite?id=' + dataset.id + '&type=' + 'referee',
    })
  },

  bindStatusChange(e) {
    const value = e.detail.value;
    this.setData({
      status: this.data.statusArray[value],
      strStatus: this.data.strStatusArray[value],
    })
  },

  showCheckRefereeModal(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认查看',
      content: '确定要查看该教练吗？',
      confirmText: '确认',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.gotoRefereePage(id)
        } else if (res.cancel) {
          () => {}
        }
      }
    });
  },

  gotoRefereePage(e) {
    const refereeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/user/referee/referee?id=' + refereeId,
    })
  },

  showDeleteRefereeModal(e) {
    const that = this
    const refereeId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认移除',
      content: '确定要移除该教练吗？',
      confirmText: '确认',
      confirmColor: 'red',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.deleteReferee(refereeId)
        }
      }
    })
  },

  deleteReferee(refereeId) {
    const matchId = this.data.matchId
    const that = this
    wx.showLoading({
      title: '删除中',
      mask: true,
    })
    wx.request({
      url: `${URL}/match/referee/delete?matchId=${matchId}&refereeId=${refereeId}`,
      method: 'DELETE',
      success(res) {
        console.log("/pages/management/match_edit: deleteReferee ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("删除裁判成功")
        that.fetchData()
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  }

})