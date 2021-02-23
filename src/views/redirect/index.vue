<template>
    <div class="content-box">
        <div v-if="isShow">
            <div class="btn-small-index">
                <circle-progressbar
                    :id="1"
                    barColor="#6979F8"
                    backgroundColor="#d9d9d9"
                    :width="120"
                    :radius="8"
                    :progress="timeOut * 10"
                    :isAnimation="false">
                </circle-progressbar>
            </div>
            <div class="text-content">
                正在跳转目标网站,请您耐心等待片刻!
            </div>
            <div class="btn-box" @click="toWebView()">
                <div class="btn" id="toGo">
                    不想等待? 点击立即查看精彩内容...
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import circleProgressbar from 'vue-circleprogressbar';

export default {
    components: {
        circleProgressbar
    },
    name: 'Redirect',
    data() { //默认数据
        return {
            options: '',
            detail: {},
            command: '',
            timeOut: 1, //跳转倒计时
            progressOption: {
                radius: 50,
                strokeOutWidth: 10,
                backColor: '#d9d9d9',
                progressColor: '#6979F8'
            },
            isShow: false,
        }
    },
    created() {
        let _this = this;
        this.loading = this.$toast.loading('Loading...', {
            coverColor: "rgba(0,0,0,0.5)",
        });
        _this.options = _this.$route.query;
        _this.getRedirectLink();
    },
    mounted() {
        let _this = this;

    },
    methods: {

        // 获取待跳转链接
        getRedirectLink() {
            let _this = this;
            _this.loading.hide();
            if (_this.options.key) {
                // window.location =
                _this.getFindKey(_this.options.key);
            } else {
                _this.navigationTo('/')
            }
        },

        // 查找对应的赋能记录
        getFindKey(key) {
            let _this = this;
            _this._get('generate/findKey', {
                key
            }, res => {
                _this.loading.hide()
                _this.detail = res.data.detail
                _this.command = res.data.command
                if (_this.command == '') {
                    window.location = _this.detail.hara_url
                    return false
                }
                _this.isShow = true
                // 倒计时跳转
                _this.countdown()
            });
        },

        // 去外部url
        toWebView(type = true) {
            let _this = this;
            this.loading = this.$toast.loading('Loading...', {
                coverColor: "rgba(0,0,0,0.5)",
            });
            if (!type) {
                window.location = _this.detail.hara_url
                return false
            }
            if (_this.detail.is_switch == 10) {
                _this.$copyText(_this.command).then(function (e) {
                    window.location = _this.detail.hara_url
                })
            } else {
                window.location = _this.detail.hara_url
            }
        },

        // 倒计时跳转
        countdown() {
            let _this = this
            let timeO = setInterval(() => { // 加定时器,一秒后触发
                _this.timeOut++;
                if (_this.timeOut >= 10) {
                    _this.toWebView(false);
                    clearInterval(timeO)
                }
            }, 1000);
        },

        destroyed() {
            let _this = this;
            //切记页面销毁需要销毁
            _this.loading.hide();
        }
    }
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>

