const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        authorization: '',
        timeout: 0
    },
    onShow: function (options){
        wx.loading('close');
    },
    onLoad: function (options) {
        console.log(options);
        const that = this;

        //if (options.scene) {
        if (options.scene) {
            //let isdo = wx.getStorageSync('isdo');
            let scene = unescape(options.scene);
            console.log(scene);
            let userid = scene.split(':')[1];
            console.log(userid);

            that.getIsdo(userid);
        }
    },
    getIsdo: function (userid){
        wx.loading();
        const that = this;
        var setTimeoutFn;
        let isdo = getApp().globalData.isdo;
        //let isdo = 'insert';
        console.log(isdo);

        // wx.showModal({
        //     title: '返回值：' + isdo,
        //     content: '',
        //     showCancel: false,
        //     confirmText: '我知道了',
        // });

        if (isdo == 'isdo') {
            console.log('1');
            // if (that.data.timeout >= 10) {
            //     wx.showModal({
            //         title: '请求超时',
            //         content: '请求超时',
            //         showCancel: false,
            //         confirmText: '我知道了',
            //     });
            //     return false;
            // }
            setTimeoutFn = setTimeout(function () {
                //that.data.data++;
                that.getIsdo(userid);
            }, 1000);
        } else if (isdo == 'insert') {
            clearTimeout(setTimeoutFn);
            console.log('2');
            let newcommon = new common();
            let param = newcommon.data;
            param.userid = userid;
            param.sign = md5.hexMD5(param.authorization + param.request_time + 'bindshare' + 'jo8LJjY4T9');
            param.url = newcommon.apiurl + 'index/index/bindshare';
            newcommon.ajax(param, function (result) {
                console.log(result);
                //wx.removeStorageSync('isdo');
                getApp().globalData.isdo = 'update';
            }, function () {
                wx.loading('close');
            }, function () {
                wx.loading('close');
            });
        } else if (isdo == 'update')  {
            console.log('3');
            clearTimeout(setTimeoutFn);
            wx.loading('close');
        }
    },
    /* 跳转绑定车牌号 */
    linkBindCarnumber: function(){
        wx.navigateTo({
            url: '../bindCarnumber/bindCarnumber'
        });
    },
    /* 拨打客服电话 */
    makePhoneCall: function (e) {
        let phoneNumber = e.currentTarget.dataset.phonenumber;
        wx.makePhoneCall({
            phoneNumber: phoneNumber
        });
    },
    /* 线上体验 */
    getPhoneNumber: function(e){
        wx.loading({title: '获取手机号中...'});
        console.log(e);
        const that = this;
        let newcommon = new common();
        let param = newcommon.data;
        param.encryptedData = e.detail.encryptedData;
        param.iv = e.detail.iv;
        param.url = newcommon.apiurl + 'index/api/encrypt';
        newcommon.ajax(param, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                let phoneNumber = result.data.data.phoneNumber;
                wx.navigateTo({
                    url: '../bindCarnumber/bindCarnumber?phoneNumber=' + phoneNumber
                });
            } else {
                wx.showModal({
                    title: '获取手机号失败',
                    content: '请重新尝试获取',
                    showCancel: false,
                    confirmText: '我知道了',
                });
            }
        }, function () {
            wx.showModal({
                title: '获取手机号失败',
                content: '服务器异常，请重新尝试',
                showCancel: false,
                confirmText: '我知道了',
            });
        },function(){
            wx.loading('close');
        });
    
    },
    /* 跳转配送方式页 */
    linkReciveWay: function () {
        wx.navigateTo({
            url: '../reciveWay/reciveWay'
        })
    }
    
})
