const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        list: []
    },
    onLoad: function () {
        wx.navloading();
        const that = this;
        let newcommon = new common();
        let param = newcommon.data;
        param.sign = md5.hexMD5(param.authorization + param.request_time + 'orderlist' + 'jo8LJjY4T9');
        param.url = newcommon.apiurl+'index/index/orderlist';
        newcommon.ajax(param, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                that.setData({ list: result.data.data.list });
            } else if (result.statusCode == 200 && result.data.code == 4000) {
                wx.showModal({
                    title: '没有数据',
                    content: '没有查询到列表数据',
                    showCancel: false,
                    confirmText: '我知道了',
                    success: function (result1) {
                        if (result1.confirm) {
                            wx.switchTab({
                                url: '../me/me'
                            })
                        }
                    }
                });
            }else {
                wx.showModal({
                    title: '获取列表失败',
                    content: '服务器异常',
                    showCancel: false,
                    confirmText: '我知道了',
                    success: function (result1) {
                        if (result1.confirm) {
                            wx.switchTab({
                                url: '../me/me'
                            })
                        }
                    }
                });
            }
        }, function () {
            wx.showModal({
                title: '获取列表失败',
                content: '服务器异常',
                showCancel: false,
                confirmText: '我知道了',
                success: function (result1) {
                    if (result1.confirm) {
                        wx.switchTab({
                            url: '../me/me'
                        })
                    }
                }
            });
        }, function () {
            wx.navloading('close');
        });
    },
    delete: function (e) {
        const that = this;
        let index = e.currentTarget.dataset.index; 
        let orderid = e.currentTarget.dataset.orderid; 
        console.log(index, orderid);
        wx.showModal({
            title: '删除订单',
            content: '您确定要删除此订单吗？',
            success: function (result1) {
                if (result1.confirm) {
                    wx.loading();
                    let newcommon = new common();
                    let param = newcommon.data;
                    param.orderid = orderid;
                    param.sign = md5.hexMD5(param.authorization + param.request_time + 'deleorder' + 'jo8LJjY4T9');
                    param.url = newcommon.apiurl + 'index/index/deleorder';
                    newcommon.ajax(param, function (result) {
                        console.log(result);
                        if (result.statusCode == 200 && result.data.code == 2000) {
                            let list = that.data.list;
                            list.splice(index, 1);
                            that.setData({ list: list });
                            wx.showModal({
                                title: '删除成功',
                                content: '删除成功',
                                showCancel: false,
                                confirmText: '我知道了',
                                success: function (result1) {
                                    if (result1.confirm) {
                                        let pages = getCurrentPages();
                                        let prevPage = pages[pages.length - 2];
                                        prevPage.setData({ ordernum: prevPage.data.ordernum-1 });
                                    }
                                }
                            });
                        } else {
                            wx.showModal({
                                title: '删除失败',
                                content: '服务器异常',
                                showCancel: false,
                                confirmText: '我知道了'
                            });
                        }
                    }, function () {
                        wx.showModal({
                            title: '删除失败',
                            content: '服务器异常',
                            showCancel: false,
                            confirmText: '我知道了'
                        });
                    }, function () {
                        wx.loading('close');
                    });
                }
            }
        });
    }
})
