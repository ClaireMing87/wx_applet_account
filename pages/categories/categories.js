const app = getApp()

Page({
  data: {
    categoriesTop: [], // 一级分类（支出/收入二选一，先显示支出）
    expanded: {},      // 展开状态映射 { [categoryId]: boolean }
    subMenus: {},      // 二级分类映射
    showAddModal: false,
    activeTopId: null,
    newSubName: '',
    newSubIcon: '',
    iconOptions: []
  },

  onLoad() {
    this.loadCategories()
  },

  loadCategories() {
    // 使用CategoryManager获取分类数据
    const categoriesTop = app.getCategories('expense')
    const iconOptions = app.utils.CategoryManager.prototype.getIconOptions.call(new app.utils.CategoryManager())
    
    // 获取所有二级分类（包含默认和自定义）
    const subMenus = {}
    categoriesTop.forEach(category => {
      subMenus[category.id] = app.getSubCategories(category.id)
    })

    this.setData({ 
      categoriesTop, 
      subMenus,
      iconOptions
    })
  },

  toggleExpand(e) {
    const id = e.currentTarget.dataset.id
    const expanded = { ...this.data.expanded }
    expanded[id] = !expanded[id]
    this.setData({ expanded })
  },

  openAddSub(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      showAddModal: true,
      activeTopId: id,
      newSubName: '',
      newSubIcon: ''
    })
  },

  closeAddModal() {
    this.setData({ showAddModal: false })
  },

  onSubNameInput(e) {
    this.setData({ newSubName: e.detail.value })
  },

  chooseIcon(e) {
    const icon = e.currentTarget.dataset.icon
    this.setData({ newSubIcon: icon })
  },

  confirmAddSub() {
    const { activeTopId, newSubName, newSubIcon } = this.data
    if (!activeTopId || !newSubName || !newSubIcon) return
    
    // 使用app的方法添加自定义分类
    app.addCustomSubCategory(activeTopId, newSubName, newSubIcon)
    
    // 重新加载分类数据
    this.loadCategories()
    
    // 关闭模态框
    this.setData({
      showAddModal: false,
      newSubName: '',
      newSubIcon: ''
    })
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  }
})


