<template>
    <div class="content-boxs">
        <div v-if="list.length">
            <nut-infiniteloading
                @loadmore="onInfinite"
                :is-show-mod="true"
                :has-more="isHasMore"
                :is-loading="isLoading"
                :threshold="20"
            >
                <div class="list-box" v-for="(item,index) in list" :key="index">
                    <div class="list-content">
                        <div class="list-left">
                            <div class="title">{{ item.pay_status.text }}</div>
                            <div class="time">{{ item.create_time }}</div>
                        </div>
                        <div class="list-right">
                            <div class="price-box">
                                {{ item.pay_price == item.actual_money ? '￥' + item.pay_price : '充￥' + item.pay_price + ' 送 ' + '￥' + item.gift_money }}
                            </div>
                        </div>
                    </div>
                </div>
            </nut-infiniteloading>
        </div>
        <div v-else>
            <div class="noresult">
                <img src="../../assets/images/no_result.png" alt="">
                <span style="color: #666">暂无记录</span>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'RechargeRecord',
    data() { //默认数据
        return {
            list: [], // 充值记录
            current_page: 1,
            last_page: 1,
            isHasMore: true,
            isLoading: false,
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
        // 获取充值记录
        _this.getRechargeOrder();
    },
    methods: {

        // 获取充值记录
        getRechargeOrder(page = 1) {
            let _this = this;
            _this._get('recharge.order/lists', {
                page,
                status: 20,
            }, function (res) {
                _this.loading.hide();
                _this.list = _this.list.concat(res.data.list.data)
                _this.last_page = res.data.list.last_page
                _this.current_page = res.data.list.current_page
                _this.isLoading = false;
                _this.isHasMore = res.data.list.data.length > 0 ? true : false;
            });
        },

        /**
         *  触底加载
         */
        onInfinite: function () {
            if (this.current_page >= this.last_page) {
                this.isLoading = false;
                this.isHasMore = false;
                return false;
            }
            this.isLoading = true;
            this.isHasMore = true;
            this.getRechargeOrder(this.current_page + 1);
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
@import "recharge_record.scss";
</style>
