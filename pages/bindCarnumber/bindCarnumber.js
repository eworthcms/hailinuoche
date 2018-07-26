//获取应用实例
const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        show: false,
        phoneNumber: '',
        province: '京',
        carNumber: '',
        key: '',
        isjihuo: false,
        provincename: ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼', '川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新', '藏', '使', '领', '警', '学', '港', '澳'],
    },
    onLoad: function (options) {
        this.setData({ phoneNumber: options.phoneNumber });
        if (options.licenseplate){
            let province = options.licenseplate.slice(0, 1);
            let carNumber = options.licenseplate.slice(1, 20);
            this.setData({ province: province });
            this.setData({ carNumber: carNumber });
        }
        //还未激活的码
        if (options.jihuo =='jihuo'){
            console.log(options.key);
            console.log(options.phoneNumber);
            this.setData({ key: options.key });
            this.setData({ phoneNumber: options.phoneNumber });
            this.setData({ isjihuo: true});
        }
    },
    /* 点击更换手机号 */
    setPhoneNumber: function (e) {
        let phoneNumber = e.detail.value;
        this.setData({ phoneNumber: phoneNumber });
    },
    /* 拨打电话 */
    makePhoneCall: function (e) {
        let phoneNumber = e.currentTarget.dataset.phonenumber;
        wx.makePhoneCall({
            phoneNumber: phoneNumber
        });
    },
    showProvince: function () {
        this.setData({ show: !this.data.show });
    },
    hideProvince: function () {
        this.setData({ show: false });
    },
    selectProvince: function(e){
        let province = e.currentTarget.dataset.province;
        this.setData({ province: province });
    },
    setCarNumber: function (e) {
        let carNumber = e.detail.value.toUpperCase();
        this.setData({ carNumber: carNumber });
    },
    save: function () {
        const that = this;
        let carNumber = that.data.carNumber;
        let province = that.data.province;
        let fullCarNumber = province + carNumber;
        let express = /^[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        if (!express.test(carNumber)){
            wx.showModal({
                title: '',
                showCancel: false,
                content: '请输入正确的车牌号',
                confirmText: '我知道了'
            });
            return false;
        }

        let phoneNumber = that.data.phoneNumber;
        if (!/^1\d{10}$/.test(phoneNumber)) {
            wx.showModal({
                title: '',
                showCancel: false,
                content: '请输入正确的手机号',
                confirmText: '我知道了'
            });
            return false;
        }

        wx.showModal({
            title: '是否将车牌号和手机号绑定？',
            content: '车牌号：' + carNumber + '\r\n手机号：' + that.data.phoneNumber,
            success: function (res) {
                if (res.confirm) {
                    wx.loading({ title: '生成中，请稍等...' });
                    let newcommon = new common();
                    let param = newcommon.data;
                    param.licenseplate = fullCarNumber;
                    param.mobile = that.data.phoneNumber;
                    param.sign = md5.hexMD5(param.authorization + param.request_time + 'createtmpcode' + 'jo8LJjY4T9');
                    param.url = newcommon.apiurl + 'index/index/createtmpcode';
                    newcommon.ajax(param, function (result) {
                        console.log(result);
                        if (result.statusCode == 200 && result.data.code == 2000) {
                            let codeUrl = result.data.data.url;
                            let carcodeid = result.data.data.carcodeid;
                            let cansu = 'from=pageBindCarnumber' + '&codeUrl=' + codeUrl + '&carcodeid=' + carcodeid;
                            wx.navigateTo({
                                url: '../experienceCode/experienceCode?' + cansu
                            });
                        } else if (result.statusCode == 200 && result.data.code == 3022) {
                            wx.showModal({
                                title: '生成失败',
                                content: '当前车牌号不符合规范',
                                showCancel: false,
                                confirmText: '我知道了'
                            });
                        }else {
                            wx.showModal({
                                title: result.data.msg,
                                content:  '请重新尝试',
                                showCancel: false,
                                confirmText: '我知道了'
                            });
                        }
                    }, function () {
                        wx.showModal({
                            title: '服务器异常',
                            content: '请重新尝试',
                            showCancel: false,
                            confirmText: '我知道了'
                        });
                    }, function () {
                        wx.loading('close');
                    });
                } 
            }
        });
    },
    //激活挪车码
    saveJihuo: function () {
        const that = this;
        let carNumber = that.data.carNumber;
        let province = that.data.province;
        let fullCarNumber = province + carNumber;
        if (carNumber.length < 1) {
            wx.showModal({
                title: '',
                showCancel: false,
                content: '请输入车牌号',
                confirmText: '我知道了'
            });
            return false;
        }
        wx.showModal({
            title: '确定激活次挪车码？',
            content: '手机号：' + that.data.phoneNumber + '\r\n车牌号：' + carNumber,
            success: function (res) {
                if (res.confirm) {
                    wx.loading({ title: '激活中，请稍等...' });
                    let newcommon = new common();
                    let param = newcommon.data;
                    param.key = that.data.key;
                    param.licenseplate = fullCarNumber;
                    param.mobile = that.data.phoneNumber;
                    param.sign = md5.hexMD5(param.authorization + param.request_time + 'bindcarcode' + 'jo8LJjY4T9');
                    param.url = newcommon.apiurl + 'index/index/bindcarcode';
                    newcommon.ajax(param, function (result) {
                        console.log(result);
                        if (result.statusCode == 200 && result.data.code == 2000) {
                            wx.loading({ title: '激活成功' });
                            setTimeout(function(){
                                wx.switchTab({
                                    url: '../me/me'
                                });
                            },1000);
                        } else if (result.statusCode == 200 && result.data.code == 3022) {
                            wx.showModal({
                                title: '生成失败',
                                content: '当前车牌号不符合规范',
                                showCancel: false,
                                confirmText: '我知道了'
                            });
                        }else {
                            wx.showModal({
                                title: '激活失败',
                                content: result.data.msg + '。请重新尝试',
                                showCancel: false,
                                confirmText: '我知道了'
                            });
                        }
                    }, function () {
                        wx.showModal({
                            title: '激活失败',
                            content: '服务器异常，请重新尝试',
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
