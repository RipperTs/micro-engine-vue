import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Storage from 'vue-ls'

Vue.use(Storage);
const err = (error) => {
    if (error.response) {
        const data = error.response.data
        if (error.response.status === 403) {
            notification.error({
                message: 'Forbidden',
                description: data.message
            })
        }
        if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
            notification.error({
                message: 'Unauthorized',
                description: 'Authorization verification failed'
            })
        }
    }
    return Promise.reject(error);
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// response interceptor
axios.interceptors.response.use((response) => {
    return response.data
}, err)

Vue.use(VueAxios, axios)
