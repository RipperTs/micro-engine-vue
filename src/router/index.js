import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'Index',
        component: (resolve) => require(['../views/index/index.vue'], resolve),
        meta: {
            title: '开始使用'
        }
    },
    {
        path: '/member',
        name: 'Member',
        component: (resolve) => require(['../views/member/member.vue'], resolve),
        meta: {
            title: '个人中心'
        }
    },
    {
        path: '/redirect',
        name: 'Redirect',
        component: (resolve) => require(['../views/redirect/index.vue'], resolve),
        meta: {
            title: '正在跳转中...'
        }
    },
    {
        path: '/order_list',
        name: 'OrderList',
        component: (resolve) => require(['../views/order/list.vue'], resolve),
        meta: {
            title: '历史赋能记录'
        }
    },
    {
        path: '/recharge',
        name: 'Recharge',
        component: (resolve) => require(['../views/member/recharge.vue'], resolve),
        meta: {
            title: '充值中心'
        }
    },
    {
        path: '/member/faq',
        name: 'MemberFaq',
        component: (resolve) => require(/* 常见问题 */ ['../views/member/faq.vue'], resolve),
        meta: {
            title: '常见问题'
        }
    },
    {
        path: '/member/recharge_record',
        name: 'RechargeRecord',
        component: (resolve) => require(['../views/member/recharge_record.vue'], resolve),
        meta: {
            title: '充值记录'
        }
    },
    {
        path: '/login/login',
        name: 'login',
        component: (resolve) => require(['../views/login/login.vue'], resolve),
        meta: {
            title: '授权登录'
        }
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
