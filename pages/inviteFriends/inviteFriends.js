const app = getApp()
const md5 = require('../../utils/md5.js');
const common = require('../../utils/common.js');

Page({
    data: {
        isshow: true,
        codeurl: '../images/qrcode.png',
        downloadurl: '',
        userid: '',
    },
    onLoad: function () {
        wx.loading();
        wx.navloading();
        const that = this;

        //获取分享码
        let newcommon = new common();
        let param = newcommon.data;
        param.sign = md5.hexMD5(param.authorization + param.request_time + 'sharecode' + 'jo8LJjY4T9');
        param.url = newcommon.apiurl + 'index/index/sharecode';
        newcommon.ajax(param, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                that.setData({ codeurl: result.data.data.codeurl });
                that.setData({ downloadurl: result.data.data.downloadurl });
            } else {
                wx.showModal({
                    title: '获取分享码失败',
                    content: result.data.msg,
                    showCancel: false,
                    confirmText: '我知道了'
                });
            }
            wx.loading('close');
            wx.navloading('close');
        }, function () {
            wx.showModal({
                title: '获取分享码失败',
                content: '服务器异常',
                showCancel: false,
                confirmText: '我知道了'
            });
            }, function () {
            wx.loading('close');
            wx.navloading('close');
        });


        //获取userid
        let newcommon1 = new common();
        let param1 = newcommon1.data;
        param1.sign = md5.hexMD5(param.authorization + param.request_time + 'getuserinfo' + 'jo8LJjY4T9');
        param1.url = newcommon1.apiurl + 'index/index/getuserinfo';
        newcommon1.ajax(param1, function (result) {
            console.log(result);
            if (result.statusCode == 200 && result.data.code == 2000) {
                that.setData({ userid: result.data.data.id });
                console.log(result.data.data.id);
            } else {
                wx.showModal({
                    title: '获取用户id失败',
                    content: result.data.msg,
                    showCancel: false,
                    confirmText: '我知道了'
                });
            }
            wx.loading('close');
            wx.navloading('close');
        }, function () {
            wx.showModal({
                title: '获取用户id失败',
                content: '服务器异常',
                showCancel: false,
                confirmText: '我知道了'
            });
        }, function () {
            wx.loading('close');
            wx.navloading('close');
        });
    },
    showModal: function(){
        this.setData({ isshow: false });
    },
    closeModal: function () {
        this.setData({ isshow: true });
    },
    /* 保存图片 */
    saveImg: function () {
        wx.loading({ title: '保存中...' });
        const that = this;
        wx.getImageInfo({
            src: that.data.downloadurl,
            success: function (res) {
                console.log(res.path);
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: function (res) {
                        wx.showModal({
                            title: '保存成功',
                            content: '您可以在发朋友圈时，在微信相册中选择这张图片分享出去',
                            showCancel: false,
                            confirmText: '我知道了'
                        })
                    },
                    fail: function (msg) {
                        console.log(msg);
                        wx.showModal({
                            title: '保存图片失败',
                            content: '服务器异常',
                            showCancel: false,
                            confirmText: '我知道了'
                        });
                    },
                    complete: function () {
                        wx.loading('close');
                    }
                })
            },
            fail: function () {
                wx.showModal({
                    title: '保存失败',
                    content: '获取图片信息失败',
                    showCancel: false,
                    confirmText: '我知道了'
                });
                wx.loading('close');
            }
        })
    },
    /* 分享给好友 */
    onShareAppMessage: function (res) {
        let userid = this.data.userid;
        console.log(userid);
        return {
            title: '喊你挪车，邀您赚赏金',
            imageUrl: '../images/bg2.png',
            path: 'pages/index/index?scene=shareuserid:' + userid
        }
    },
    /* 跳转我的收益 */
    linkProfit: function () {
        wx.navigateTo({
            url: '../profit/profit'
        });
    },
    /* 跳转活动规则 */
    linkGuize: function () {
        wx.navigateTo({
            url: '../shangjinGuize/shangjinGuize'
        });
    },
})
