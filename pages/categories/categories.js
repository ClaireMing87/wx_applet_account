const app = getApp()

Page({
  data: {
    categoriesTop: [], // 一级分类（支出/收入二选一，先显示支出）
    expanded: {},      // 展开状态映射 { [categoryId]: boolean }
    subMenus: {},      // 二级分类映射，复用add页的数据结构
    showAddModal: false,
    activeTopId: null,
    newSubName: '',
    newSubIcon: '',
    iconOptions: ['🍽️','🍚','🍿','🥬','🧂','☕','🥤','🚗','🚌','🚇','🚕','⛽','🅿️','🔧','🛒','👕','📱','💄','📚','🪑','🧴','🎬','🎮','🎵','⚽','✈️','🎉','💊','🏥','🩺','🦷','👓','🎓','📖','📝','🎯','📋','✏️','🏠','🏡','💡','📶','🪑','🎨','📲','🧴','💇','💅','🧖','💪','🏋️','👟','🏆','🚄','🎫','🛡️','🔥','🗑️','🏢','🔨','🎁','❤️','💰','💳','📝']
  },

  onLoad() {
    // 读取全局一级分类（默认支出）
    const categoriesTop = (app.globalData.categories && app.globalData.categories.expense) || []
    // 复用add页中的二级分类映射
    const pages = getCurrentPages()
    // 无法直接取另一个页面的data，这里复制必要的映射（保持与add.js中的定义一致）
    const subMenus = {
      1: [ { id: 'null', name: '餐饮', icon: '🍽️' }, { id: 'meals', name: '三餐', icon:  '🍚'}, { id: 'snacks', name: '零食', icon: '🍿' }, { id: 'ingredients', name: '食材', icon: '🥬' }, { id: 'groceries', name: '柴米油盐', icon: '🧂' }, { id: 'coffee', name: '咖啡', icon: '☕' }, { id: 'drinks', name: '饮料', icon: '🥤' } ],
      2: [ { id: 'null', name: '交通', icon: '🚗' }, { id: 'bus', name: '公交', icon: '🚌' }, { id: 'subway', name: '地铁', icon: '🚇' }, { id: 'taxi', name: '出租车', icon: '🚕' }, { id: 'gas', name: '加油', icon: '⛽' }, { id: 'parking', name: '停车', icon: '🅿️' }, { id: 'maintenance', name: '保养', icon: '🔧' } ],
      3: [ { id: 'null', name: '购物', icon: '🛒' }, { id: 'clothes', name: '服装', icon: '👕' }, { id: 'electronics', name: '数码', icon: '📱' }, { id: 'cosmetics', name: '化妆品', icon: '💄' }, { id: 'books', name: '图书', icon: '📚' }, { id: 'furniture', name: '家具', icon: '🪑' }, { id: 'daily', name: '日用品', icon: '🧴' } ],
      4: [ { id: 'movie', name: '电影', icon: '🎬' }, { id: 'game', name: '游戏', icon: '🎮' }, { id: 'music', name: '音乐', icon: '🎵' }, { id: 'sports', name: '运动', icon: '⚽' }, { id: 'travel', name: '旅游', icon: '✈️' }, { id: 'party', name: '聚会', icon: '🎉' } ],
      5: [ { id: 'medicine', name: '药品', icon: '💊' }, { id: 'hospital', name: '医院', icon: '🏥' }, { id: 'checkup', name: '体检', icon: '🩺' }, { id: 'dental', name: '牙科', icon: '🦷' }, { id: 'optical', name: '眼科', icon: '👓' }, { id: 'health', name: '保健品', icon: '💊' } ],
      6: [ { id: 'tuition', name: '学费', icon: '🎓' }, { id: 'books', name: '教材', icon: '📖' }, { id: 'course', name: '课程', icon: '📝' }, { id: 'training', name: '培训', icon: '🎯' }, { id: 'exam', name: '考试', icon: '📋' }, { id: 'stationery', name: '文具', icon: '✏️' } ],
      7: [ { id: 'rent', name: '房租', icon: '🏠' }, { id: 'mortgage', name: '房贷', icon: '🏡' }, { id: 'utilities', name: '水电费', icon: '💡' }, { id: 'internet', name: '网络', icon: '📶' }, { id: 'furniture', name: '家具', icon: '🪑' }, { id: 'decoration', name: '装修', icon: '🎨' } ],
      8: [ { id: 'phone', name: '话费', icon: '📱' }, { id: 'internet', name: '宽带', icon: '📶' }, { id: 'app', name: '应用', icon: '📲' }, { id: 'service', name: '服务费', icon: '🔧' } ],
      9: [ { id: 'clothes', name: '衣服', icon: '👕' }, { id: 'shoes', name: '鞋子', icon: '👟' }, { id: 'accessories', name: '配饰', icon: '👒' }, { id: 'underwear', name: '内衣', icon: '👙' }, { id: 'bags', name: '包包', icon: '👜' }, { id: 'jewelry', name: '首饰', icon: '💍' } ],
      10: [ { id: 'skincare', name: '护肤', icon: '🧴' }, { id: 'makeup', name: '彩妆', icon: '💄' }, { id: 'hair', name: '美发', icon: '💇' }, { id: 'nails', name: '美甲', icon: '💅' }, { id: 'spa', name: 'SPA', icon: '🧖' }, { id: 'fitness', name: '健身', icon: '💪' } ],
      11: [ { id: 'gym', name: '健身房', icon: '💪' }, { id: 'equipment', name: '器材', icon: '🏋️' }, { id: 'clothes', name: '运动服', icon: '👕' }, { id: 'shoes', name: '运动鞋', icon: '👟' }, { id: 'coach', name: '教练', icon: '👨‍🏫' }, { id: 'competition', name: '比赛', icon: '🏆' } ],
      12: [ { id: 'flight', name: '机票', icon: '✈️' }, { id: 'hotel', name: '酒店', icon: '🏨' }, { id: 'train', name: '火车', icon: '🚄' }, { id: 'food', name: '餐饮', icon: '🍽️' }, { id: 'ticket', name: '门票', icon: '🎫' }, { id: 'shopping', name: '购物', icon: '🛒' } ],
      13: [ { id: 'health', name: '健康险', icon: '🏥' }, { id: 'life', name: '人寿险', icon: '👤' }, { id: 'car', name: '车险', icon: '🚗' }, { id: 'property', name: '财产险', icon: '🏠' }, { id: 'travel', name: '旅游险', icon: '✈️' }, { id: 'accident', name: '意外险', icon: '🛡️' } ],
      14: [ { id: 'electricity', name: '电费', icon: '💡' }, { id: 'water', name: '水费', icon: '💧' }, { id: 'gas', name: '燃气费', icon: '🔥' }, { id: 'heating', name: '暖气费', icon: '🌡️' }, { id: 'trash', name: '垃圾费', icon: '🗑️' }, { id: 'management', name: '物业费', icon: '🏢' } ],
      15: [ { id: 'home', name: '房屋维修', icon: '🏠' }, { id: 'appliance', name: '家电维修', icon: '🔧' }, { id: 'car', name: '汽车维修', icon: '🚗' }, { id: 'phone', name: '手机维修', icon: '📱' }, { id: 'computer', name: '电脑维修', icon: '💻' }, { id: 'other', name: '其他维修', icon: '🔨' } ],
      16: [ { id: 'gift', name: '礼品', icon: '🎁' }, { id: 'donation', name: '捐赠', icon: '❤️' }, { id: 'fine', name: '罚款', icon: '💰' }, { id: 'fee', name: '手续费', icon: '💳' }, { id: 'other', name: '其他', icon: '📝' } ]
    }

    // 合并全局自定义二级分类
    const custom = app.globalData.customSubMenus || {}
    const merged = { ...subMenus }
    Object.keys(custom).forEach(k => {
      const key = Number(k)
      if (merged[key]) {
        merged[key] = [...merged[key], ...custom[key]]
      } else {
        merged[key] = [...custom[key]]
      }
    })

    this.setData({ categoriesTop, subMenus: merged })
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
    const { activeTopId, newSubName, newSubIcon, subMenus } = this.data
    if (!activeTopId || !newSubName || !newSubIcon) return
    const list = subMenus[activeTopId] ? [...subMenus[activeTopId]] : []
    const newItem = { id: `custom_${Date.now()}`, name: newSubName, icon: newSubIcon }
    list.push(newItem)
    // 更新页面数据
    this.setData({
      [`subMenus.${activeTopId}`]: list,
      showAddModal: false,
      newSubName: '',
      newSubIcon: ''
    })

    // 持久化到全局与本地存储
    const globalCustom = app.globalData.customSubMenus || {}
    const globalList = globalCustom[activeTopId] ? [...globalCustom[activeTopId]] : []
    globalList.push(newItem)
    app.globalData.customSubMenus = { ...globalCustom, [activeTopId]: globalList }
    wx.setStorageSync('customSubMenus', app.globalData.customSubMenus)
  }
})


