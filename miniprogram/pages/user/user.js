// miniprogram/pages/homePage/homePage.js
const { tabBar, methods } = require("../template/tabBar.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabBar
  },
  ...methods,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tabBar.selected = 1;
    this.setData({
      tabBar
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    this.drawCanvas()
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  drawCanvas: function (e) {
    var ctx = wx.createCanvasContext('myCanvas')
    const grd = ctx.createLinearGradient(0, 0, 400, 0)
    grd.addColorStop(0, 'white')
    grd.addColorStop(0.5, '#5095f7')
    grd.addColorStop(1, 'white')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, 400, 2)
    var txt="如果不是终点，请微笑向前！"
    ctx.setFillStyle('#5095f7');
    ctx.setFontSize(16);
    ctx.setTextAlign('center');
    ctx.fillText(txt, 200, 32)
    const grdE = ctx.createLinearGradient(0, 60, 400, 60)
    grdE.addColorStop(0, 'white')
    grdE.addColorStop(0.5, '#5095f7')
    grdE.addColorStop(1, 'white')
    ctx.setFillStyle(grdE)
    ctx.fillRect(0, 50, 400, 2)
    ctx.draw()
  }
})