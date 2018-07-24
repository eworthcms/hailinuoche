
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
        authorization: '',
        plusOrderNumber: 0,
    },
    common: function () {
    },
    onLaunch: function () {
    },
})
