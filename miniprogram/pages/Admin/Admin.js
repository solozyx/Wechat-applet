// pages/Admin/Admin.js
var that
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIndex: 0,
    page: 0,
    pageSize: 5,
    totalCount: 0,
    waitAdds: {},
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    that = this
    that.getData(that.data.page);
  },
  // 管理员批量删除
  batchDelete: function (e) {
    var date = String(e.detail.value);
    //console.log(typeof(date))
    wx.cloud.callFunction({
      name: 'batchDelete',
      data: {
        newDate: e.detail.value
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  panel: function (e) {
    if (e.currentTarget.dataset.index != this.data.showIndex) {
      this.setData({
        showIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex: 0
      })
    }
  },
 
  getData: function (page) {
    // 获取总数
    db.collection('waitAdd').count({
      success: function (res) {
        that.data.totalCount = res.total;
      }
    })
    // 获取前十条
    try {
      db.collection('waitAdd')
        .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            //console.log(res.data);
            that.data.waitAdds = res.data;
            that.setData({
              waitAdds: that.data.waitAdds,
            })
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();

          },
          fail: function (event) {
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          }
        })
    } catch (e) {
      wx.hideNavigationBarLoading();//隐藏加载
      wx.stopPullDownRefresh();
      console.error(e);
    }
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
   
      wx.showNavigationBarLoading() //在标题栏中显示加载
      //console.log('pulldown');
      that.getData(that.data.page);
  
  },
  onReachBottom: function () {
    var temp = [];
    // 获取后面十条
    if (that.data.waitAdds.length < that.data.totalCount) {
      try {
        const db = wx.cloud.database();
        db.collection('waitAdd')
          .skip(5)
          .limit(that.data.pageSize) // 限制返回数量为 10 条
          .orderBy('date', 'desc')
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i];
                  //console.log(tempTopic);
                  temp.push(tempTopic);
                }

                var totalWait = {};
                totalWait = that.data.waitAdds.concat(temp);

                //console.log(totalTopic);
                that.setData({
                  waitAdds: totalWait,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据了',
                })
              }


            },
          })
      } catch (e) {
        console.error(e);
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }
  },
  access:function(){
    // db.collection('topic').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     content: that.data.content,
    //     //date: new Date(),
    //     date: that.data.date,
    //     images: that.data.images,
    //     user: that.data.user,
    //     isLike: that.data.isLike,
    //   },
    //   success: function (res) { },
    // })
    console.log(this.data.waitAdds._id)
  },
  notAccess:function(e){

  }

})