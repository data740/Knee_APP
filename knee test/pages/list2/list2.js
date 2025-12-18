// pages/list2/list2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    analysisResult: null
  },

  onLoad: function() {
    console.log('list2 页面加载');
    console.log('全局数据:', getApp().globalData);
    
    const analysisResult = getApp().globalData.analysisResult;
    console.log('获取到的分析结果：', analysisResult);
    
    if (analysisResult) {
      console.log('设置分析结果到页面');
      this.setData({
        analysisResult: analysisResult.result
      });
    } else {
      console.error('没有获取到分析结果');
      wx.showToast({
        title: '未获取到分析结果',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  },

  gotopage1: function(e) {
    wx.navigateBack({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})