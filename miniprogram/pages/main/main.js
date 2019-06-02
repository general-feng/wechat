// miniprogram/pages/main/main.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  db: undefined,
  test: undefined,
  data:{
    notes: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //  调用login云函数获取openid
    
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.cloud.callFunction({
          data: {
            openid: app.globalData.openid,
            method: 'get'
          },
          name: 'getMemorandum',
          success: res => {
            console.log(res)
            this.setData({
              notes:res.result || []
            })
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })

  },
  // 单击“插入数据”按钮调用该函数
  insertData: function (type) {
    const t = type.target.dataset.type;
    wx.navigateTo({
      url: `../editMemory/editMemory?type=${t}`,
    })
  },
  //  单击“查询数据”按钮执行该函数
  queryData: function () {
    var that = this
    //  根据记录ID搜索数据集  
    this.db.collection('mini-test').doc(this.data.searchName).get({
      // 找到记录集调用
      success: function (res) {
        //  将查询结果显示在页面上  
        that.setData({
          nameResult: res.data.name,
          ageResult: res.data.age
        })

      },
      //  未查到数据时调用
      fail: function (res) {
        wx.showModal({
          title: '错误',
          content: '没有找到记录',
          showCancel: false
        })
      }
    })

  },
  //  下面的函数用于当更新input组件中的值时同时更新对应变量的值
  bindKeyInputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyInputAge: function (e) {
    this.setData({
      age: e.detail.value
    })
  },
  bindKeyInputId: function (e) {
    this.setData({
      recordId: e.detail.value
    })
  },
  onShow(){
    if (!app.globalData.openid)return
    wx.cloud.callFunction({
      data: {
        openid: app.globalData.openid,
        method: 'get'
      },
      name: 'getMemorandum',
      success: res => {
        console.log(res)
        this.setData({
          notes: res.result || []
        })
      }
    })
  }
})