const app = getApp()

Page({
  data: {
    currentMonth: '',
    monthExpense: 0,
    monthIncome: 0,
    monthBalance: 0,
    monthBudget: 0,
    monthBudgetBalance: '0.00',
    diffBudget: 0,
    diffBudgetBalance: '0.00',
    commonCategories: [],
    recentRecords: [],
    weekData: [],
    maxExpense: 0
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    this.refreshData()
  },

  initData() {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    this.setData({
      currentMonth: currentMonth
    })

    // 设置常用分类
    const commonCategories = [
      { id: 1, name: '餐饮', icon: '🍽️', type: 'expense' },
      { id: 2, name: '交通', icon: '🚗', type: 'expense' },
      { id: 3, name: '购物', icon: '🛒', type: 'expense' },
      { id: 9, name: '工资', icon: '💰', type: 'income' }
    ]
    this.setData({
      commonCategories: commonCategories
    })

    this.refreshData()
  },

  refreshData() {
    const records = app.globalData.records
    const { yearBudget = 0, monthBudget = 0 } = app.globalData.budget || {}
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    
    // 筛选本月记录
    const monthRecords = records.filter(record => {
      const recordDate = new Date(record.createTime)
      return recordDate.getMonth() + 1 === currentMonth && 
             recordDate.getFullYear() === currentYear
    })

    // 计算本月收支
    let monthExpense = 0
    let monthIncome = 0
    // 仅将 includeInMonthly !== false 的支出计入月度预算消耗
    monthRecords.forEach(record => {
      if (record.type === 'expense') {
        monthExpense += parseFloat(record.amount)
      } else {
        monthIncome += parseFloat(record.amount)
      }
    })

    const monthBalance = monthIncome - monthExpense

    // 月预算结余（仅按 includeInMonthly/budgetScope=month 计入）
    let monthBudgetUsed = 0
    monthRecords.forEach(record => {
      const scope = record.budgetScope
      const inMonth = scope ? scope === 'month' : (record.includeInMonthly === undefined || record.includeInMonthly)
      if (record.type === 'expense' && inMonth) {
        monthBudgetUsed += parseFloat(record.amount)
      }
    })
    const monthBudgetBalance = (monthBudget - monthBudgetUsed).toFixed(2)

    // 差额预算（年预算 - 月预算*12），及其结余（统计本月中 budgetScope=year 的支出所消耗差额预算）
    const diffBudget = Math.max(yearBudget - monthBudget * 12, 0)
    let diffBudgetUsedThisMonth = 0
    monthRecords.forEach(record => {
      const scope = record.budgetScope
      const isYearOnly = scope ? scope === 'year' : (record.includeInMonthly === false)
      if (record.type === 'expense' && isYearOnly) {
        diffBudgetUsedThisMonth += parseFloat(record.amount)
      }
    })
    const diffBudgetBalance = (diffBudget - diffBudgetUsedThisMonth).toFixed(2)

    // 获取最近5条记录
    const recentRecords = records.slice(0, 5).map(record => {
      const category = this.getCategoryInfo(record.categoryId, record.type)
      const displayName = this.getDisplayCategoryName(record)
      const accountDisplay = this.getAccountDisplay(record.account)
      return {
        ...record,
        categoryIcon: category.icon,
        categoryName: displayName,
        accountDisplay: accountDisplay,
        createTime: this.formatTime(record.createTime)
      }
    })

    // 生成本周趋势数据
    const weekData = this.generateWeekData(monthRecords)

    this.setData({
      monthExpense: monthExpense.toFixed(2),
      monthIncome: monthIncome.toFixed(2),
      monthBalance: monthBalance.toFixed(2),
      monthBudget: monthBudget,
      monthBudgetBalance: monthBudgetBalance,
      diffBudget: diffBudget,
      diffBudgetBalance: diffBudgetBalance,
      recentRecords: recentRecords,
      weekData: weekData,
      maxExpense: Math.max(...weekData.map(item => item.expense), 1)
    })
  },

  getAccountDisplay(account) {
    switch (account) {
      case 'cash':
        return '现金'
      case 'bank':
        return '银行卡'
      case 'alipay':
        return '支付宝'
      case 'wechat':
        return '微信'
      case 'fanka':
        return '饭卡'
      case 'credit':
        return '福利卡'
      case 'other':
        return '其他'
      default:
        return account || '账户'
    }
  },

  getCategoryInfo(categoryId, type) {
    const categories = app.globalData.categories[type]
    return categories.find(cat => cat.id === categoryId) || { icon: '📝', name: '其他' }
  },

  getDisplayCategoryName(record) {
    // 如果有二级分类信息，显示为"一级分类-二级分类"格式
    if (record.subCategoryName) {
      return `${record.categoryName}-${record.subCategoryName}`
    }
    // 否则只显示一级分类
    return record.categoryName
  },

  formatTime(timeString) {
    const date = new Date(timeString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 24 * 60 * 60 * 1000) {
      return '今天'
    } else if (diff < 2 * 24 * 60 * 60 * 1000) {
      return '昨天'
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
  },

  generateWeekData(records) {
    const weekData = []
    const now = new Date()
    const currentDay = now.getDay()
    
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now)
      day.setDate(now.getDate() - currentDay + i)
      
      const dayRecords = records.filter(record => {
        const recordDate = new Date(record.createTime)
        return recordDate.toDateString() === day.toDateString()
      })
      
      let dayExpense = 0
      dayRecords.forEach(record => {
        if (record.type === 'expense') {
          dayExpense += parseFloat(record.amount)
        }
      })
      
      weekData.push({
        day: ['日', '一', '二', '三', '四', '五', '六'][day.getDay()],
        expense: dayExpense
      })
    }
    
    return weekData
  },

  goToAdd() {
    wx.navigateTo({
      url: '/pages/records/add/add'
    })
  },

  quickAdd(e) {
    const category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: `/pages/records/add/add?category=${JSON.stringify(category)}`
    })
  },

  viewAllRecords() {
    wx.switchTab({
      url: '/pages/records/records'
    })
  }
})
