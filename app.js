App({
  globalData: {
    userInfo: null,
    records: [],
    budget: { yearBudget: 0, monthBudget: 0 },
    categories: {
      expense: [
        { id: 1, name: '餐饮', icon: '🍽️' },
        { id: 2, name: '交通', icon: '🚗' },
        { id: 3, name: '购物', icon: '🛒' },
        { id: 4, name: '娱乐', icon: '🎮' },
        { id: 5, name: '医疗', icon: '💊' },
        { id: 6, name: '教育', icon: '📚' },
        { id: 7, name: '住房', icon: '🏠' },
        { id: 8, name: '通讯', icon: '📱' },
        { id: 9, name: '服装', icon: '👕' },
        { id: 10, name: '美容', icon: '💄' },
        { id: 11, name: '运动', icon: '⚽' },
        { id: 12, name: '旅行', icon: '✈️' },
        { id: 13, name: '保险', icon: '🛡️' },
        { id: 14, name: '水电', icon: '💡' },
        { id: 15, name: '维修', icon: '🔧' },
        { id: 16, name: '其他', icon: '📝' }
      ],
      income: [
        { id: 17, name: '工资', icon: '💰' },
        { id: 18, name: '奖金', icon: '🎁' },
        { id: 19, name: '投资', icon: '📈' },
        { id: 20, name: '兼职', icon: '💼' },
        { id: 21, name: '红包', icon: '🧧' },
        { id: 22, name: '退款', icon: '↩️' },
        { id: 23, name: '理财', icon: '💹' },
        { id: 24, name: '其他', icon: '📝' }
      ]
    },
    // 用户自定义二级分类：{ [topId: number]: Array<{id,name,icon}> }
    customSubMenus: {}
  },

  onLaunch() {
    // 获取本地存储的记录
    const records = wx.getStorageSync('records') || []
    
    // 按照createTime降序排序（最新的在前面）
    records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    
    this.globalData.records = records

    // 读取用户自定义二级分类
    const customSubMenus = wx.getStorageSync('customSubMenus') || {}
    this.globalData.customSubMenus = customSubMenus

    // 获取预算
    const storedBudget = wx.getStorageSync('budget')
    if (storedBudget && typeof storedBudget.yearBudget === 'number' && typeof storedBudget.monthBudget === 'number') {
      this.globalData.budget = storedBudget
    }
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },

  // 添加记录
  addRecord(record) {
    const records = this.globalData.records
    record.id = Date.now()
    // 使用用户选择的时间，如果没有则使用当前时间
    record.createTime = record.dateTime ? new Date(record.dateTime).toISOString() : new Date().toISOString()
    records.push(record)
    
    // 按照createTime降序排序（最新的在前面）
    records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    
    this.globalData.records = records
    
    // 保存到本地存储
    wx.setStorageSync('records', records)
  },

  // 删除记录
  deleteRecord(id) {
    const records = this.globalData.records.filter(record => record.id !== id)
    this.globalData.records = records
    wx.setStorageSync('records', records)
  },

  // 更新记录
  updateRecord(updated) {
    const records = this.globalData.records.map(r => {
      if (r.id === updated.id) {
        // 如果用户修改了时间，更新createTime
        if (updated.dateTime && updated.dateTime !== r.dateTime) {
          updated.createTime = new Date(updated.dateTime).toISOString()
        }
        return { ...r, ...updated }
      }
      return r
    })
    
    // 按照createTime降序排序（最新的在前面）
    records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    
    this.globalData.records = records
    wx.setStorageSync('records', records)
  }
})
