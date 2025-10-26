/**
 * 分类管理工具类
 * 统一管理一级分类和二级分类的创建、获取、添加等操作
 */
function CategoryManager() {
  // 默认一级分类
  this.defaultCategories = {
    expense: [
      { id: 1, name: '餐饮', icon: '🍽️' },
      { id: 2, name: '交通', icon: '🚗' },
      { id: 3, name: '购物', icon: '🛒' },
      { id: 4, name: '娱乐', icon: '🎮' },
      { id: 5, name: '医疗', icon: '💊' },
      { id: 6, name: '教育', icon: '📚' },
      { id: 7, name: '住房', icon: '🏠' },
      { id: 8, name: '通讯', icon: '📱' },
      { id: 9, name: '服装', icon: '👕' },
      { id: 10, name: '美容', icon: '💄' },
      { id: 11, name: '运动', icon: '⚽' },
      { id: 12, name: '旅行', icon: '✈️' },
      { id: 13, name: '保险', icon: '🛡️' },
      { id: 14, name: '水电', icon: '💡' },
      { id: 15, name: '维修', icon: '🔧' },
      { id: 16, name: '其他', icon: '📝' }
    ],
    income: [
      { id: 17, name: '工资', icon: '💰' },
      { id: 18, name: '奖金', icon: '🎁' },
      { id: 19, name: '投资', icon: '📈' },
      { id: 20, name: '兼职', icon: '💼' },
      { id: 21, name: '红包', icon: '🧧' },
      { id: 22, name: '退款', icon: '↩️' },
      { id: 23, name: '理财', icon: '💹' },
      { id: 24, name: '其他', icon: '📝' }
    ]
  }

  // 默认二级分类映射
  this.defaultSubCategories = {
    1: [ // 餐饮
      { id: 'null', name: '餐饮', icon: '🍽️' },
      { id: 'meals', name: '三餐', icon: '🍚' },
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

  // 常用图标选项
  this.iconOptions = [
    '🍽️', '🍚', '🍿', '🥬', '🧂', '☕', '🥤', '🚗', '🚌', '🚇', '🚕', '⛽', '🅿️', '🔧',
    '🛒', '👕', '📱', '💄', '📚', '🪑', '🧴', '🎬', '🎮', '🎵', '⚽', '✈️', '🎉', '💊',
    '🏥', '🩺', '🦷', '👓', '🎓', '📖', '📝', '🎯', '📋', '✏️', '🏠', '🏡', '💡', '📶',
    '🪑', '🎨', '📲', '🧴', '💇', '💅', '🧖', '💪', '🏋️', '👟', '🏆', '🚄', '🎫', '🛡️',
    '🔥', '🗑️', '🏢', '🔨', '🎁', '❤️', '💰', '💳', '📝'
  ]
}

/**
 * 获取一级分类列表
 * @param {string} type - 'expense' | 'income'
 * @returns {Array} 分类列表
 */
CategoryManager.prototype.getCategories = function(type) {
  return this.defaultCategories[type] || []
}

/**
 * 获取指定一级分类的二级分类列表（包含默认和自定义）
 * @param {number} categoryId - 一级分类ID
 * @param {Object} customSubMenus - 自定义二级分类
 * @returns {Array} 二级分类列表
 */
CategoryManager.prototype.getSubCategories = function(categoryId, customSubMenus = {}) {
  const defaultSubs = this.defaultSubCategories[categoryId] || []
  const customSubs = customSubMenus[categoryId] || []
  return [...defaultSubs, ...customSubs]
}

/**
 * 添加自定义二级分类
 * @param {number} categoryId - 一级分类ID
 * @param {string} name - 分类名称
 * @param {string} icon - 分类图标
 * @param {Object} customSubMenus - 当前自定义分类对象
 * @returns {Object} 更新后的自定义分类对象
 */
CategoryManager.prototype.addCustomSubCategory = function(categoryId, name, icon, customSubMenus = {}) {
  const newItem = {
    id: `custom_${Date.now()}`,
    name: name,
    icon: icon
  }
  
  const updatedCustom = { ...customSubMenus }
  if (!updatedCustom[categoryId]) {
    updatedCustom[categoryId] = []
  }
  updatedCustom[categoryId].push(newItem)
  
  return updatedCustom
}

/**
 * 根据分类ID获取分类信息
 * @param {number} categoryId - 分类ID
 * @param {string} type - 分类类型
 * @returns {Object} 分类信息
 */
CategoryManager.prototype.getCategoryInfo = function(categoryId, type) {
  const categories = this.getCategories(type)
  return categories.find(cat => cat.id === categoryId) || { icon: '📝', name: '其他' }
}

/**
 * 根据分类ID和子分类ID获取完整的分类信息
 * @param {number} categoryId - 一级分类ID
 * @param {string} subCategoryId - 二级分类ID
 * @param {string} type - 分类类型
 * @param {Object} customSubMenus - 自定义二级分类
 * @returns {Object} 完整分类信息
 */
CategoryManager.prototype.getFullCategoryInfo = function(categoryId, subCategoryId, type, customSubMenus = {}) {
  const category = this.getCategoryInfo(categoryId, type)
  const subCategories = this.getSubCategories(categoryId, customSubMenus)
  const subCategory = subCategories.find(sub => sub.id === subCategoryId)
  
  return {
    category: category,
    subCategory: subCategory || null,
    displayName: subCategory && subCategory.name !== category.name 
      ? `${category.name}-${subCategory.name}` 
      : category.name
  }
}

/**
 * 获取常用分类（用于首页显示）
 * @returns {Array} 常用分类列表
 */
CategoryManager.prototype.getCommonCategories = function() {
  return [
    { id: 1, name: '餐饮', icon: '🍽️', type: 'expense' },
    { id: 2, name: '交通', icon: '🚗', type: 'expense' },
    { id: 3, name: '购物', icon: '🛒', type: 'expense' },
    { id: 17, name: '工资', icon: '💰', type: 'income' }
  ]
}

/**
 * 获取图标选项列表
 * @returns {Array} 图标选项
 */
CategoryManager.prototype.getIconOptions = function() {
  return this.iconOptions
}

module.exports = CategoryManager
