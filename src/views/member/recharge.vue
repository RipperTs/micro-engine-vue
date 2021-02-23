<!-- member -->
<template>
    <div class="content">
        <div class="detail-box">
            <div class="info-box">
                <div class="info-left">账户余额</div>
                <div class="info-right money">￥{{ userInfo.balance }}</div>
            </div>
            <div class="set-meal-box">
                <div class="title">充值套餐</div>
                <div :class="['meal-box',item.plan_id == plan_id ? 'active' : '']" v-for="(item,index) in planList"
                     :key="index" @click="selectPlan(item.plan_id)">
                    <div class="money-title">{{ item.money }}</div>
                    <div class="gift-money">送{{ item.gift_money }}</div>
                </div>
                <div class="input-box" v-if="setting.is_custom == 1">
                    <input type="number" v-model="money" placeholder="请输入充值金额">
                </div>
            </div>
            <div class="btn-box" @click="submit()">
                立即充值
            </div>
            <div class="html-box" v-if="setting.describe.length">
                <div class="title">充值说明</div>
                <div class="content" v-html="replaceString(setting.describe)"></div>
            </div>
        </div>
    </div>
</template>
<script>
// 枚举类：充值类型
import RechargeTypeEnum from '../../utils/RechargeType';

export default {
    name: 'Recharge',
    data() {
        return {
            userInfo: {}, // 用户信息
            setting: {}, // 充值设置

            // recharge_type: '', // 充值类型
            selectedPlanId: 0, // 当前选中的套餐id
            inputValue: '', // 自定义金额
            planList: {},  // 套餐列表
            disabled: false, //按钮禁用
            plan_id: 0,
            money: '',
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
        // 获取充值中心数据
        _this.getRechargeIndex();
    },
    methods: {

        //提交到后端
        submit() {
            let _this = this;
            if (!_this.money && !_this.plan_id) {
                _this.$toast.fail('请选择充值套餐或充值金额');
                return false
            }
            this.loading = this.$toast.loading('Loading...', {
                coverColor: "rgba(0,0,0,0.5)",
            });
            _this._post_form('recharge/submit', {
                planId: _this.money ? 0 : _this.plan_id,
                customMoney: _this.money,
            }, result => {
                console.log(result);
                _this.wxPayment({
                    payment: result.data.payment,
                    success() {
                        _this.$toast.success(result.msg.success, {
                            onClose: _this.onClose()
                        });
                    },
                    fail(res) {
                        _this.$toast.fail(result.msg.error);
                    },
                    complete(res) {
                    }
                });
                _this.loading.hide();
            });
        },

        onClose() {
            this.getRechargeIndex()
        },

        // 格式化说明内容
        replaceString(string) {
            return string.replace(/\n/g, "<br/>")
        },

        // 选择套餐
        selectPlan(plan_id) {
            this.plan_id = plan_id
            this.money = ''
        },

        // 获取充值中心数据
        getRechargeIndex() {
            let _this = this;
            _this._get('recharge/index', {}, res => {
                _this.setData(res.data);
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
@import "recharge.scss";
</style>


