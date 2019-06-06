// miniprogram/pages/homePage/homePage.js
Page({
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