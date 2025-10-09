const app = getApp()

Page({
  data: {
    records: [],
    touchStartX: 0,
    openId: null
  },

  onShow() {
    this.loadRecords()
  },

  loadRecords() {
    const records = (app.globalData.records || []).map(record => {
      const category = this.getCategoryInfo(record.categoryId, record.type)
      return {
        ...record,
        categoryIcon: category.icon,
        categoryName: this.getDisplayCategoryName(record),
        accountDisplay: this.getAccountDisplay(record.account),
        createTime: this.formatTime(record.createTime),
        offsetX: 0
      }
    })
    this.setData({ records })
  },

  getCategoryInfo(categoryId, type) {
    const categories = app.globalData.categories[type]
    return categories.find(cat => cat.id === categoryId) || { icon: '📝', name: '其他' }
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

    this.setData({ records });
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

    this.setData({ 
      records,
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

  getDisplayCategoryName(record) {
    if (record.subCategoryName) return `${record.categoryName}-${record.subCategoryName}`
    return record.categoryName
  },

  getAccountDisplay(account) {
    switch (account) {
      case 'cash': return '现金'
      case 'bank': return '银行卡'
      case 'alipay': return '支付宝'
      case 'wechat': return '微信'
      case 'fanka': return '饭卡'
      case 'credit': return '福利卡'
      case 'other': return '其他'
      default: return account || '账户'
    }
  },

  formatTime(timeString) {
    const date = new Date(timeString)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}`
  }
})


