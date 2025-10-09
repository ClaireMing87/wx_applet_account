const app = getApp()

Page({
  data: {
    yearBudgetInput: '',
    monthBudgetInput: '',
    diffBudgetDisplay: '0.00'
  },

  onLoad() {
    const { yearBudget, monthBudget } = app.globalData.budget || { yearBudget: 0, monthBudget: 0 }
    this.setData({
      yearBudgetInput: yearBudget ? String(yearBudget) : '',
      monthBudgetInput: monthBudget ? String(monthBudget) : ''
    })
    this.updateDiff()
  },

  onYearBudgetInput(e) {
    this.setData({ yearBudgetInput: e.detail.value })
    this.updateDiff()
  },

  onMonthBudgetInput(e) {
    this.setData({ monthBudgetInput: e.detail.value })
    this.updateDiff()
  },

  updateDiff() {
    const y = parseFloat(this.data.yearBudgetInput)
    const m = parseFloat(this.data.monthBudgetInput)
    if (!isNaN(y) && !isNaN(m)) {
      const diff = y - m * 12
      this.setData({ diffBudgetDisplay: diff.toFixed(2) })
    } else {
      this.setData({ diffBudgetDisplay: '0.00' })
    }
  },

  saveBudget() {
    const yearBudget = parseFloat(this.data.yearBudgetInput) || 0
    const monthBudget = parseFloat(this.data.monthBudgetInput) || 0

    if (yearBudget < monthBudget * 12) {
      wx.showToast({ title: '年预算需 ≥ 月预算×12', icon: 'none' })
      return
    }

    app.globalData.budget = { yearBudget, monthBudget }
    wx.setStorageSync('budget', app.globalData.budget)

    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack({ delta: 1 }), 800)
  }
})


