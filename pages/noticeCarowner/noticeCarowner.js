const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        options: '',
        authorization: '',
        status: '',
        key: '',
        licenseplate: '',
        mobile: '',
        btnDisabled: false,
        mianDarao: false,
        hasjihuo: false,//挪车码还未激活
    },
    onLoad: function (options) {
        wx.loading();
        wx.navloading();
        const that = this;
        that.setData({ options: options });
        let myPromise = new Promise(function (resolve, reject) {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        let newcommon = new common();
                        let param = {};
                        param.js_code = res.code;
                        wx.request({
                            url: newcommon.apiurl + 'index/Api/authorization',
                            data: param,
                            method: 'POST',
                            success: function (res) {
                                console.log(res)
                                if (res.statusCode == 200 && res.data.code == 2000) {
                                    that.setData({ authorization: res.data.data.authorization });
                                    wx.setStorageSync('authorization', res.data.data.authorization);
                                    resolve(options);
                                } else if (result.statusCode == 200 && result.data.code == 3003) {
                                    that.onLoad(options);
                                    wx.loading('close');
                                    wx.navloading('close');
                                }
                            },
                            fail: function () {
                                that.onLoad(options);
                                wx.loading('close');
                                wx.navloading('close');
                            },
                            complete: function () {
                            }
                        });
                    }
                }
            });
        });

        myPromise.then(function (options) {
            let newcommon = new common();
            let param = newcommon.data;
            let scene = decodeURIComponent(options.scene);
            let sceneArray = scene.split('==');
            let status = sceneArray[0];
            let key = sceneArray[1];
            //let key = 'key15325253649665';//已经激活的key，可以直接匿名打电话调起拨号界面
            //let key = 'key15305214887384';//正式未激活的挪车码，但是还未绑定

            that.setData({ key: key });
            param.key = key;
            param.sign = md5.hexMD5(that.data.authorization + param.request_time + 'reminduserinfo' + 'jo8LJjY4T9');
            param.url = newcommon.apiurl + 'index/index/reminduserinfo';
            newcommon.ajax(param, function (res) {
                console.log(res);
                if (res.statusCode == 200 && res.data.code == 2000) {
                    that.setData({ licenseplate: res.data.data.licenseplate });
                    that.setData({ mobile: res.data.data.mobile });
                    return false;
                }else{
                    that.setData({ btnDisabled: true }); 
                }

                if (res.statusCode == 200 && res.data.code == 3023) {
                    that.setData({ mianDarao: true }); 
                    that.setData({ btnDisabled: false }); 
                    wx.showModal({
                        title: '免打扰模式',
                        content: '该车主已开启免打扰模式',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 5000) {
                    wx.showModal({
                        title: '匿名拨打电话失败',
                        content: '服务器异常',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 4000) {
                    wx.showModal({
                        title: '匿名拨打电话失败',
                        content: '操作失败',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 3003) {
                    wx.showModal({
                        title: '匿名拨打电话失败',
                        content: '登录过期,请重新登录',
                        showCancel: false,
                        confirmText: '我知道了',
                        success: function (res) {
                            if (res.confirm) {
                                wx.switchTab({
                                    url: '../index/index'
                                });
                            }
                        }
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 3004) {
                    wx.showModal({
                        title: '匿名拨打电话失败',
                        content: '请求超时',
                        showCancel: false,
                        confirmText: '我知道了',
                        success: function (res) {
                            if (res.confirm) {
                                wx.switchTab({
                                    url: '../index/index'
                                });
                            }
                        }
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 3005) {
                    wx.showModal({
                        title: '匿名拨打电话失败',
                        content: '非法请求',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 3009) {
                    wx.showModal({
                        title: '匿名拨打电话失败',
                        content: '手机号不能为空',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 3010) {
                    wx.showModal({
                        title: '匿名拨打电话失败',
                        content: '挪车码不存在或key不正确',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 3011) {
                    wx.showModal({
                        title: '匿名拨打电话失败',
                        content: '您扫描的是自己本身的挪车码',
                        showCancel: false,
                        confirmText: '我知道了',
                        success: function (res) {
                            if (res.confirm) {
                                wx.switchTab({
                                    url: '../me/me'
                                });
                            }
                        }
                    });
                    return false;
                }
                //挪车码未激活，去激活页面
                if (res.statusCode == 200 && res.data.code == 3012) {
                    that.setData({ hasjihuo: true });
                    that.setData({ key: res.data.data.key });
                }
                if (res.statusCode == 200 && res.data.code == 3013) {
                    wx.showModal({
                        title: '匿名通知失败',
                        content: '虚拟号码获取失败，请重新尝试',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                    return false;
                }
                if (res.statusCode == 200 && res.data.code == 3018) {
                    wx.showModal({
                        title: '匿名通知失败',
                        content: '挪车码已过期',
                        showCancel: false,
                        confirmText: '我知道了',
                        success: function (re) {
                            if (re.confirm) {
                                wx.switchTab({
                                    url: '../index/index'
                                });
                            }
                        }
                    });
                    return false;
                }
            }, function () {
                wx.showModal({
                    title: '加载失败',
                    content: '服务器异常，请重新打开此页面',
                    showCancel: false,
                    confirmText: '我知道了'
                });
                wx.loading('close');
                wx.navloading('close');
            }, function () {
                wx.loading('close');
                wx.navloading('close');
            });
        });

    },
    /* 拨打匿名电话 */
    nimingPhoneCall: function () {
        const that = this;
        if (!that.data.btnDisabled && !that.data.mianDarao) {
            wx.loading();
            let phoneNumber = that.data.mobile;
            //console.log(phoneNumber);
            wx.makePhoneCall({
                phoneNumber: phoneNumber,
                complete: function () {
                    wx.loading('close');
                }
            });
            wx.loading('close');
        }
        if (!that.data.btnDisabled && that.data.mianDarao){
            wx.loading();
            let options = that.data.options;
            let newcommon = new common();
            let param = newcommon.data;
            let scene = decodeURIComponent(options.scene);
            let sceneArray = scene.split('==');
            let status = sceneArray[0];
            let key = sceneArray[1];
            //let key = 'key15325253649665';//已经激活的key，可以直接匿名打电话调起拨号界面
            //let key = 'key15305214887384';//正式未激活的挪车码，但是还未绑定
            param.key = key;
            param.sign = md5.hexMD5(that.data.authorization + param.request_time + 'reminduserinfo' + 'jo8LJjY4T9');
            param.url = newcommon.apiurl + 'index/index/reminduserinfo';
            newcommon.ajax(param, function (res) {
                console.log(res);
                if (res.statusCode == 200 && res.data.code == 3023) {
                    wx.showModal({
                        title: '免打扰模式',
                        content: '该车主已开启免打扰模式',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                    return false;
                }
            }, function () {
            }, function () {
                wx.loading('close');
            });
        }
    },
    /* 免打扰的情况下点击按钮 */
    noPass: function () {
        const that = this;
        if (that.data.mianDarao) {

        }
    },
    /* 激活体验码按钮 */
    jihuoCode: function (e) {
        wx.loading({ title: '获取手机号中...' });
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
                let key = that.data.key;
                wx.navigateTo({
                    url: '../bindCarnumber/bindCarnumber?key=' + key + '&phoneNumber=' + phoneNumber + '&jihuo=jihuo'
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
        }, function () {
            wx.loading('close');
        });
    },
    /* 拨打客服电话 */
    makeKefuCall: function (e) {
        let phoneNumber = e.currentTarget.dataset.phonenumber;
        wx.makePhoneCall({
            phoneNumber: phoneNumber
        });
    },
})
