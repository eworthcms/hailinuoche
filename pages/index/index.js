const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        timeout: 0
    },
    onLoad: function (options) {
        wx.loading();
        wx.navloading();
        const that = this;

        console.log(options);
        wx.login({
            success: function (res) {
                //console.log(res);
                if (res.code) {
                    let userid = '';
                    let newcommon = new common();
                    let param = {};
                    param.js_code = res.code;
                    if (options.scene) {
                        let scene = unescape(options.scene);
                        console.log(scene);
                        userid = scene.split(':')[1];
                        console.log(userid);
                        param.userid = userid;
                    } else if (options.wxmp) {
                        param.wxmp = options.wxmp;
                    }
                    wx.request({
                        url: newcommon.apiurl + 'index/Api/authorization',
                        data: param,
                        method: 'POST',
                        success: function (res1) {
                            console.log(res1)
                            if (res1.statusCode == 200 && res1.data.code == 2000) {
                                wx.setStorageSync('authorization', res1.data.data.authorization);
                                //getApp().globalData.authorization = res.data.data.authorization;
                            } else if (res1.statusCode == 200 && res1.data.code == 3003) {
                                that.onLoad(options);
                            }
                        },
                        fail: function () {
                            that.onLoad(options);
                        },
                        complete: function () {
                            wx.loading('close');
                            wx.navloading('close');
                        }
                    });
                }
            }
        });
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
