Component({
  data: {
    selected: 0,
    color: "#515a6e",
    selectedColor: "#5095f7",
    list: [{
      pagePath: "/pages/main/main",
      iconPath: "/images/createtask.png",
      selectedIconPath: "/images/createtask_fill.png",
      text: "事项列表"
    }, {
        pagePath: "/pages/user/user",
      iconPath: "/images/mine.png",
        selectedIconPath: "/images/mine_fill.png",
      text: "个人信息"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})