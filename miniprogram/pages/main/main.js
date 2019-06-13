// miniprogram/pages/main/main.js
// 默认声明一个函数记录notes显示的数据---删除状态
const { tabBar, methods } = require("../template/tabBar.js");
var initdata = function (that) {
  var notes = that.data.notes
  for (var i = 0; i < notes.length; i++) {
    notes[i].txtStyle = ""
  }
  that.setData({
    notes: notes
  })
}
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  db: undefined,
  test: undefined,
  data:{
    delBtnWidth: 335, //删除按钮宽度单位（rpx）
    notes: [],
    currentTab: '0',
    moveWidth: '',
    tabBar
  },
  ...methods,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tabBar.selected = 0;
    this.setData({
      tabBar
    })
    var that = this;
    let curType = this.data.currentTab;
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
            evtType: curType,
            method: 'get'
          },
          name: 'getMemorandum',
          success: res => {
            that.setData({
              notes: res.result || [],
              moveWidth: `width:calc(100vw - ${that.data.delBtnWidth + 50}rpx)`
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    if (!app.globalData.openid)return
    this.getNotes()
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        delBtnWidth: e.target.dataset.current == '0' ? 335 : 125
      })
      that.getNotes()
    }
  },
  // 单击新增按钮调用该函数
  insertData: function () {
    const type = this.data.currentTab;
    wx.navigateTo({
      url: `../editMemory/editMemory?evtTtype=${type}&optType=add`,
    })
  },
  getNotes(){
    var that = this;
    wx.cloud.callFunction({
      data: {
        openid: app.globalData.openid,
        evtType: that.data.currentTab,
        method: 'get'
      },
      name: 'getMemorandum',
      success: res => {
        that.setData({
          notes: res.result || [],
          moveWidth: `width:calc(100vw - ${that.data.delBtnWidth + 50}rpx)`
        })
      }
    })
  },
  /**
* 显示删除按钮
*/
  showDeleteButton: function (e) {
    let noteIndex = e.currentTarget.dataset.index
    //delBtnWidth 为右侧按钮区域的宽度
    var delBtnWidth = this.data.delBtnWidth;
    this.setXmove(noteIndex, -delBtnWidth)
  },
  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let noteIndex = e.currentTarget.dataset.index
    this.setXmove(noteIndex, 0)
  },
  /**
   * 设置movable-view位移
   */
  setXmove: function (noteIndex, xmove) {
    let notes = this.data.notes
    notes[noteIndex].xmove = xmove
    this.setData({
      notes: notes
    })
  },
  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function (e) {
    //delBtnWidth 为右侧按钮区域的宽度
    var delBtnWidth = this.data.delBtnWidth;
    if (e.detail.source === 'friction') {
      if (e.detail.x < -(delBtnWidth / 2)) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },
  /**
   * 处理touchstart事件
   */
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
  },
  /**
   * 处理touchend事件
   */
  handleTouchEnd(e) {
    //delBtnWidth 为右侧按钮区域的宽度
    var delBtnWidth = this.data.delBtnWidth;
    if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -(delBtnWidth / 2)) {
      this.showDeleteButton(e)
    } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < (delBtnWidth / 2)) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },
  // 开始滑动事件
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置 
        startX: e.touches[0].clientX
      });
    }
  },
  // 滑动中事件
  touchM: function (e) {
    var that = this;
    initdata(that)
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var notes = that.data.notes;
      //将拼接好的样式设置到当前item中
      notes[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        notes: notes
      });
    }
  },
  // 滑动结束事件
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置 
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离 
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      console.log("4", delBtnWidth);
      //如果距离小于删除按钮的1/2，不显示删除按钮 
      var txtStyle = "";
      txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0px";
      //获取手指触摸的是哪一项 
      var index = e.currentTarget.dataset.index;
      var notes = this.data.notes;
      notes[index].txtStyle = txtStyle;
      console.log("1", notes[index].txtStyle);
      //更新列表的状态 
      this.setData({
        notes: notes
      });
    } else {
      console.log("2");
    }
  },
  //点击标记为已办按钮事件 
  changeItem: function (e) {
    const id = e.target.dataset.id;
    var that = this;
    wx.cloud.callFunction({
      data: {
        openid: app.globalData.openid,
        evtType: '1',
        id: id,
        method: 'update'
      },
      name: 'saveMemorandum',
      success: res => {
        that.getNotes()        
      }
    })
  },
  //点击删除按钮事件 
  delItem: function (e) {
    const id = e.target.dataset.id;
    var that = this;
    // 打印出当前选中的index
    console.log(e.currentTarget.dataset.index);
    // 获取到列表数据
    var notes = that.data.notes;
    // 删除
    wx.cloud.callFunction({
      data: {
        openid: app.globalData.openid,
        id: id,
        method: 'delete'
      },
      name: 'saveMemorandum',
      success: res => {
        that.getNotes()
      }
    })
  },
  //查看
  viewNote(e){
    const curType = this.data.currentTab, id = e.target.dataset.id;
    wx.navigateTo({
      url: `../editMemory/editMemory?evtTtype=${curType}&id=${id}&optType=update`,
    })
  }
})