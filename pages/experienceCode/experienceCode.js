const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        //codeUrl: '../images/qrcode.png',
        codeUrl: '',
        codeType: '',
        options: '',
        carcodeid: '',
        licenseplate:'',
        mobile: '',
        status: ''
    },
    onLoad: function (options) {
        console.log(options);
        let that = this;
        that.setData({ options: options });
        //如果是从挪车码列表跳过来的
        if (options.from =='pageCodelist'){
            that.setData({ carcodeid: options.carcodeid });
            wx.loading();
            let newcommon = new common();
            let param = newcommon.data;
            param.carcodeid = options.carcodeid;
            param.sign = md5.hexMD5(param.authorization + param.request_time + 'carcodeinfo' + 'jo8LJjY4T9');
            param.url = newcommon.apiurl + 'index/index/carcodeinfo';
            newcommon.ajax(param, function (result) {
                console.log(result);
                if (result.statusCode == 200 && result.data.code == 2000) {
                    that.setData({ codeUrl: result.data.data.codeurl });
                    that.setData({ licenseplate: result.data.data.licenseplate });
                    that.setData({ mobile: result.data.data.mobile });
                    that.setData({ codeType: result.data.data.type });
                    that.setData({ status: result.data.data.status });
                } else {
                    wx.showModal({
                        title: '获取挪车码信息失败',
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
                    title: '获取挪车码信息失败',
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
                wx.loading('close');
            });
        }

        //如果是输入车牌号生成临时码来的
        if (options.from == 'pageBindCarnumber') {
            that.setData({ codeUrl: options.codeUrl });
            that.setData({ carcodeid: options.carcodeid });
            that.setData({ codeType: 1 });
        }
        
    },
    /* 是否关闭接收状态 */
    switchChangeStatus: function (e) {  
        const that = this;
        let msg = e.detail.value ? '开启' : '关闭';
        let newcommon = new common();
        let param = newcommon.data;
        param.carcodeid = that.data.options.carcodeid;
        param.status = e.detail.value ? 1 : 2;
        param.sign = md5.hexMD5(param.authorization + param.request_time + 'editcarcode' + 'jo8LJjY4T9');
        param.url = newcommon.apiurl + 'index/index/editcarcode';
        wx.loading();
        newcommon.ajax(param, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                wx.showModal({
                    title: msg+'成功',
                    content: '',
                    showCancel: false,
                    confirmText: '我知道了'
                });
            } else {
                wx.showModal({
                    title: msg +'失败',
                    content: '请再试一次',
                    showCancel: false,
                    confirmText: '我知道了'
                });
            }
        }, function () {
            wx.showModal({
                title: msg +'失败',
                content: '服务器异常',
                showCancel: false,
                confirmText: '我知道了'
            });
        }, function () {
            wx.loading('close');
        });
    },
    /* 拨打客服电话 */
    makePhoneCall: function (e) {
        let phoneNumber = e.currentTarget.dataset.phonenumber;
        wx.makePhoneCall({
            phoneNumber: phoneNumber
        });
    },
    /* 删除体验码 */
    deleteCode: function () {
        const that = this;
        wx.showModal({
            title: '是否删除此体验码？',
            content: '删除后您可以重新生成体验码。',
            success: function (res) {
                if (res.confirm) {
                    wx.loading({ title: '删除中，请稍等...'}); 

                    let newcommon = new common();
                    let param = newcommon.data;
                    param.carcodeid = that.data.carcodeid;
                    param.sign = md5.hexMD5(param.authorization + param.request_time + 'deltmpcode' + 'jo8LJjY4T9');
                    param.url = newcommon.apiurl + 'index/index/deltmpcode';
                    newcommon.ajax(param, function (result) {
                        console.log(result);
                        if (result.statusCode == 200 && result.data.code == 2000) {
                            wx.showModal({
                                title: '',
                                content: '删除成功',
                                showCancel: false,
                                confirmText: '我知道了',
                                success: function (result1) {
                                    if (result1.confirm) {
                                        let pages = getCurrentPages();
                                        let prevPage = pages[pages.length - 2];
                                        if (that.data.options.from == 'pageCodelist') {
                                            prevPage.onLoad();
                                        }
                                        wx.navigateBack();
                                    }
                                }
                            });
                        } else {
                            wx.showModal({
                                title: '删除失败',
                                content: result.data.msg,
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
                            title: '删除失败',
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
                        wx.loading('close');
                    });

                }
            }
        });
    },
    /* 跳转申请邮寄 */
    applyPost: function () {
        wx.navigateTo({
            url: '../reciveWay/reciveWay'
        });
    },
})
