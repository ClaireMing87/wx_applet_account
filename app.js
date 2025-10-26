const Record = require('./utils/Record.js')
const CategoryManager = require('./utils/CategoryManager.js')

App({
  globalData: {
    userInfo: null,
    records: [],
    budget: { yearBudget: 0, monthBudget: 0 },
    // 用户自定义二级分类：{ [topId: number]: Array<{id,name,icon}> }
    customSubMenus: {}
  },
  utils: {
    Record: Record,
    CategoryManager: CategoryManager
  },
  onLaunch() {
    // 初始化分类管理器
    this.categoryManager = new CategoryManager()
    
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

  // 获取分类数据的方法
  getCategories(type) {
    return this.categoryManager.getCategories(type)
  },

  // 获取二级分类数据的方法
  getSubCategories(categoryId) {
    return this.categoryManager.getSubCategories(categoryId, this.globalData.customSubMenus)
  },

  // 添加自定义二级分类
  addCustomSubCategory(categoryId, name, icon) {
    const updatedCustom = this.categoryManager.addCustomSubCategory(categoryId, name, icon, this.globalData.customSubMenus)
    this.globalData.customSubMenus = updatedCustom
    wx.setStorageSync('customSubMenus', updatedCustom)
    return updatedCustom
  },

  // 获取分类信息
  getCategoryInfo(categoryId, type) {
    return this.categoryManager.getCategoryInfo(categoryId, type)
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
