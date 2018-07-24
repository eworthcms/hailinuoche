const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        ordernum: 0,
        carcodenum: 0,
    },
    onLoad: function () {
        wx.navloading();
        const that = this;
        let newcommon = new common();
        let param = newcommon.data;
        param.sign = md5.hexMD5(param.authorization + param.request_time + 'userpage' + 'jo8LJjY4T9');
        param.url = newcommon.apiurl + 'index/index/userpage';
        newcommon.ajax(param, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                that.setData({ ordernum: result.data.data.ordernum });
                that.setData({ carcodenum: result.data.data.carcodenum }); 
            } else {
                wx.showModal({
                    title: '加载数据失败',
                    content: result.data.msg + '',
                    showCancel: false,
                    confirmText: '我知道了'
                });
            }
            wx.navloading('close');
        }, function () {
            wx.showModal({
                title: '加载数据失败',
                content: '服务器异常',
                showCancel: false,
                confirmText: '我知道了'
            });
        }, function () {
            wx.navloading('close');
        });
    },
    /* 跳转订单列表 */
    linkOrderlist: function(){
        wx.navigateTo({
            url: '../orderList/orderList'
        });
    },
    /* 跳转挪车码列表 */
    linkCodelist: function () {
        wx.navigateTo({
            url: '../codeList/codeList'
        });
    },
    /* 跳转常见问题 */
    linkProblemList: function () {
        wx.navigateTo({
            url: '../problemList/problemList'
        });
    },
    contactKefu: function () {
        wx.makePhoneCall({
            phoneNumber: '18514820511'
        });
        // wx.showActionSheet({
        //     itemList: ['18514820511', '呼叫'],
        //     success: function (res) {
        //         // 18514820511 
        //         if (res.tapIndex == 0) {
        //             wx.makePhoneCall({
        //                 phoneNumber: '18514820511'
        //             });
        //         }
        //         // 呼叫 
        //         if (res.tapIndex == 1) {
        //             wx.makePhoneCall({
        //                 phoneNumber: '18514820511'
        //             });
        //         }
        //     }
        // });
    },
})
