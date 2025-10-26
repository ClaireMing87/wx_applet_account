const app = getApp()
// const Record = require('../../../utils/Record')
// const Record = app.utils.Record
Page({
  data: {
    recordType: 'expense',
    amount: '',
    selectedCategory: {},
    note: '',
    date: '',
    categories: [],
    canSave: false,
    selectedAccount: '未选择账户',
    showSubMenu: false,
    currentSubMenu: '',
    subMenuItems: [],
    selectedParentCategory: null,
    dateTime: '', // 完整的日期时间
    dateTimeRange: [], // 日期时间选择器的数据
    dateTimeValue: [0, 0, 0, 0, 0], // 日期时间选择器的值 [年, 月, 日, 时, 分]
    includeInMonthly: true, // 兼容旧字段
    budgetScope: 'month', // 'month' | 'year' | 'none'
    selectedAccountName: '',
    selectedAccountIcon: '',
    selectedTag: null,
    selectedTemplate: null,
    keyboardRows: [
      ['1', '2', '3', '⌫'],
      ['4', '5', '6', '+'],
      ['7', '8', '9', '-'],
      ['0', '.', 'C', '保存']
    ],
    subMenus: {
      account: [
        { id: 'fanka', name: '饭卡', icon: '💳' },
        { id: 'alipay', name: '支付宝', icon: '📱' },
        { id: 'wechat', name: '微信', icon: '💚' },
        { id: 'credit', name: '福利卡', icon: '🎁' },
        { id: 'salary', name: '工资卡', icon: '💰' },
        { id: 'other', name: '其他', icon: '📝' }
      ],
      budget: [
        // { id: 'daily', name: '日预算', icon: '📅' },
        // { id: 'weekly', name: '周预算', icon: '📊' },
        // { id: 'monthly', name: '月预算', icon: '📈' },
        // { id: 'yearly', name: '年预算', icon: '📋' },
        // { id: 'custom', name: '自定义', icon: '⚙️' }
      ],
      tag: [
        { id: 'urgent', name: '紧急', icon: '🚨' },
        { id: 'important', name: '重要', icon: '⭐' },
        { id: 'work', name: '工作', icon: '💼' },
        { id: 'personal', name: '个人', icon: '👤' },
        { id: 'family', name: '家庭', icon: '👨‍👩‍👧‍👦' },
        { id: 'travel', name: '旅行', icon: '✈️' }
      ],
      template: [
        // { id: 'breakfast', name: '早餐', icon: '🌅' },
        // { id: 'lunch', name: '午餐', icon: '🌞' },
        // { id: 'dinner', name: '晚餐', icon: '🌙' },
        // { id: 'coffee', name: '咖啡', icon: '☕' },
        // { id: 'transport', name: '交通', icon: '🚗' },
        // { id: 'shopping', name: '购物', icon: '🛒' }
      ]
    }
  },

  setEditData(recordData) {
    if (!recordData) return
    
    // 使用Record类处理数据
    const record = new app.utils.Record(recordData)
    
    this.setData({
      recordType: record.type,
      amount: String(record.amount),
      selectedCategory: {
        id: record.categoryId,
        name: record.categoryName,
        icon: record.categoryIcon,
        subId: record.subCategoryId,
        subName: record.subCategoryName,
        subIcon: record.subCategoryIcon
      },
      selectedAccount: record.account,
      selectedAccountName: record.accountName || '',
      selectedAccountIcon: record.accountIcon || '',
      note: record.note || '',
      date: record.date,
      dateTime: record.dateTime,
      budgetScope: record.budgetScope || (record.includeInMonthly === false ? 'year' : 'month'),
      includeInMonthly: record.includeInMonthly !== false,
      editingId: record.id
    })
    this.updateCategories()
    this.checkCanSave()
  },

  onLoad(options) {
    console.log('add页面的onLoad options', options)
    // 设置默认日期为今天
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    const displayDate = this.formatDateForDisplay(dateStr)
    
    // 初始化日期时间选择器数据
    this.initDateTimeRange()
    
    // 设置默认时间
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1
    const currentDay = today.getDate()
    const currentHour = today.getHours()
    const currentMinute = today.getMinutes()
    
    const dateTimeValue = [
      currentYear - 2020, // 年份索引 (从2020年开始)
      currentMonth - 1,   // 月份索引 (0-11)
      currentDay - 1,     // 日期索引 (0-30)
      currentHour,        // 小时索引 (0-23)
      currentMinute       // 分钟索引 (0-59)
    ]
    
    const dateTime = `${dateStr} ${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`
    
    this.setData({
      date: dateStr,
      displayDate: displayDate,
      dateTime: dateTime,
      dateTimeValue: dateTimeValue,
      recordType: 'expense'
    })

    // 编辑模式：预填充
    if (options.edit) {
      try {
        const recordData = JSON.parse(decodeURIComponent(options.edit))
        console.log('add页面的onLoad record', recordData)
        this.setEditData(recordData)
      } catch (e) { console.error('编辑参数解析失败', e) }
    }

    // 如果有预选分类
    if (options.category) {
      try {
        const category = JSON.parse(options.category)
        this.setData({
          recordType: category.type,
          selectedCategory: category
        })
      } catch (e) {
        console.error('解析分类参数失败:', e)
      }
    }

    this.updateCategories()
    
    // 默认选中餐饮-三餐分类
    this.setData({
      selectedCategory: {
        id: 1,
        name: '餐饮',
        icon: '🍽️',
        subId: 'meals',
        subName: '三餐',
        subIcon: '🍚'
      }
    })
    
    // 默认选中饭卡账户
    this.setData({
      selectedAccount: 'fanka',
      selectedAccountName: '饭卡',
      selectedAccountIcon: '💳'
    })
    
    this.checkCanSave()
  },

  updateCategories() {
    const categories = app.getCategories(this.data.recordType)
    this.setData({
      categories: categories
    })
  },

  initDateTimeRange() {
    // 生成年份数据 (2020-2030)
    const years = []
    for (let i = 2020; i <= 2030; i++) {
      years.push(i + '年')
    }
    
    // 生成月份数据 (1-12)
    const months = []
    for (let i = 1; i <= 12; i++) {
      months.push(i + '月')
    }
    
    // 生成日期数据 (1-31)
    const days = []
    for (let i = 1; i <= 31; i++) {
      days.push(i + '日')
    }
    
    // 生成小时数据 (0-23)
    const hours = []
    for (let i = 0; i < 24; i++) {
      hours.push(String(i).padStart(2, '0') + '时')
    }
    
    // 生成分钟数据 (0-59)
    const minutes = []
    for (let i = 0; i < 60; i++) {
      minutes.push(String(i).padStart(2, '0') + '分')
    }
    
    this.setData({
      dateTimeRange: [years, months, days, hours, minutes]
    })
  },

  selectType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      recordType: type,
      selectedCategory: {}
    })
    this.updateCategories()
    
    // 如果选择收入，设置默认分类为工资，默认账户为工资卡
    if (type === 'income') {
      this.setData({
        selectedCategory: {
          id: 17,
          name: '工资',
          icon: '💰'
        },
        selectedAccount: 'salary',
        selectedAccountName: '工资卡',
        selectedAccountIcon: '💰'
      })
    } else {
      // 如果选择支出，重置账户选择
      this.setData({
        selectedAccount: '未选择账户',
        selectedAccountName: '',
        selectedAccountIcon: ''
      })
    }
    
    this.checkCanSave()
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category
    // 使用CategoryManager获取二级分类
    const subMenuItems = app.getSubCategories(category.id)
    
    if (subMenuItems && subMenuItems.length > 0) {
      // 如果有二级分类，显示二级分类选择
      this.setData({
        showSubMenu: true,
        currentSubMenu: 'category',
        subMenuItems: subMenuItems,
        selectedParentCategory: category
      })
    } else {
      // 如果没有二级分类，直接选择
      this.setData({
        selectedCategory: category
      })
      this.checkCanSave()
    }
  },

  selectAccount(e) {
    const menu = e.currentTarget.dataset.account
    const subMenuItems = this.data.subMenus[menu] || []
    this.setData({
      showSubMenu: true,
      currentSubMenu: menu,
      subMenuItems: subMenuItems
    })
  },

  selectSubMenuItem(e) {
    const item = e.currentTarget.dataset.item
    const menuType = this.data.currentSubMenu
    
    if (menuType === 'category') {
      // 处理分类选择
      const parentCategory = this.data.selectedParentCategory
      const selectedCategory = {
        id: parentCategory.id,
        name: parentCategory.name,
        icon: parentCategory.icon,
        subId: item.id,
        subName: item.name,
        subIcon: item.icon
      }
      
      this.setData({
        selectedCategory: selectedCategory,
        showSubMenu: false
      })
      this.checkCanSave()
    } else if (menuType === 'account') {
      // 处理账户选择
      this.setData({
        selectedAccount: item.id,
        selectedAccountName: item.name,
        selectedAccountIcon: item.icon,
        showSubMenu: false
      })
    } else if (menuType === 'tag') {
      this.setData({
        selectedTag: item,
        showSubMenu: false
      })
    } else if (menuType === 'template') {
      this.setData({
        selectedTemplate: item,
        showSubMenu: false
      })
    } else {
      // 预算/标签/模板 不需修改 selectedAccount
      this.setData({ showSubMenu: false })
    }
  },

  closeSubMenu() {
    this.setData({
      showSubMenu: false
    })
  },

  onKeyPress(e) {
    const key = e.currentTarget.dataset.key
    let amount = this.data.amount || ''
    
    if (key === 'C') {
      // 清除
      amount = ''
    } else if (key === '⌫') {
      // 删除最后一位
      amount = amount.slice(0, -1)
    } else if (key === '保存') {
      // 保存记录
      this.saveRecord()
      return
    } else if (key === '+') {
      // 加号（可以用于快速计算，这里暂时忽略）
      return
    } else if (key === '-') {
      // 减号（可以用于快速计算，这里暂时忽略）
      return
    } else if (key === '.') {
      // 小数点处理
      if (!amount.includes('.')) {
        amount += '.'
      }
    } else {
      // 数字处理
      if (amount === '0' && key !== '.') {
        amount = key
      } else {
        amount += key
      }
      
      // 限制小数点后最多两位
      if (amount.includes('.')) {
        const parts = amount.split('.')
        if (parts[1] && parts[1].length > 2) {
          amount = parts[0] + '.' + parts[1].substring(0, 2)
        }
      }
      
      // 限制整数部分长度
      if (!amount.includes('.')) {
        if (amount.length > 8) {
          amount = amount.substring(0, 8)
        }
      } else {
        const integerPart = amount.split('.')[0]
        if (integerPart.length > 8) {
          amount = integerPart.substring(0, 8) + '.' + amount.split('.')[1]
        }
      }
    }
    
    this.setData({
      amount: amount
    })
    this.checkCanSave()
  },

  onNoteInput(e) {
    const note = e.detail.value
    this.setData({
      note: note
    })
  },

  onIncludeMonthlyChange(e) {
    const include = e.detail.value
    this.setData({ includeInMonthly: include, budgetScope: include ? 'month' : 'year' })
  },

  selectBudgetScope(e) {
    const value = e.currentTarget.dataset.value // month|year|none
    this.setData({
      budgetScope: value,
      includeInMonthly: value === 'month'
    })
  },

  onDateTimeChange(e) {
    const dateTimeValue = e.detail.value
    const [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex] = dateTimeValue
    
    // 计算实际的年月日时分
    const year = 2020 + yearIndex
    const month = monthIndex + 1
    const day = dayIndex + 1
    const hour = hourIndex
    const minute = minuteIndex
    
    // 格式化日期
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const displayDate = this.formatDateForDisplay(dateStr)
    const dateTime = `${dateStr} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    
    this.setData({
      date: dateStr,
      displayDate: displayDate,
      dateTime: dateTime,
      dateTimeValue: dateTimeValue
    })
  },

  formatTimeForDisplay(timeValue) {
    const hour = String(timeValue[0]).padStart(2, '0')
    const minute = String(timeValue[1]).padStart(2, '0')
    return `${hour}:${minute}`
  },

  formatDateForDisplay(dateStr) {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  },

  checkCanSave() {
    const canSave = this.data.amount && 
                   this.data.amount > 0 && 
                   this.data.selectedCategory.id
    this.setData({
      canSave: canSave
    })
  },

  saveRecord() {
    if (!this.data.canSave) {
      return
    }

    // 格式化金额
    let amount = this.data.amount
    if (!amount || amount === '') {
      wx.showToast({
        title: '请输入金额',
        icon: 'error'
      })
      return
    }

    // 确保金额格式正确
    if (amount.endsWith('.')) {
      amount = amount.slice(0, -1) // 移除末尾的小数点
    }
    
    // 使用Record类创建记录
    const record = new app.utils.Record({
      id: this.data.editingId || null,
      type: this.data.recordType,
      amount: parseFloat(amount),
      note: this.data.note,
      date: this.data.date,
      dateTime: this.data.dateTime,
      includeInMonthly: this.data.includeInMonthly,
      budgetScope: this.data.budgetScope
    })

    // 设置分类信息
    record.setCategory(this.data.selectedCategory)
    
    // 设置账户信息
    record.setAccount({
      id: this.data.selectedAccount,
      name: this.data.selectedAccountName,
      icon: this.data.selectedAccountIcon
    })

    // 验证记录
    const validation = record.validate()
    if (!validation.isValid) {
      wx.showToast({
        title: validation.errors[0],
        icon: 'error'
      })
      return
    }

    // 保存/更新记录
    if (this.data.editingId) {
      app.updateRecord(record.toObject())
    } else {
      app.addRecord(record.toObject())
    }

    // 显示成功提示
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000
    })

    // 根据模式决定返回页面
    setTimeout(() => {
      if (this.data.editingId) {
        // 编辑模式：返回账单列表页
        wx.switchTab({
          url: '/pages/records/records'
        })
      } else {
        // 新建模式：返回首页
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    }, 2000)
  },

  // 处理返回按钮
  onBack() {
    if (this.data.editingId) {
      // 编辑模式：返回账单列表页
      wx.switchTab({
        url: '/pages/records/records'
      })
    } else {
      // 新建模式：返回首页
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})
