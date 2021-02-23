<template>

</template>

<script>
export default {
    name: 'login',

    created() { //视图加载前执行
        let _this = this
        if (_this.$ls.get('token')) {
            _this.$router.push('/')
            return false
        }
        if (!_this.$ls.get('token') || !_this.$ls.get('user_id')) {
            let code = _this.$utils.getUrlKey('code')
            code ? _this.userLogin(code) : _this.getCode()
            return false
        }
    },
    mounted() {
        let _this = this;
        _this.path = _this.$ls.get('currentPage');
    },
    methods: {
        /**
         * 引导用户进入授权页面同意授权，获取登录需要用的code
         */
        getCode: function () {
            let _this = this
            _this._post_form('user/getCode', {}, res => {
                window.location.href = res.data.url
            })
        },

        /**
         * 用code到后台登录，并换取token
         * @param code
         */
        userLogin: function (code) {
            let _this = this
            _this._post_form('user/userLogin', {
                code: code
            }, result => {
                if (result.code === 1) {
                    _this.$ls.set('token', result.data.token);
                    _this.$ls.set('user_id', result.data.user_id);
                    _this.$toast.success(result.msg, {
                        onClose: _this.onClose()
                    });
                } else {
                    _this.$toast.fail('登陆失败');
                }
            });
        },

        onClose() {
            let _this = this;
            // 登陆后调回原页面
            _this.$router.push({
                path: '/',
            })
        },
    }
}
</script>

<style scoped>

</style>
