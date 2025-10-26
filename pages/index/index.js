const app = getApp()
// const Record = require('../../utils/Record.js')

// const Record = app.utils.Record

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
    const commonCategories = app.utils.CategoryManager.prototype.getCommonCategories.call(new app.utils.CategoryManager())
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
    const recentRecords = records.slice(0, 5).map(recordData => {
      // 使用Record类处理数据
      const record = new app.utils.Record(recordData)
      const category = this.getCategoryInfo(record.categoryId, record.type)
      return {
        ...record.toObject(),
        categoryIcon: category.icon,
        categoryName: record.getDisplayCategoryName(),
        accountDisplay: record.getDisplayAccountName(),
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


  getCategoryInfo(categoryId, type) {
    return app.getCategoryInfo(categoryId, type)
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
