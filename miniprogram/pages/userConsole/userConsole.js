// pages/userConsole/userConsole.js
Page({

  data: {
    openid: ''
  },

  onLoad: function (options) {
    this.setData({
      openid: getApp().globalData.openid
    })

    wx.cloud.init({ env: 'test' })
    const db = wx.cloud.database()
    const test = db.collection('mini-test')

    test.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: "Bill",
        age: 30
      },
      success: function (res) {
        //  输出成功插入后的id以及其他信息
        console.log(res)
      }
    })
  }
})