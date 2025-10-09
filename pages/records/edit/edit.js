// pages/edit/edit.js
const app = getApp()

Page({
  data: {
    record: null
  },

  onLoad(options) {
    if (options.id) {
      const record = (app.globalData.records || []).find(r => r.id === parseInt(options.id))
      if (record) {
        this.setData({ record })
        // 直接跳转到记账页面，替换当前页面
        wx.redirectTo({
          url: `/pages/add/add?edit=${encodeURIComponent(JSON.stringify(record))}`,
          success: () => {
            // 等待页面切换完成后，设置编辑数据
            setTimeout(() => {
              const addPage = getCurrentPages().find(p => p.route === 'pages/add/add')
              if (addPage) {
                addPage.setEditData(record)
              }
            }, 100)
          }
        })
      } else {
        wx.showToast({
          title: '记录不存在',
          icon: 'error'
        })
      }
    }
  }
})