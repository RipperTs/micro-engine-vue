<!-- member -->
<template>
    <div class="member-box">
        <div class="bg-box">
            <div class="avatar-box">
                <img :src="userInfo.avatarUrl" alt="">
            </div>
            <div class="name-box">
                {{ userInfo.nickName }}
            </div>
            <div class="num-box">
                余额: ￥{{ userInfo.balance }}
            </div>
        </div>
        <div class="features-box">
            <router-link to="/order_list" class="list-box">
                <div class="title">赋能记录</div>
                <div class="icon"><img src="../../assets/icon/youjiantou.svg" alt=""></div>
            </router-link>
            <router-link to="/recharge" class="list-box">
                <div class="title">余额充值</div>
                <div class="icon"><img src="../../assets/icon/youjiantou.svg" alt=""></div>
            </router-link>
            <router-link to="/member/recharge_record" class="list-box">
                <div class="title">充值记录</div>
                <div class="icon"><img src="../../assets/icon/youjiantou.svg" alt=""></div>
            </router-link>
            <router-link to="/member/faq" class="list-box">
                <div class="title">常见问题</div>
                <div class="icon"><img src="../../assets/icon/youjiantou.svg" alt=""></div>
            </router-link>

        </div>
        <Tabber/>
    </div>
</template>
<script>
import Tabber from '@/components/Tabber.vue'

export default {
    name: 'Member',
    components: {
        Tabber
    },
    data() {
        return {
            RemainingNum: 438,
            userInfo: {},
        }
    },
    created() { //视图加载前执行
        let _this = this;
        this.loading = this.$toast.loading('Loading...', {
            coverColor: "rgba(0,0,0,0.5)",
        });

    },
    mounted() { //视图加载完成执行
        let _this = this;
        _this.getUserInfo();
    },
    methods: {

        getUserInfo() {
            let _this = this;
            _this._get('user/detail', {}, res => {
                _this.userInfo = res.data.userInfo
                _this.loading.hide();
            });
        },
    },
    destroyed() {
        let _this = this;
        //切记页面销毁需要销毁
        _this.loading.hide();
    }
}
</script>
<style lang="scss" scoped>
@import "member.scss";
</style>


