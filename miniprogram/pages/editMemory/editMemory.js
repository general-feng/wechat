// pages/editMemory/editMemory.js
var util = require('../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    theme: '',
    evtType: '',
    optType: '',
    title: '',
    area:'',
    id:0
  },
  bindTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindArea: function (e) {
    this.setData({
      area: e.detail.value
    })
  },
  save: function () {
    var that = this
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatDate(new Date());
    if (this.data.optType === 'update') {
      wx.cloud.callFunction({
        data: {
          id: this.data.id,
          title: this.data.title,
          area: this.data.area,
          time: time,
          openid: app.globalData.openid,
          method: 'update'
        },
        method: 'post',
        name: 'saveMemorandum',
        success: res => {
          console.log(res)
          wx.showModal({
            title: '成功',
            content: '更新成功！',
            showCancel: false
          })
          wx.navigateBack();
        },
        fail: function (res) {
          console.log(res)
          wx.showModal({
            title: '错误',
            content: '没有找到记录',
            showCancel: false
          })
        }
      })
    } else {
      wx.cloud.callFunction({
        data: {
          evtType: this.data.evtType,
          title: this.data.title,
          area: this.data.area,
          time: time,
          openid: app.globalData.openid,
          method: 'add'
        },
        method: 'post',
        name: 'saveMemorandum',
        success: res => {
          console.log(res)
          wx.showModal({
            title: '成功',
            content: '保存成功！',
            showCancel: false
          })
          wx.navigateBack();
        },
        fail: function (res) {
          console.log(res)
          wx.showModal({
            title: '错误',
            content: '没有找到记录',
            showCancel: false
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const theme = ['待办事宜', '已办事宜', '备忘', '随笔'][options.evtTtype], id = Number(options.id);
    this.setData({
      theme: theme,
      evtType: options.evtTtype,
      optType: options.optType
    });
    if(!id) {
      return;
    }
    wx.cloud.callFunction({
      data: {
        id: id,
        openid: app.globalData.openid,
      },
      method: 'post',
      name: 'getMemorandumDetail',
      success: res => {
        const note = res.result[0];
        this.setData({
          title: note.title,
          area: note.area,
          id: note._id
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showModal({
          title: '错误',
          content: '没有找到记录',
          showCancel: false
        })
        wx.navigateBack();
      }
    });
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

  }
})