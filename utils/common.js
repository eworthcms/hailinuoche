function common() {
    let time = new Date().getTime() / 1000;
    let request_time = time.toString().replace(/\.\d{0,}/g, '');
    let authorization = wx.getStorageSync('authorization');
    this.apiurl = 'https://car.wangsongyang.com/'; 
    this.data = {
        url: '',
        request_time: request_time,
        authorization: authorization,
    };
    this.ajax = function (param, success, fail, complete, type = 'POST') {
        let that = this;
        wx.request({
            url: param.url,
            data: param,
            method: type,
            success: function (result) {
                //console.log(result);
                if (result.statusCode == 200 && result.data.code == 3003) {
                    that.authorization();
                    return false;
                } 
                success(result);
            },
            fail: function () {
                fail();
            },
            complete: function () {
                complete();  
                wx.loading('close');
                wx.navloading('close');
            }
        });
    };
    //封装授权方法
    this.authorization = function () {
        wx.loading();

        let that = this;
        wx.showModal({
            title: '登录授权过期',
            content: '我们将重新获取授权信息',
            success: function (result1) {
                if (result1.confirm) {
                    wx.login({
                        success: function (result2) {
                            console.log(result2);
                            if (result2.code) {
                                wx.request({
                                    url: 'https://car.ync8888.com/index/Api/authorization',
                                    data: { js_code: result2.code },
                                    method: 'POST',
                                    success: function (result3) {
                                        console.log(result3)
                                        if (result3.statusCode == 200 && result3.data.code == 2000) {
                                            wx.setStorageSync('authorization', result3.data.data.authorization);
                                        }else{
                                            that.authorization(); 
                                        }
                                    },
                                    complete: function(){
                                        wx.loading('close');
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
}

module.exports = common;
