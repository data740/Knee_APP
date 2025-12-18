// pages/list1/list1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploaderList:[],
    uploaderNum: 0,
    showUpload: true,
    date1:'请选择手术时间',
    date2:'请选择问诊时间'
  },

  // 删除图片
clearImg: function (e) {
  let index = e.currentTarget.dataset.index;
  let uploaderList = this.data.uploaderList;
  uploaderList.splice(index, 1);
  this.setData({
  uploaderList: uploaderList,
  uploaderNum: uploaderList.length,
  showUpload: true
  });
  },
  // 展示图片
  showImg: function (e) {
  let index = e.currentTarget.dataset.index;
  wx.previewImage({
  urls: this.data.uploaderList,
  current: this.data.uploaderList[index]
  });
  },
  // 上传图片
  upload: function(){
    let that = this;
    wx.chooseImage({
      count: 5 - that.data.uploaderNum,
      sizeType: ['original', 'compressed'],
      sourceType:['album', 'camera'],
      success: function(res){
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        console.log(uploaderList);
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
          showUpload: uploaderList.length < 5
        });
      }
    });
  },

  bindDateChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
  },

  bindDateChange2: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date2: e.detail.value
    })
  },

  // 修改上传和分析函数
  uploadAndAnalyze: function() {
    let that = this;
    const uploadList = that.data.uploaderList;
    
    // 检查日期是否已选择
    if (that.data.date1 === '请选择手术时间' || that.data.date2 === '请选择问诊时间') {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      });
      return;
    }
    
    // 检查图片数量
    if (uploadList.length === 0) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      });
      return;
    } else if (uploadList.length < 5) {
      wx.showToast({
        title: '请上传5张图片',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '正在分析...',
    });

    // 使用wx.uploadFile上传多个文件
    let uploadTasks = uploadList.map((filePath, index) => {
      console.log(`准备上传第${index + 1}张图片: ${filePath}`);
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'http://127.0.0.1:5000/upload',
          filePath: filePath,
          name: 'files[]',
          formData: {
            'surgeryDate': that.data.date1,
            'consultationDate': that.data.date2,
            'index': index.toString() // 确保index是字符串
          },
          success: (res) => {
            console.log(`第${index + 1}张图片上传成功:`, res);
            resolve(res);
          },
          fail: (err) => {
            console.error(`第${index + 1}张图片上传失败:`, err);
            reject(err);
          }
        });
      });
    });

    // 等待所有图片上传完成
    Promise.all(uploadTasks)
      .then(results => {
        console.log('所有图片上传完成，结果:', results);
        // 获取最后一个响应作为分析结果
        const lastResult = results[results.length - 1];
        console.log('最后一个响应:', lastResult);
        const result = JSON.parse(lastResult.data);
        console.log('解析后的结果:', result);
        
        wx.hideLoading();
        
        if (result.code === 200) {
          console.log('分析成功，结果:', result.data);
          // 存储分析结果到全局数据
          getApp().globalData.analysisResult = result.data;
          
          wx.showToast({
            title: '分析完成',
            icon: 'success',
            duration: 2000,
            success: function() {
              setTimeout(() => {
                console.log('准备跳转到结果页面');
                // 跳转到结果页面
                wx.redirectTo({
                  url: '/pages/list2/list2'
                });
              }, 2000);
            }
          });
        } else {
          console.error('分析失败:', result.message);
          wx.showToast({
            title: result.message || '分析失败',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        console.error('上传失败：', err);
      });
  },

  // 绑定到开始分析按钮的函数
  gotopage1:function(e){
    wx.navigateBack({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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


// pages/list1/list1.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     uploaderList:[],
//     uploaderNum: 0,
//     showUpload: true,
//     date1:'请选择手术时间',
//     date2:'请选择问诊时间'
//   },

//   // 删除图片
//   clearImg: function (e) {
//     let index = e.currentTarget.dataset.index;
//     let uploaderList = this.data.uploaderList;
//     uploaderList.splice(index, 1);
//     this.setData({
//       uploaderList: uploaderList,
//       uploaderNum: uploaderList.length,
//       showUpload: uploaderList.length < 5
//     });
//   },
  
//   // 展示图片
//   showImg: function (e) {
//     let index = e.currentTarget.dataset.index;
//     wx.previewImage({
//       urls: this.data.uploaderList,
//       current: this.data.uploaderList[index]
//     });
//   },
  
//   // 上传图片
//   upload: function(){
//     let that = this;
//     wx.chooseImage({
//       count: 5 - that.data.uploaderNum,
//       sizeType: ['compressed'], // 只选择压缩过的图片
//       sourceType:['album', 'camera'],
//       success: function(res){
//         let tempFilePaths = res.tempFilePaths;
//         let uploaderList = that.data.uploaderList.concat(tempFilePaths);
//         console.log(uploaderList);
//         that.setData({
//           uploaderList: uploaderList,
//           uploaderNum: uploaderList.length,
//           showUpload: uploaderList.length < 5
//         });
//       }
//     });
//   },

//   bindDateChange1: function(e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       date1: e.detail.value
//     })
//   },

//   bindDateChange2: function(e) {
//     console.log('picker发送选择改变，携带值为', e.detail.value)
//     this.setData({
//       date2: e.detail.value
//     })
//   },

//   // 修改上传和分析函数
//   uploadAndAnalyze: function() {
//     let that = this;
//     const uploadList = that.data.uploaderList;
    
//     // 检查日期是否已选择
//     if (that.data.date1 === '请选择手术时间' || that.data.date2 === '请选择问诊时间') {
//       wx.showToast({
//         title: '请选择日期',
//         icon: 'none'
//       });
//       return;
//     }
    
//     // 检查图片数量
//     if (uploadList.length === 0) {
//       wx.showToast({
//         title: '请先上传图片',
//         icon: 'none'
//       });
//       return;
//     } else if (uploadList.length < 5) {
//       wx.showToast({
//         title: '请上传5张图片',
//         icon: 'none'
//       });
//       return;
//     }

//     wx.showLoading({
//       title: '正在分析...',
//     });

//     // 使用顺序上传并压缩图片
//     let uploadSequentially = function() {
//       let index = 0;
      
//       let uploadNext = function() {
//         if (index >= uploadList.length) {
//           // 所有图片已上传完成
//           return;
//         }
        
//         console.log(`准备压缩并上传第${index + 1}张图片: ${uploadList[index]}`);
        
//         // 先压缩图片
//         wx.compressImage({
//           src: uploadList[index],
//           quality: 70, // 设置压缩质量为70
//           success: function(compressRes) {
//             console.log(`第${index + 1}张图片压缩成功，临时路径: ${compressRes.tempFilePath}`);
            
//             // 使用压缩后的图片进行上传
//             wx.uploadFile({
//               url: 'https://ashely-poaceous-tamekia.ngrok-free.dev/upload',
//               filePath: compressRes.tempFilePath,
//               name: 'file',
//               formData: {
//                 'surgeryDate': that.data.date1,
//                 'consultationDate': that.data.date2,
//                 'index': index.toString(),
//                 'total': uploadList.length.toString()
//               },
//               success: function(res) {
//                 console.log(`第${index + 1}张图片上传成功:`, res);
                
//                 // 如果是最后一张图片，处理结果
//                 if (index === uploadList.length - 1) {
//                   try {
//                     const result = JSON.parse(res.data);
//                     console.log('解析后的结果:', result);
                    
//                     wx.hideLoading();
                    
//                     if (result.code === 200) {
//                       console.log('分析成功，结果:', result.data);
//                       getApp().globalData.analysisResult = result.data;
                      
//                       wx.showToast({
//                         title: '分析完成',
//                         icon: 'success',
//                         duration: 2000,
//                         success: function() {
//                           setTimeout(() => {
//                             wx.redirectTo({
//                               url: '/pages/list2/list2'
//                             });
//                           }, 2000);
//                         }
//                       });
//                     } else {
//                       console.error('分析失败:', result.message);
//                       wx.showToast({
//                         title: result.message || '分析失败',
//                         icon: 'none'
//                       });
//                     }
//                   } catch (e) {
//                     console.error('解析响应数据失败:', e, res);
//                     wx.hideLoading();
//                     wx.showToast({
//                       title: '解析结果失败',
//                       icon: 'none'
//                     });
//                   }
//                 } else {
//                   // 继续上传下一张
//                   index++;
//                   uploadNext();
//                 }
//               },
//               fail: function(err) {
//                 console.error(`第${index + 1}张图片上传失败:`, err);
//                 wx.hideLoading();
//                 wx.showToast({
//                   title: '上传失败',
//                   icon: 'none'
//                 });
//               }
//             });
//           },
//           fail: function(compressErr) {
//             console.error(`第${index + 1}张图片压缩失败:`, compressErr);
            
//             // 压缩失败，尝试直接上传原图
//             wx.uploadFile({
//               url: 'https://ashely-poaceous-tamekia.ngrok-free.dev/upload',
//               filePath: uploadList[index],
//               name: 'file',
//               formData: {
//                 'surgeryDate': that.data.date1,
//                 'consultationDate': that.data.date2,
//                 'index': index.toString(),
//                 'total': uploadList.length.toString()
//               },
//               success: function(res) {
//                 console.log(`第${index + 1}张图片上传成功:`, res);
                
//                 if (index === uploadList.length - 1) {
//                   try {
//                     const result = JSON.parse(res.data);
//                     console.log('解析后的结果:', result);
                    
//                     wx.hideLoading();
                    
//                     if (result.code === 200) {
//                       console.log('分析成功，结果:', result.data);
//                       getApp().globalData.analysisResult = result.data;
                      
//                       wx.showToast({
//                         title: '分析完成',
//                         icon: 'success',
//                         duration: 2000,
//                         success: function() {
//                           setTimeout(() => {
//                             wx.redirectTo({
//                               url: '/pages/list2/list2'
//                             });
//                           }, 2000);
//                         }
//                       });
//                     } else {
//                       console.error('分析失败:', result.message);
//                       wx.showToast({
//                         title: result.message || '分析失败',
//                         icon: 'none'
//                       });
//                     }
//                   } catch (e) {
//                     console.error('解析响应数据失败:', e, res);
//                     wx.hideLoading();
//                     wx.showToast({
//                       title: '解析结果失败',
//                       icon: 'none'
//                     });
//                   }
//                 } else {
//                   index++;
//                   uploadNext();
//                 }
//               },
//               fail: function(err) {
//                 console.error(`第${index + 1}张图片上传失败:`, err);
//                 wx.hideLoading();
//                 wx.showToast({
//                   title: '上传失败',
//                   icon: 'none'
//                 });
//               }
//             });
//           }
//         });
//       };
      
//       // 开始上传第一张图片
//       uploadNext();
//     };
    
//     // 开始顺序上传
//     uploadSequentially();
//   },

//   // 绑定到开始分析按钮的函数
//   gotopage1:function(e){
//     wx.navigateBack({
//       url: '/pages/index/index',
//     })
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad(options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady() {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow() {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide() {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload() {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh() {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom() {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage() {

//   }
// })