const app = getApp()

Page({
  data: {
    selectedMonth: '',
    totalExpense: 0,
    totalIncome: 0,
    balance: 0,
    expenseCategories: [],
    incomeCategories: [],
    dailyTrend: []
  },

  onLoad() {
    // 设置默认月份为当前月
    const now = new Date()
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
    
    this.setData({
      selectedMonth: currentMonth
    })
    
    this.calculateStatistics()
  },

  onShow() {
    this.calculateStatistics()
  },

  onMonthChange(e) {
    const month = e.detail.value
    this.setData({
      selectedMonth: month
    })
    this.calculateStatistics()
  },

  calculateStatistics() {
    const records = app.globalData.records
    const [year, month] = this.data.selectedMonth.split('-')
    
    // 筛选指定月份的记录
    const monthRecords = records.filter(record => {
      const recordDate = new Date(record.createTime)
      return recordDate.getFullYear() == year && 
             recordDate.getMonth() + 1 == month
    })

    // 计算总收支
    let totalExpense = 0
    let totalIncome = 0
    
    monthRecords.forEach(record => {
      if (record.type === 'expense') {
        totalExpense += parseFloat(record.amount)
      } else {
        totalIncome += parseFloat(record.amount)
      }
    })

    const balance = totalIncome - totalExpense

    // 计算分类统计
    const expenseCategories = this.calculateCategoryStats(monthRecords, 'expense', totalExpense)
    const incomeCategories = this.calculateCategoryStats(monthRecords, 'income', totalIncome)

    // 计算每日趋势
    const dailyTrend = this.calculateDailyTrend(monthRecords)

    this.setData({
      totalExpense: totalExpense.toFixed(2),
      totalIncome: totalIncome.toFixed(2),
      balance: balance.toFixed(2),
      expenseCategories: expenseCategories,
      incomeCategories: incomeCategories,
      dailyTrend: dailyTrend
    })
  },

  calculateCategoryStats(records, type, total) {
    const categoryMap = new Map()
    
    // 统计每个分类的金额
    records.forEach(record => {
      if (record.type === type) {
        const categoryId = record.categoryId
        const displayName = this.getDisplayCategoryName(record)
        const key = `${categoryId}-${displayName}` // 使用组合键避免重复
        
        if (categoryMap.has(key)) {
          categoryMap.set(key, {
            ...categoryMap.get(key),
            amount: categoryMap.get(key).amount + parseFloat(record.amount)
          })
        } else {
          const category = this.getCategoryInfo(record.categoryId, type)
          categoryMap.set(key, {
            id: categoryId,
            name: displayName,
            icon: category.icon,
            amount: parseFloat(record.amount)
          })
        }
      }
    })

    // 转换为数组并计算百分比
    const stats = []
    
    categoryMap.forEach((categoryData) => {
      const percentage = total > 0 ? ((categoryData.amount / total) * 100).toFixed(1) : 0
      stats.push({
        id: categoryData.id,
        name: categoryData.name,
        icon: categoryData.icon,
        amount: categoryData.amount.toFixed(2),
        percentage: percentage
      })
    })

    // 按金额排序
    return stats.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
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

  calculateDailyTrend(records) {
    const dailyMap = new Map()
    
    // 统计每日收支
    records.forEach(record => {
      const date = record.createTime.split('T')[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { expense: 0, income: 0 })
      }
      
      if (record.type === 'expense') {
        dailyMap.get(date).expense += parseFloat(record.amount)
      } else {
        dailyMap.get(date).income += parseFloat(record.amount)
      }
    })

    // 转换为数组并计算图表高度
    const trend = []
    const maxAmount = Math.max(
      ...Array.from(dailyMap.values()).map(day => Math.max(day.expense, day.income)),
      1
    )

    dailyMap.forEach((amounts, date) => {
      const expenseHeight = (amounts.expense / maxAmount) * 100
      const incomeHeight = (amounts.income / maxAmount) * 100
      
      trend.push({
        date: this.formatDate(date),
        expense: amounts.expense.toFixed(2),
        income: amounts.income.toFixed(2),
        expenseHeight: expenseHeight,
        incomeHeight: incomeHeight
      })
    })

    // 按日期排序
    return trend.sort((a, b) => new Date(a.date) - new Date(b.date))
  },

  formatDate(dateString) {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
})
