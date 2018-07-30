//获取应用实例
const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');
const initPrice = 9.9;
Page({
    data: {
        buyNumber: 1,
        totalPrice: '',
        hasAddress: false,
        userName: '',
        telNumber: '',
        address: '',
        allAddressInfo: ''
    },
    onLoad: function () {
        this.setData({ totalPrice: initPrice });
    },
    /* 减 */
    reduce: function () {
        let buyNumber = this.data.buyNumber;
        buyNumber = buyNumber <= 1 ? 1 : --buyNumber;
        this.setData({ buyNumber: buyNumber });
        this.setData({ totalPrice: (initPrice * buyNumber).toFixed(1)});
    },
    /* 加 */
    add: function () {
        let that = this;
        let buyNumber = this.data.buyNumber;
        this.setData({ buyNumber: ++buyNumber });
        this.setData({ totalPrice: (initPrice * that.data.buyNumber).toFixed(1) });
    },
    /* 调用微信地址 */
    chooseAddress: function () {
        const that = this;
        wx.chooseAddress({
            success: function (allAddressInfo) {
                console.log(allAddressInfo);
                let userName = allAddressInfo.userName;
                let telNumber = allAddressInfo.telNumber;
                let address = allAddressInfo.provinceName + allAddressInfo.cityName + allAddressInfo.countyName + allAddressInfo.detailInfo;
                that.setData({
                    hasAddress: true, 
                    allAddressInfo: allAddressInfo,
                    userName: userName,
                    telNumber: telNumber,
                    address: address,
                });
            }
        })
    },
    /* 生成订单 */
    createorder: function(){
        const that = this;
        if (!that.data.hasAddress) {
            wx.showModal({
                title: '',
                content: '请选择邮寄地址',
                showCancel: false,
                confirmText: '我知道了'
            });
        } else {
            wx.loading({title: '发起支付中...'});
            let newcommon = new common();
            let param = newcommon.data;
            param.num = that.data.buyNumber;
            param.amount = that.data.totalPrice;//真实的价格
            //param.amount = 0.01;//测试1分钱价格
            param.shiptype = 2;
            param.username = that.data.allAddressInfo.userName;
            param.usermobile = that.data.allAddressInfo.telNumber;
            param.useraddressarea = that.data.allAddressInfo.provinceName;
            param.useraddressareainfo = that.data.allAddressInfo.provinceName + that.data.allAddressInfo.cityName + that.data.allAddressInfo.countyName + that.data.allAddressInfo.detailInfo;
            param.useraddresspostalcode = that.data.allAddressInfo.postalCode;
            param.sign = md5.hexMD5(param.authorization + param.request_time + 'createorder' + 'jo8LJjY4T9');
            param.url = newcommon.apiurl + 'index/index/createorder';
            newcommon.ajax(param, function (result) {
                console.log(result);
                if (result.statusCode == 200 && result.data.code == 2000) {
                    that.prePay(result.data.data.id);
                } else {
                    wx.showModal({
                        title: '生成订单失败',
                        content: '服务器异常',
                        showCancel: false,
                        confirmText: '我知道了'
                    });
                }
            }, function () {
                wx.showModal({
                    title: '生成订单失败',
                    content: '服务器异常',
                    showCancel: false,
                    confirmText: '我知道了'
                });
            }, function () {
                wx.loading('close');
            });
        }
    },
    //预支付
    prePay: function (orderid){
        wx.loading({ title: '发起支付中...' });
        const that = this;
        let newcommon = new common();
        let param = newcommon.data;
        param.orderid = orderid;
        param.sign = md5.hexMD5(param.authorization + param.request_time + 'wxpay' + 'jo8LJjY4T9');
        param.url = newcommon.apiurl + 'index/index/wxpay';
        newcommon.ajax(param, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                let timeStamp = result.data.data.timeStamp;
                let nonceStr = result.data.data.nonceStr;
                let pkage = result.data.data.package;
                let signType = result.data.data.signType;
                let paySign = result.data.data.paySign;
                console.log(nonceStr);
                wx.requestPayment({
                    'timeStamp': timeStamp,
                    'nonceStr': nonceStr,
                    'package': pkage,
                    'signType': signType,
                    'paySign': paySign,
                    'success': function (result1) {
                        console.log(result1);
                        let newcommon1 = new common();
                        let param1 = newcommon1.data;
                        param1.orderid = orderid;
                        param1.sign = md5.hexMD5(param1.authorization + param1.request_time + 'wxpayupdate' +'jo8LJjY4T9');
                        param1.url = newcommon1.apiurl + 'index/index/wxpayupdate';
                        newcommon1.ajax(param1, function (result2) {
                            console.log(result2);
                        }, function () {
                        }, function () {
                            wx.switchTab({
                                url: '../me/me',
                                success: function (e) {
                                    let page = getCurrentPages().pop();
                                    if (page == undefined || page == null) return;
                                    page.onLoad();
                                }
                            });
                            wx.loading('close');
                        });  
                    },
                    'fail': function (res) {
                        wx.showModal({
                            title: '微信支付失败',
                            content: '请重新支付',
                            showCancel: false,
                            confirmText: '我知道了',
                            success: function (res) {
                                if (res.confirm) {
                                    app.globalData.plusOrderNumber = 1;
                                }
                            }
                        });
                    }
                });
            } else {
                wx.showModal({
                    title: '微信支付失败',
                    content: '',
                    showCancel: false,
                    confirmText: '我知道了'
                });
            }
        }, function () {
            wx.showModal({
                title: '微信支付失败',
                content: '服务器异常',
                showCancel: false,
                confirmText: '我知道了'
            });
        }, function () {
            wx.navloading('close');
        });
    },
})
