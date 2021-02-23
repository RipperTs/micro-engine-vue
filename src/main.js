import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/nutui'
import './plugins/axios'
import './assets/fonts/iconfont/iconfont.css'
import './assets/fonts/iconfont/iconfont.js'
import {FormModel, Input, Button} from 'ant-design-vue'
import VueClipboard from 'vue-clipboard2';
import utils from './utils'
import util from './utils/util.js'
import wx from 'weixin-js-sdk'
import siteinfo from '../siteinfo'

// 登录取值工具
Vue.prototype.$utils = utils

let title = ' - ' + siteinfo.name
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + title
    }
    next()
})

// 微信工具初始化
Vue.prototype.wechatUtil = function (resolve, reject) {
    let _this = this
    _this._get('wxapp/wechatUtil', {
        url: window.location.href
    }, res => {
        if (res.data.appId) {
            wx.config({
                debug: false,
                appId: res.data.appId,
                timestamp: res.data.timestamp,
                nonceStr: res.data.nonceStr,
                signature: res.data.signature,
                jsApiList: res.data.jsApiList
            })
            wx.ready(res => {
                // 微信SDK准备就绪后执行的回调。
                resolve && resolve(wx, res);
            })
        } else {
            reject && reject(res)
        }
    })
}

// 构建微信支付请求
Vue.prototype.wxPayment = function (option) {
    let _this = this;
    let options = Object.assign({
        payment: {},
        success: () => {
        },
        fail: () => {
        },
        complete: () => {
        },
    }, option);
    _this.wechatUtil((wx, res) => {
        wx.chooseWXPay({
            timestamp: options.payment.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: options.payment.nonceStr, // 支付签名随机串，不长于 32 位
            package: 'prepay_id=' + options.payment.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: options.payment.paySign, // 支付签名
            success: function (res) {
                options.success(res);
            },
            fail(res) {
                options.fail(res);
            },
            complete(res) {
                options.complete(res);
            }
        });
    });
}

//当前用户id
Vue.prototype.getUserId = function () {
    return Vue.ls.get('user_id');
}

// 执行用户登陆
Vue.prototype.doLogin = function () {
    let pages = this.$route;
    Vue.ls.set('currentPage', pages.path);
    Vue.ls.set('currentPageParam', pages.query);
    // 跳转用户授权页面
    router.push({
        path: '/login/login'
    })
}

// 购物车数量
Vue.prototype.setTabBarBadge = function () {
    let _this = this;
    _this._get('wxapp/cartNum', {}, res => {
        _this.GLOBAL.cart_total_num = res.total_num;
    })
}


/**
 * 记录 formid
 */
Vue.prototype.saveFormId = function (formId) {
    let _this = this;
    if (formId === 'the formId is a mock one') {
        return false;
    }
    _this._post_form('wxapp.formId/save', {
        formId: formId
    }, null);
}

/**
 * 验证是否存在user_info
 */
Vue.prototype.validateUserInfo = function () {
    let user_info = Vue.ls.get('user_info');
    return !!Vue.ls.get('user_info');
}

/**
 * 跳转指定页面
 */
Vue.prototype.navigationTo = function (url, params = {}) {
    router.push({
        path: url,
        query: params,
    }).catch(error => error)
}

/**
 * 返回指定页面参数
 */
Vue.prototype._params = function () {
    return this.$route.query;
}

/**
 * 获取用户信息并存入缓存
 */
Vue.prototype.getUserInfo = function () {
    let _this = this;
    _this._post_form('user.index/detail', {}, res => {
        if (res.data.userInfo) {
            Vue.ls.set('userInfo', res.data);
        } else {
            // 登陆失效去登陆
            Vue.ls.remove('userInfo');
            _this.doLogin();
        }
    })
}

/**
 * get 请求
 */
Vue.prototype._get = function (url = '', data, success, fail) {
    let _this = this;
    url = '/api/' + url;
    data.params = {
        sss: 'h5',
        ...data,
        wxapp_id: siteinfo.wxappId,
        token: Vue.ls.get('token')
        // token: 'bce5873a8db2e709b5f4792a9602e20f'
    };
    _this.axios.get(url, data).then(res => {
        if (typeof res !== 'object') {
            _this.$toast.fail('网络请求出错');
            _this.$toast.loading('网络请求出错', {
                coverColor: "rgba(0,0,0,0.5)",
                duration: 300, // 自定义关闭时长
            });
            return false;
        }
        if (res.code === -1) {
            // 登陆失效,并且需要验证登陆
            Vue.ls.set('token', false);
            _this.doLogin();
        } else if (res.code === 0) {
            if (res.msg) {
                _this.$toast.loading(res.msg, {
                    coverColor: "rgba(0,0,0,0.5)",
                    duration: 300, // 自定义关闭时长
                });
                _this.$toast.fail(res.msg, function () {
                    fail && fail(res);
                });
            }
            return false;
        } else {
            success && success(res);
        }
    })
}


/**
 * post 请求
 */
Vue.prototype._post_form = function (url, data, success, fail) {
    let _this = this;
    url = '/api/' + url;
    // 判断文件上传(选择不同追加token方式)
    if (typeof data.get == 'function' && data.get('iFile')) {
        data.append('wxapp_id', siteinfo.wxappId);
        data.append('token', Vue.ls.get('token'));
    } else {
        data.wxapp_id = siteinfo.wxappId;
        data.token = Vue.ls.get('token');
        // data.token = 'bce5873a8db2e709b5f4792a9602e20f';
    }
    _this.axios.post(url, data).then(res => {
        if (typeof res !== 'object') {
            _this.$toast.fail('网络请求出错');
            _this.$toast.loading('网络请求出错', {
                coverColor: "rgba(0,0,0,0.5)",
                duration: 300, // 自定义关闭时长
            });
            return false;
        }
        if (res.code === -1) {
            Vue.ls.set('token', false);
            _this.doLogin();
        } else if (res.code === 0) {
            if (res.msg) {
                _this.$toast.loading(res.msg, {
                    coverColor: "rgba(0,0,0,0.5)",
                    duration: 300, // 自定义关闭时长
                });
                _this.$toast.fail(res.msg, function () {
                    fail && fail(res);
                });
            }
            return false;
        }
        success && success(res);
    })
}

/**
 * 仿小程序 setData
 */
Vue.prototype.setData = function (data) {
    return Object.assign(this._data, data);
}

/**
 * 验证登陆
 */
Vue.prototype.checkIsLogin = function () {
    return Vue.ls.get('token') != '' && Vue.ls.get('user_id') != '';
}

/**
 * 获取场景值(scene)
 */
Vue.prototype.getSceneData = function (query) {
    return query.scene ? util.scene_decode(query.scene) : {};
}

/**
 * 生成转发的url参数
 */
Vue.prototype.getShareUrlParams = function (params) {
    let _this = this;
    return util.urlEncode(Object.assign({
        referee_id: _this.getUserId()
    }, params));
}

Vue.use(FormModel);
Vue.use(VueClipboard);
Input.install(Vue);
Button.install(Vue);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
