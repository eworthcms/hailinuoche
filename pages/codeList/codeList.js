const app = getApp()
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        codeList: []
    },
    onLoad: function () {
        wx.navloading();
        const that = this;
        let newcommon = new common();
        let param = newcommon.data;
        param.type = 1;
        param.sign = md5.hexMD5(param.authorization + param.request_time + 'carcodelist' + 'jo8LJjY4T9');
        param.url = newcommon.apiurl + 'index/index/carcodelist';
        newcommon.ajax(param, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                that.setData({ codeList: result.data.data.list });
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
            } else {
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
        
        // wx.request({
        //     url: 'https://car.wangsongyang.com/index/index/carcodelist',
        //     data: param,
        //     success: function (res) {
        //         console.log(res);
        //         if (res.statusCode == 200 && res.data.code == 2000) {
        //             that.setData({ codeList: res.data.data.list });
        //         }
        //     },
        //     complete: function () {
        //         wx.hideNavigationBarLoading();
        //     }
        // });
    },
    linkExperienceCode: function (e) {
        let carcodeid = e.currentTarget.dataset.carcodeid;
        let param = 'from=pageCodelist' + '&carcodeid=' + carcodeid;
        wx.navigateTo({
            url: '../experienceCode/experienceCode?' + param
        });
    }
})
