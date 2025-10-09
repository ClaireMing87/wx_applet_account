const app = getApp()

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
    },
    categorySubMenus: {
      1: [ // 餐饮
        { id: 'null', name: '餐饮', icon: '🍽️' },
        { id: 'meals', name: '三餐', icon:  '🍚'},
        { id: 'snacks', name: '零食', icon: '🍿' },
        { id: 'ingredients', name: '食材', icon: '🥬' },
        { id: 'groceries', name: '柴米油盐', icon: '🧂' },
        { id: 'coffee', name: '咖啡', icon: '☕' },
        { id: 'drinks', name: '饮料', icon: '🥤' }
      ],
      2: [ // 交通
        { id: 'null', name: '交通', icon: '🚗' },
        { id: 'bus', name: '公交', icon: '🚌' },
        { id: 'subway', name: '地铁', icon: '🚇' },
        { id: 'taxi', name: '出租车', icon: '🚕' },
        { id: 'gas', name: '加油', icon: '⛽' },
        { id: 'parking', name: '停车', icon: '🅿️' },
        { id: 'maintenance', name: '保养', icon: '🔧' }
      ],
      3: [ // 购物
        { id: 'null', name: '购物', icon: '🛒' },
        { id: 'clothes', name: '服装', icon: '👕' },
        { id: 'electronics', name: '数码', icon: '📱' },
        { id: 'cosmetics', name: '化妆品', icon: '💄' },
        { id: 'books', name: '图书', icon: '📚' },
        { id: 'furniture', name: '家具', icon: '🪑' },
        { id: 'daily', name: '日用品', icon: '🧴' }
      ],
      4: [ // 娱乐
        { id: 'movie', name: '电影', icon: '🎬' },
        { id: 'game', name: '游戏', icon: '🎮' },
        { id: 'music', name: '音乐', icon: '🎵' },
        { id: 'sports', name: '运动', icon: '⚽' },
        { id: 'travel', name: '旅游', icon: '✈️' },
        { id: 'party', name: '聚会', icon: '🎉' }
      ],
      5: [ // 医疗
        { id: 'medicine', name: '药品', icon: '💊' },
        { id: 'hospital', name: '医院', icon: '🏥' },
        { id: 'checkup', name: '体检', icon: '🩺' },
        { id: 'dental', name: '牙科', icon: '🦷' },
        { id: 'optical', name: '眼科', icon: '👓' },
        { id: 'health', name: '保健品', icon: '💊' }
      ],
      6: [ // 教育
        { id: 'tuition', name: '学费', icon: '🎓' },
        { id: 'books', name: '教材', icon: '📖' },
        { id: 'course', name: '课程', icon: '📝' },
        { id: 'training', name: '培训', icon: '🎯' },
        { id: 'exam', name: '考试', icon: '📋' },
        { id: 'stationery', name: '文具', icon: '✏️' }
      ],
      7: [ // 住房
        { id: 'rent', name: '房租', icon: '🏠' },
        { id: 'mortgage', name: '房贷', icon: '🏡' },
        { id: 'utilities', name: '水电费', icon: '💡' },
        { id: 'internet', name: '网络', icon: '📶' },
        { id: 'furniture', name: '家具', icon: '🪑' },
        { id: 'decoration', name: '装修', icon: '🎨' }
      ],
      8: [ // 通讯
        { id: 'phone', name: '话费', icon: '📱' },
        { id: 'internet', name: '宽带', icon: '📶' },
        { id: 'app', name: '应用', icon: '📲' },
        { id: 'service', name: '服务费', icon: '🔧' }
      ],
      9: [ // 服装
        { id: 'clothes', name: '衣服', icon: '👕' },
        { id: 'shoes', name: '鞋子', icon: '👟' },
        { id: 'accessories', name: '配饰', icon: '👒' },
        { id: 'underwear', name: '内衣', icon: '👙' },
        { id: 'bags', name: '包包', icon: '👜' },
        { id: 'jewelry', name: '首饰', icon: '💍' }
      ],
      10: [ // 美容
        { id: 'skincare', name: '护肤', icon: '🧴' },
        { id: 'makeup', name: '彩妆', icon: '💄' },
        { id: 'hair', name: '美发', icon: '💇' },
        { id: 'nails', name: '美甲', icon: '💅' },
        { id: 'spa', name: 'SPA', icon: '🧖' },
        { id: 'fitness', name: '健身', icon: '💪' }
      ],
      11: [ // 运动
        { id: 'gym', name: '健身房', icon: '💪' },
        { id: 'equipment', name: '器材', icon: '🏋️' },
        { id: 'clothes', name: '运动服', icon: '👕' },
        { id: 'shoes', name: '运动鞋', icon: '👟' },
        { id: 'coach', name: '教练', icon: '👨‍🏫' },
        { id: 'competition', name: '比赛', icon: '🏆' }
      ],
      12: [ // 旅行
        { id: 'flight', name: '机票', icon: '✈️' },
        { id: 'hotel', name: '酒店', icon: '🏨' },
        { id: 'train', name: '火车', icon: '🚄' },
        { id: 'food', name: '餐饮', icon: '🍽️' },
        { id: 'ticket', name: '门票', icon: '🎫' },
        { id: 'shopping', name: '购物', icon: '🛒' }
      ],
      13: [ // 保险
        { id: 'health', name: '健康险', icon: '🏥' },
        { id: 'life', name: '人寿险', icon: '👤' },
        { id: 'car', name: '车险', icon: '🚗' },
        { id: 'property', name: '财产险', icon: '🏠' },
        { id: 'travel', name: '旅游险', icon: '✈️' },
        { id: 'accident', name: '意外险', icon: '🛡️' }
      ],
      14: [ // 水电
        { id: 'electricity', name: '电费', icon: '💡' },
        { id: 'water', name: '水费', icon: '💧' },
        { id: 'gas', name: '燃气费', icon: '🔥' },
        { id: 'heating', name: '暖气费', icon: '🌡️' },
        { id: 'trash', name: '垃圾费', icon: '🗑️' },
        { id: 'management', name: '物业费', icon: '🏢' }
      ],
      15: [ // 维修
        { id: 'home', name: '房屋维修', icon: '🏠' },
        { id: 'appliance', name: '家电维修', icon: '🔧' },
        { id: 'car', name: '汽车维修', icon: '🚗' },
        { id: 'phone', name: '手机维修', icon: '📱' },
        { id: 'computer', name: '电脑维修', icon: '💻' },
        { id: 'other', name: '其他维修', icon: '🔨' }
      ],
      16: [ // 其他
        { id: 'gift', name: '礼品', icon: '🎁' },
        { id: 'donation', name: '捐赠', icon: '❤️' },
        { id: 'fine', name: '罚款', icon: '💰' },
        { id: 'fee', name: '手续费', icon: '💳' },
        { id: 'other', name: '其他', icon: '📝' }
      ]
    }
  },

  setEditData(record) {
    if (!record) return
    
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
        const record = JSON.parse(decodeURIComponent(options.edit))
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
          selectedAccountName: '',
          selectedAccountIcon: '',
          note: record.note || '',
          date: record.date || dateStr,
          dateTime: record.dateTime || dateTime,
          budgetScope: record.budgetScope || (record.includeInMonthly === false ? 'year' : 'month'),
          includeInMonthly: record.includeInMonthly !== false,
          editingId: record.id
        })
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
    const categories = app.globalData.categories[this.data.recordType]
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
    this.checkCanSave()
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category
    // 合并默认与自定义子类
    const custom = (app.globalData.customSubMenus || {})[category.id] || []
    const defaults = this.data.categorySubMenus[category.id] || []
    const subMenuItems = [...defaults, ...custom]
    
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
    
        const record = {
          type: this.data.recordType,
          amount: parseFloat(amount),
          categoryId: this.data.selectedCategory.id,
          categoryName: this.data.selectedCategory.name,
          categoryIcon: this.data.selectedCategory.icon,
          subCategoryId: this.data.selectedCategory.subId || null,
          subCategoryName: this.data.selectedCategory.subName || null,
          subCategoryIcon: this.data.selectedCategory.subIcon || null,
          account: this.data.selectedAccount,
          note: this.data.note,
          date: this.data.date,
          dateTime: this.data.dateTime,
          includeInMonthly: this.data.includeInMonthly,
          budgetScope: this.data.budgetScope
        }

    // 保存/更新记录
    if (this.data.editingId) {
      record.id = this.data.editingId
      app.updateRecord(record)
    } else {
      app.addRecord(record)
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
