// 将微信小程序 wx.request Promise 化
function wxPromisify(fn) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function (res) {
                // 成功
                if(res.data.msg && (res.data.msg == '未能读取到有效Token'|| res.data.msg.indexOf('Token无效')>-1)){
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                }
                resolve(res)
            };
            obj.fail = function (res) {
                // 失败

                reject(res)
            };
            fn(obj)
        })
    }
}

// 无论 Promise 对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};

/**
 * @description 微信请求 get 方法
 * @param {String} url 接口地址
 * @param {Object} data 参数数据
 */

function getRequest(url, data) {
    let getRequest = wxPromisify(wx.request);
    let token = wx.getStorageSync('tokenKey');
    return getRequest({
        url: url,
        method: 'GET',
        data: data,
        header: {
            'Content-Type': 'application/json',
            'token':token
        }
    })
}

/**
 * @description 微信请求 post 方法
 * @param {String} url 接口地址
 * @param {Object} data 参数数据
 */
function postRequest(url, data) {
    let postRequest = wxPromisify(wx.request);
    let token = wx.getStorageSync('tokenKey');
    return postRequest({
        url: url,
        method: 'POST',
        data: data,
        header: {
            'content-type': 'application/json',
            'token':token
        },
    })
}

/**
 * @description 微信请求 put 方法
 * @param {String} url 接口地址
 * @param {Object} data 参数数据
 */
function putRequest(url, data) {
  let putRequest = wxPromisify(wx.request);
  let token = wx.getStorageSync('tokenKey');
  return putRequest({
      url: url,
      method: 'PUT',
      data: data,
      header: {
          'content-type': 'application/json',
          'token': token
      },
  })
}

module.exports = {
    get: getRequest,
    post: postRequest,
    put: putRequest
};
