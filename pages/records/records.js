const app = getApp()
// const Record = require('../../utils/Record.js')
// const Record = app.utils.Record
Page({
  data: {
    records: [],
    filteredRecords: [],
    touchStartX: 0,
    openId: null,
    // 筛选相关数据
    timeFilter: 'all',
    typeFilter: 'all',
    categoryFilter: 'all',
    accountFilter: 'all',
    filterTimeText: '全部时间',
    filterTypeText: '全部',
    filterCategoryText: '全部分类',
    filterAccountText: '全部账户',
    hasActiveFilters: false,
    showTimeFilter: false,
    showTypeFilter: false,
    showCategoryFilter: false,
    showAccountFilter: false,
    showCustomTimePicker: false,
    customStartDate: '',
    customEndDate: '',
    allCategories: [],
    filteredCategories: [],
    allAccounts: []
  },

  onShow() {
    this.loadRecords()
    this.initFilterData()
  },

  loadRecords() {
    const records = (app.globalData.records || []).map(recordData => {
      // 使用Record类处理数据
      const record = new app.utils.Record(recordData)
      const category = this.getCategoryInfo(record.categoryId, record.type)
      return {
        ...record.toObject(),
        categoryIcon: category.icon,
        categoryName: record.getDisplayCategoryName(),
        accountDisplay: record.getDisplayAccountName(),
        createTime: this.formatTime(record.createTime),
        offsetX: 0
      }
    })
    this.setData({ records })
    this.applyFilters()
  },

  getCategoryInfo(categoryId, type) {
    return app.getCategoryInfo(categoryId, type)
  },

  // Swipe handlers
  onTouchStart(e) {
    const touch = e.touches[0];
    this.setData({ 
      touchStartX: touch.clientX,
      touchStartY: touch.clientY,
      isSwiping: false
    });
  },

  onTouchMove(e) {
    const touch = e.touches[0];
    const moveX = touch.clientX;
    const moveY = touch.clientY;
    const deltaX = moveX - this.data.touchStartX;
    const deltaY = moveY - this.data.touchStartY;

    // 如果是垂直滑动，不处理
    if (Math.abs(deltaY) > Math.abs(deltaX) && !this.data.isSwiping) {
      return;
    }

    // 标记为水平滑动
    if (!this.data.isSwiping) {
      this.setData({ isSwiping: true });
    }

    const id = e.currentTarget.dataset.id;
    const max = -280; // 两个按钮的总宽度
    
    const records = this.data.records.map(r => {
      if (r.id === id) {
        // 确保滑动不超出范围
        let x = Math.min(0, Math.max(max, deltaX));
        return { ...r, offsetX: x };
      }
      // 关闭其他已打开的项
      if (r.offsetX < 0) {
        return { ...r, offsetX: 0 };
      }
      return r;
    });

    const filteredRecords = this.data.filteredRecords.map(r => {
      if (r.id === id) {
        // 确保滑动不超出范围
        let x = Math.min(0, Math.max(max, deltaX));
        return { ...r, offsetX: x };
      }
      // 关闭其他已打开的项
      if (r.offsetX < 0) {
        return { ...r, offsetX: 0 };
      }
      return r;
    });

    this.setData({ records, filteredRecords });
  },

  onTouchEnd(e) {
    if (!this.data.isSwiping) return;

    const id = e.currentTarget.dataset.id;
    const records = this.data.records.map(r => {
      if (r.id === id) {
        // 如果滑动超过一半，完全展开；否则收起
        const x = r.offsetX < -70 ? -280 : 0;
        return { ...r, offsetX: x };
      }
      return r;
    });

    const filteredRecords = this.data.filteredRecords.map(r => {
      if (r.id === id) {
        // 如果滑动超过一半，完全展开；否则收起
        const x = r.offsetX < -70 ? -280 : 0;
        return { ...r, offsetX: x };
      }
      return r;
    });

    this.setData({ 
      records,
      filteredRecords,
      isSwiping: false
    });
  },

  onDelete(e) {
    console.log('Delete button clicked', e);
    const id = e.currentTarget.dataset.id;
    if (!id) {
      console.error('No id found in delete event');
      return;
    }
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      success: (res) => {
        if (res.confirm) {
          app.deleteRecord(id);
          this.loadRecords();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onEdit(e) {
    console.log('Edit button clicked', e);
    const id = e.currentTarget.dataset.id;
    if (!id) {
      console.error('No id found in edit event');
      return;
    }
    // 跳转到编辑中转页
    wx.navigateTo({
      url: `/pages/records/edit/edit?id=${id}`,
      fail: (err) => {
        console.error('Navigation failed:', err);
        wx.showToast({
          title: '跳转失败',
          icon: 'error'
        });
      }
    });
  },


  formatTime(timeString) {
    const date = new Date(timeString)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}`
  },

  // 初始化筛选数据
  initFilterData() {
    // 获取所有分类
    const expenseCategories = app.getCategories('expense')
    const incomeCategories = app.getCategories('income')
    const allCategories = [...expenseCategories, ...incomeCategories]
    
    // 获取所有账户
    const allAccounts = [
      { id: 'fanka', name: '饭卡', icon: '💳' },
      { id: 'alipay', name: '支付宝', icon: '📱' },
      { id: 'wechat', name: '微信', icon: '💚' },
      { id: 'credit', name: '福利卡', icon: '🎁' },
      { id: 'salary', name: '工资卡', icon: '💰' },
      { id: 'other', name: '其他', icon: '📝' }
    ]
    
    this.setData({
      allCategories,
      allAccounts
    })
  },

  // 应用筛选
  applyFilters() {
    let filteredRecords = [...this.data.records]
    
    // 时间筛选
    if (this.data.timeFilter !== 'all') {
      filteredRecords = this.filterByTime(filteredRecords, this.data.timeFilter)
    }
    
    // 收支类型筛选
    if (this.data.typeFilter !== 'all') {
      filteredRecords = this.filterByType(filteredRecords, this.data.typeFilter)
    }
    
    // 分类筛选
    if (this.data.categoryFilter !== 'all') {
      filteredRecords = this.filterByCategory(filteredRecords, this.data.categoryFilter)
    }
    
    // 账户筛选
    if (this.data.accountFilter !== 'all') {
      filteredRecords = this.filterByAccount(filteredRecords, this.data.accountFilter)
    }
    
    // 更新活跃筛选状态
    this.updateActiveFilters()
    
    this.setData({
      filteredRecords
    })
  },

  // 时间筛选
  filterByTime(records, timeFilter) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return records.filter(record => {
      const recordDate = new Date(record.date)
      
      switch (timeFilter) {
        case 'today':
          return recordDate >= today
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return recordDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
          return recordDate >= monthAgo
        case 'year':
          const yearAgo = new Date(now.getFullYear(), 0, 1)
          return recordDate >= yearAgo
        case 'custom':
          const { customStartDate, customEndDate } = this.data
          if (customStartDate && customEndDate) {
            const startDate = new Date(customStartDate)
            const endDate = new Date(customEndDate)
            // 设置结束日期为当天的23:59:59，确保包含结束日期
            endDate.setHours(23, 59, 59, 999)
            return recordDate >= startDate && recordDate <= endDate
          }
          return true
        default:
          return true
      }
    })
  },

  // 收支类型筛选
  filterByType(records, typeFilter) {
    return records.filter(record => record.type === typeFilter)
  },

  // 分类筛选
  filterByCategory(records, categoryFilter) {
    return records.filter(record => record.categoryId == categoryFilter)
  },

  // 账户筛选
  filterByAccount(records, accountFilter) {
    return records.filter(record => record.account === accountFilter)
  },

  // 显示时间筛选弹窗
  showTimeFilter() {
    this.setData({ showTimeFilter: true })
  },

  // 隐藏时间筛选弹窗
  hideTimeFilter() {
    this.setData({ showTimeFilter: false })
  },

  // 选择时间筛选
  selectTimeFilter(e) {
    const value = e.currentTarget.dataset.value
    let filterTimeText = '全部时间'
    
    switch (value) {
      case 'today':
        filterTimeText = '今天'
        break
      case 'week':
        filterTimeText = '本周'
        break
      case 'month':
        filterTimeText = '本月'
        break
      case 'year':
        filterTimeText = '今年'
        break
      case 'custom':
        filterTimeText = '自定义'
        break
    }
    
    this.setData({
      timeFilter: value,
      filterTimeText,
      showTimeFilter: false
    })
    this.applyFilters()
  },

  // 显示自定义时间选择器
  showCustomTimePicker() {
    // 设置默认值：起始时间为三个月前，结束时间为今天
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    
    const todayStr = today.toISOString().split('T')[0]
    const threeMonthsAgoStr = threeMonthsAgo.toISOString().split('T')[0]
    
    this.setData({
      customStartDate: threeMonthsAgoStr,
      customEndDate: todayStr,
      showCustomTimePicker: true
    })
  },

  // 隐藏自定义时间选择器
  hideCustomTimePicker() {
    this.setData({
      showCustomTimePicker: false
    })
  },

  // 开始日期变化
  onStartDateChange(e) {
    const startDate = e.detail.value
    this.setData({
      customStartDate: startDate
    })
    // 选择开始日期后，返回到自定义时间选择页面
    setTimeout(() => {
      this.setData({
        showCustomTimePicker: true
      })
    }, 100)
  },

  // 结束日期变化
  onEndDateChange(e) {
    const endDate = e.detail.value
    this.setData({
      customEndDate: endDate
    })
    // 选择结束日期后，返回到自定义时间选择页面
    setTimeout(() => {
      this.setData({
        showCustomTimePicker: true
      })
    }, 100)
  },

  // 确认自定义时间
  confirmCustomTime() {
    const { customStartDate, customEndDate } = this.data
    
    // 验证日期范围
    if (new Date(customStartDate) > new Date(customEndDate)) {
      wx.showToast({
        title: '开始日期不能晚于结束日期',
        icon: 'none'
      })
      return
    }
    
    // 格式化显示文本
    const startText = this.formatDateForDisplay(customStartDate)
    const endText = this.formatDateForDisplay(customEndDate)
    const filterTimeText = `${startText} - ${endText}`
    
    this.setData({
      timeFilter: 'custom',
      filterTimeText,
      showCustomTimePicker: false,
      showTimeFilter: false  // 直接关闭所有弹窗
    })
    
    // 直接应用筛选
    this.applyFilters()
  },

  // 格式化日期显示
  formatDateForDisplay(dateStr) {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  },


  // 显示收支筛选弹窗
  showTypeFilter() {
    this.setData({ showTypeFilter: true })
  },

  // 隐藏收支筛选弹窗
  hideTypeFilter() {
    this.setData({ showTypeFilter: false })
  },

  // 选择收支筛选
  selectTypeFilter(e) {
    const value = e.currentTarget.dataset.value
    let filterTypeText = '全部'
    
    if (value === 'expense') {
      filterTypeText = '支出'
    } else if (value === 'income') {
      filterTypeText = '收入'
    }
    
    // 更新分类选项
    this.updateFilteredCategories(value)
    
    // 如果选择了收支类型，重置分类筛选
    if (value !== 'all') {
      this.setData({
        categoryFilter: 'all',
        filterCategoryText: '全部分类'
      })
    }
    
    this.setData({
      typeFilter: value,
      filterTypeText,
      showTypeFilter: false
    })
    this.applyFilters()
  },

  // 更新分类选项
  updateFilteredCategories(typeFilter) {
    let filteredCategories = []
    
    if (typeFilter === 'expense') {
      filteredCategories = app.getCategories('expense')
    } else if (typeFilter === 'income') {
      filteredCategories = app.getCategories('income')
    }
    
    this.setData({
      filteredCategories
    })
  },

  // 显示分类筛选弹窗
  showCategoryFilter() {
    // 如果没有选择收支类型，提示用户
    if (this.data.typeFilter === 'all') {
      wx.showToast({
        title: '请先选择收支类型',
        icon: 'none'
      })
      return
    }
    this.setData({ showCategoryFilter: true })
  },

  // 隐藏分类筛选弹窗
  hideCategoryFilter() {
    this.setData({ showCategoryFilter: false })
  },

  // 选择分类筛选
  selectCategoryFilter(e) {
    const value = e.currentTarget.dataset.value
    let filterCategoryText = '全部分类'
    
    if (value !== 'all') {
      const category = this.data.filteredCategories.find(cat => cat.id == value)
      if (category) {
        filterCategoryText = category.name
      }
    }
    
    this.setData({
      categoryFilter: value,
      filterCategoryText,
      showCategoryFilter: false
    })
    this.applyFilters()
  },

  // 显示账户筛选弹窗
  showAccountFilter() {
    this.setData({ showAccountFilter: true })
  },

  // 隐藏账户筛选弹窗
  hideAccountFilter() {
    this.setData({ showAccountFilter: false })
  },

  // 选择账户筛选
  selectAccountFilter(e) {
    const value = e.currentTarget.dataset.value
    let filterAccountText = '全部账户'
    
    if (value !== 'all') {
      const account = this.data.allAccounts.find(acc => acc.id === value)
      if (account) {
        filterAccountText = account.name
      }
    }
    
    this.setData({
      accountFilter: value,
      filterAccountText,
      showAccountFilter: false
    })
    this.applyFilters()
  },

  // 清除时间筛选
  clearTimeFilter() {
    this.setData({
      timeFilter: 'all',
      filterTimeText: '全部时间',
      customStartDate: '',
      customEndDate: ''
    })
    this.updateActiveFilters()
    this.applyFilters()
  },

  // 清除收支筛选
  clearTypeFilter() {
    this.setData({
      typeFilter: 'all',
      filterTypeText: '全部',
      categoryFilter: 'all',
      filterCategoryText: '全部分类',
      filteredCategories: []
    })
    this.updateActiveFilters()
    this.applyFilters()
  },

  // 清除分类筛选
  clearCategoryFilter() {
    this.setData({
      categoryFilter: 'all',
      filterCategoryText: '全部分类'
    })
    this.updateActiveFilters()
    this.applyFilters()
  },

  // 清除账户筛选
  clearAccountFilter() {
    this.setData({
      accountFilter: 'all',
      filterAccountText: '全部账户'
    })
    this.updateActiveFilters()
    this.applyFilters()
  },

  // 更新活跃筛选状态
  updateActiveFilters() {
    const hasActiveFilters = this.data.timeFilter !== 'all' || 
                           this.data.typeFilter !== 'all' ||
                           this.data.categoryFilter !== 'all' || 
                           this.data.accountFilter !== 'all'
    
    this.setData({
      hasActiveFilters
    })
  },

  // 清除所有筛选
  clearFilters() {
    this.setData({
      timeFilter: 'all',
      typeFilter: 'all',
      categoryFilter: 'all',
      accountFilter: 'all',
      filterTimeText: '全部时间',
      filterTypeText: '全部',
      filterCategoryText: '全部分类',
      filterAccountText: '全部账户',
      hasActiveFilters: false,
      filteredCategories: []
    })
    this.applyFilters()
  }
})


