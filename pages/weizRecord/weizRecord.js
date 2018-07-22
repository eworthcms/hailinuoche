const app = getApp();
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        tabs: ['违章信息', '处理中','未处理'],
        tabindex: 0
    },
    onLoad: function () {

    },
    highLight: function (e){
        let that = this;
        let index = e.currentTarget.dataset.index;
        that.setData({ tabindex: index });
    },
    getList: function(e){
    }
})
