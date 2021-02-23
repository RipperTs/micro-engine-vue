<template>
    <div id="nav">
        <router-link to="/">
            <span class="iconfont icon-shouye1"/>
            <p>首页</p>
        </router-link>
        <router-link to="/member">
            <span class="iconfont icon-wode2"/>
            <p>我的</p>
        </router-link>
    </div>
</template>
<script>
export default {
    name: 'Tabber',

    data: function () {
        return {

        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>
<style lang="scss">
#nav {
    width: 100%;
    padding: 5px 0;
    max-width: 750px;
    background: $white;
    text-align: center;
    position: fixed;
    bottom: -1px;
    left: 50%;
    @include tlate(-50%, 0);
    z-index: 9999;
    @include shadow();

    .iconfont {
        font-size: 20px;
        position: relative;
        z-index: -1;
    }

    .cart {
        display: flex;
        justify-content: center;

        .cart-child {
            width: 60px;

            .cart-total-num {
                background: rgba(255, 86, 86, 1);
                width: 20px;
                height: 20px;
                border-radius: 60px;
                float: right;
                color: #fff;
                text-align: center;
                line-height: 20px;
                margin-top: -25px;
                margin-right: 5px;
                z-index: 99;
            }
        }

    }

    a {
        float: left;
        width: 50%;
        font-size: 12px;
        color: $color-90;

        &.router-link-exact-active {
            color: #A16ED6;

            p {
                color: #A16ED6;
            }
        }
    }
}
</style>
