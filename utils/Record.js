/**
 * Record类 - 记账记录管理
 * 用于创建、验证和管理记账记录数据
 */
function Record(data) {
  data = data || {}
  
  // 基础信息
  this.id = data.id || null
  this.type = data.type || 'expense' // 'expense' | 'income'
  this.amount = data.amount || 0
  this.note = data.note || ''
  
  // 分类信息
  this.categoryId = data.categoryId || null
  this.categoryName = data.categoryName || ''
  this.categoryIcon = data.categoryIcon || ''
  this.subCategoryId = data.subCategoryId || null
  this.subCategoryName = data.subCategoryName || ''
  this.subCategoryIcon = data.subCategoryIcon || ''
  
  // 账户信息
  this.account = data.account || ''
  this.accountName = data.accountName || ''
  this.accountIcon = data.accountIcon || ''
  
  // 时间信息
  this.date = data.date || this.getCurrentDate()
  this.dateTime = data.dateTime || this.getCurrentDateTime()
  this.createTime = data.createTime || new Date().toISOString()
  
  // 预算相关
  this.includeInMonthly = data.includeInMonthly !== undefined ? data.includeInMonthly : true
  this.budgetScope = data.budgetScope || 'month' // 'month' | 'year' | 'none'
  
  // 标签和模板（预留）
  this.tag = data.tag || null
  this.template = data.template || null
}

/**
 * 获取当前日期字符串 (YYYY-MM-DD)
 */
Record.prototype.getCurrentDate = function() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

/**
 * 获取当前日期时间字符串 (YYYY-MM-DD HH:mm)
 */
Record.prototype.getCurrentDateTime = function() {
  const now = new Date()
  const date = now.toISOString().split('T')[0]
  const time = now.toTimeString().split(' ')[0].substring(0, 5)
  return date + ' ' + time
}

/**
 * 验证记录数据是否有效
 */
Record.prototype.validate = function() {
  const errors = []
  
  if (!this.type || (this.type !== 'expense' && this.type !== 'income')) {
    errors.push('记录类型必须为支出或收入')
  }
  
  if (!this.amount || this.amount <= 0) {
    errors.push('金额必须大于0')
  }
  
  if (!this.categoryId) {
    errors.push('必须选择分类')
  }
  
  if (!this.account) {
    errors.push('必须选择账户')
  }
  
  if (!this.date) {
    errors.push('日期不能为空')
  }
  
  if (!this.dateTime) {
    errors.push('时间不能为空')
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  }
}

/**
 * 设置分类信息
 */
Record.prototype.setCategory = function(category) {
  this.categoryId = category.id
  this.categoryName = category.name
  this.categoryIcon = category.icon
  
  if (category.subId) {
    this.subCategoryId = category.subId
    this.subCategoryName = category.subName
    this.subCategoryIcon = category.subIcon
  }
}

/**
 * 设置账户信息
 */
Record.prototype.setAccount = function(account) {
  this.account = account.id || account
  this.accountName = account.name || ''
  this.accountIcon = account.icon || ''
}

/**
 * 设置时间信息
 */
Record.prototype.setDateTime = function(date, time) {
  this.date = date
  this.dateTime = date + ' ' + time
  this.createTime = new Date(this.dateTime).toISOString()
}

/**
 * 设置预算范围
 */
Record.prototype.setBudgetScope = function(scope) {
  this.budgetScope = scope
  this.includeInMonthly = scope === 'month'
}

/**
 * 获取显示用的分类名称
 */
Record.prototype.getDisplayCategoryName = function() {
  if (this.subCategoryName && this.subCategoryName !== this.categoryName) {
    return this.categoryName + '-' + this.subCategoryName
  }
  return this.categoryName
}

/**
 * 获取完整的分类信息（包含一级和二级分类）
 * @param {Object} app - 应用实例
 * @returns {Object} 完整分类信息
 */
Record.prototype.getFullCategoryInfo = function(app) {
  if (!app || !app.utils || !app.utils.CategoryManager) {
    return {
      category: { id: this.categoryId, name: this.categoryName, icon: this.categoryIcon },
      subCategory: this.subCategoryId ? { id: this.subCategoryId, name: this.subCategoryName, icon: this.subCategoryIcon } : null,
      displayName: this.getDisplayCategoryName()
    }
  }
  
  const categoryManager = new app.utils.CategoryManager()
  return categoryManager.getFullCategoryInfo(
    this.categoryId, 
    this.subCategoryId, 
    this.type, 
    app.globalData.customSubMenus || {}
  )
}

/**
 * 获取显示用的账户名称
 */
Record.prototype.getDisplayAccountName = function() {
  if (this.accountName) {
    return this.accountName
  }
  
  const accountMap = {
    'cash': '现金',
    'bank': '银行卡',
    'alipay': '支付宝',
    'wechat': '微信',
    'fanka': '饭卡',
    'credit': '福利卡',
    'other': '其他'
  }
  
  return accountMap[this.account] || this.account || '账户'
}

/**
 * 获取格式化的金额显示
 */
Record.prototype.getFormattedAmount = function() {
  return '¥' + this.amount.toFixed(2)
}

/**
 * 获取带符号的金额显示
 */
Record.prototype.getSignedAmount = function() {
  const sign = this.type === 'expense' ? '-' : '+'
  return sign + '¥' + this.amount.toFixed(2)
}

/**
 * 转换为普通对象（用于存储和传输）
 */
Record.prototype.toObject = function() {
  return {
    id: this.id,
    type: this.type,
    amount: this.amount,
    note: this.note,
    categoryId: this.categoryId,
    categoryName: this.categoryName,
    categoryIcon: this.categoryIcon,
    subCategoryId: this.subCategoryId,
    subCategoryName: this.subCategoryName,
    subCategoryIcon: this.subCategoryIcon,
    account: this.account,
    accountName: this.accountName,
    accountIcon: this.accountIcon,
    date: this.date,
    dateTime: this.dateTime,
    createTime: this.createTime,
    includeInMonthly: this.includeInMonthly,
    budgetScope: this.budgetScope,
    tag: this.tag,
    template: this.template
  }
}

// 添加静态方法
Record.fromObject = function(obj) {
  return new Record(obj)
}

Record.create = function(data) {
  return new Record(data)
}

Record.fromArray = function(array) {
  return array.map(function(item) {
    return new Record(item)
  })
}

// 确保类被正确导出
module.exports = Record
// module.exports.Record = Record