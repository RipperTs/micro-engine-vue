<template>
    <div class="faq-box">
        <!-- news -->
        <div class="faq-list">
            <div class="list-item" v-for="(item,index) in faqList" :key="index" @click="statusChange(index)">
                <div class="title">{{item.title}}</div>
                <div v-if="item.status" class="content">
                    {{item.content}}
                </div>
            </div>
        </div>
        <!-- news end -->
    </div>
</template>
<script>

    export default {
        name: 'MemberFaq',
        data() { //默认数据
            return {
                faqList: []
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
            _this.getHelpList();
        },
        methods: { //页面方法
            /**
             * 获取帮助列表
             */
            getHelpList: function () {
                let _this = this;
                _this._post_form('wxapp/help', {}, res => {
                    _this.faqList = res.data.list;
                    _this.$set(_this.faqList[0], 'status', true);
                    _this.loading.hide();
                });
            },

            /**
             * 展开状态切换事件
             */
            statusChange: function (index) {
                let _this = this;
                _this.faqList.forEach((it, index) => {
                    it.status = false;
                });
                _this.faqList[index].status = true;
                _this.faqList = _this.faqList;
            },
        },
        destroyed() {
            let _this = this;
            //切记页面销毁需要销毁
        }
    }
</script>
<style lang="scss">
    @import "faq.scss";
</style>
