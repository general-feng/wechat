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
     * 生命周期函数--监听页面显示
     */
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  }
})