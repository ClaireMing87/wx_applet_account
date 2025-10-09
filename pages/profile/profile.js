const app = getApp()

Page({
  data: {
    userInfo: null,
    totalRecords: 0,
    totalDays: 0,
    avgDaily: '0.00'
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.calculateStats()
  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.calculateStats()
  },

  calculateStats() {
    const records = app.globalData.records
    
    // 计算总记录数
    const totalRecords = records.length
    
    // 计算记账天数
    const uniqueDates = new Set()
    records.forEach(record => {
      const date = record.createTime.split('T')[0]
      uniqueDates.add(date)
    })
    const totalDays = uniqueDates.size
    
    // 计算日均支出
    let totalExpense = 0
    records.forEach(record => {
      if (record.type === 'expense') {
        totalExpense += parseFloat(record.amount)
      }
    })
    
    const avgDaily = totalDays > 0 ? (totalExpense / totalDays).toFixed(2) : '0.00'
    
    this.setData({
      totalRecords: totalRecords,
      totalDays: totalDays,
      avgDaily: avgDaily
    })
  },

  login() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.log('获取用户信息失败:', err)
        wx.showToast({
          title: '登录失败',
          icon: 'error'
        })
      }
    })
  },

  goToRecords() {
    wx.navigateTo({
      url: '/pages/records/records'
    })
  },

  goToCategories() {
    wx.navigateTo({
      url: '/pages/categories/categories'
    })
  },

  goToBudget() {
    wx.navigateTo({
      url: '/pages/profile/budget/budget'
    })
  },

  goToExport() {
    wx.navigateTo({
      url: '/pages/export/export'
    })
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  goToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  },

  // 开发者：清空全部账单
  clearAllRecords() {
    wx.showModal({
      title: '清空账单',
      content: '此操作将删除所有账单记录，且不可恢复。是否继续？',
      confirmText: '删除',
      confirmColor: '#d9534f',
      success: (res) => {
        if (res.confirm) {
          try {
            // 清空内存与本地存储
            app.globalData.records = []
            wx.setStorageSync('records', [])
            // 重新计算统计
            this.calculateStats()
            wx.showToast({ title: '已清空', icon: 'success' })
          } catch (e) {
            wx.showToast({ title: '操作失败', icon: 'error' })
          }
        }
      }
    })
  }
})
