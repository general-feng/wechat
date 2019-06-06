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
      iconPath: "/images/card.png",
        selectedIconPath: "/images/card_fill.png",
      text: "个人信息"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log('1', data.index)
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})