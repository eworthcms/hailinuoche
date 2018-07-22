let app = getApp();
let common = require('utils/common.js');

wx.navloading = function (type) {
    if (type == 'close') {
        wx.hideNavigationBarLoading();
    } else {
        wx.showNavigationBarLoading();
    }
};

wx.loading = function (param) {
    if (param == 'close') {
        wx.hideLoading();
    } else {
        wx.showLoading({
            mask: true,
            title: param ? param.title : ''
        });
    }
};

App({
    globalData: {
        userid: '',
        isdo: 'isdo',
        plusOrderNumber: 0,
    },
    common:function(){
        return new common();
    },
    onLaunch: function () {
        const that = this;
        //wx.removeStorageSync('isdo');
        // 获取授权码
        wx.login({
            success: function (res) {
                //console.log(res);
                if (res.code) {
                    let newcommon = new common();
                    let param = {};
                    param.js_code = res.code;
                    wx.request({
                        url: newcommon.apiurl+'index/Api/authorization',
                        data: param,
                        method: 'POST',
                        success: function (res) {
                            console.log(res)
                            if (res.statusCode == 200 && res.data.code == 2000) {
                                wx.setStorageSync('authorization', res.data.data.authorization);
                                //wx.setStorageSync('isdo', res.data.do);
                                that.globalData.isdo = res.data.do;
                            }
                        }
                    });
                }
            }
        });
    },
})
