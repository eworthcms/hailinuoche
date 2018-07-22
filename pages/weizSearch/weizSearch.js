const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
    },
    onLoad: function () {

    },
    /* 跳转添加车辆 */
    linkAddCar: function () {
        wx.navigateTo({
            url: '../addCar/addCar'
        });
    }
})
