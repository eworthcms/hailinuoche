const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');
Page({
    data: {
        balance: '0.00'
    },
    onLoad: function () {
        wx.navloading();
        const that = this;
        let newcommon = new common();
        let param = newcommon.data;
        param.sign = md5.hexMD5(param.authorization + param.request_time + 'getbalance' + 'jo8LJjY4T9');
        param.url = newcommon.apiurl + 'index/index/getbalance';
        newcommon.ajax(param, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                that.setData({ balance: result.data.data.balance });
            } else if (result.statusCode == 200 && result.data.code == 4000) {  //没有数据
            } else {
                wx.showModal({
                    title: '获取数据失败',
                    content: '服务器异常',
                    showCancel: false,
                    confirmText: '我知道了',
                    success: function (result1) {
                        if (result1.confirm) {
                            wx.navigateBack();
                        }
                    }
                });
            }
        }, function () {
            wx.showModal({
                title: '获取数据失败',
                content: '服务器异常',
                showCancel: false,
                confirmText: '我知道了',
                success: function (result1) {
                    if (result1.confirm) {
                        wx.navigateBack();
                    }
                }
            });
        }, function () {
            wx.navloading('close');
        });
    },
})
