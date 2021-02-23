<template>
    <div class="content-box">
        <div v-if="list.length">
            <nut-infiniteloading
                @loadmore="onInfinite"
                :is-show-mod="true"
                :has-more="isHasMore"
                :is-loading="isLoading"
                :threshold="20"
            >
                <div class="list-box" v-for="(item,index) in list" :key="index">
                    <div class="header-box">生成时间: {{ item.create_time }}</div>
                    <div class="list-a">
                        <div class="img-box">
                            <img :src="item.image.file_path" alt="">
                        </div>
                        <div class="content-box">
                            <div class="title">{{ item.title }}</div>
                            <div class="dec">{{ item.content }}</div>
                        </div>
                    </div>
                    <div class="btn-box">
                        <div class="btn" @click="regenerate(item.key)">重新生成</div>
                    </div>
                </div>
            </nut-infiniteloading>
        </div>
        <div v-if="!list.length">
            <div class="noresult">
                <img src="../../assets/images/no_result.png" alt="">
                <span style="color: #666">暂无数据</span>
            </div>
        </div>

        <div class="pop-box" v-if="isShowPop">
            <div class="pop-modal">
                <div class="avatar-box">
                    <div class="yuan">
                        <img :src="detail.user.avatarUrl" alt="">
                    </div>
                    <div class="close" @click="showPop()">X</div>
                </div>
                <div class="name-box">{{ detail.user.nickName }}</div>
                <div class="name-box tips">赋能链接海报已生成!快去分享吧</div>
                <div class="share-img">
                    <img :src="detail.image.file_path" alt="">
                </div>
                <div class="btn-boxs">
                    <div class="url-box" @click="copyLink()">复制链接</div>
                    <div class="haibao-box" @click="poster()">生成海报</div>
                    <!--                    <div class="share-box" @click="shareBuddy()">转发好友</div>-->
                </div>
            </div>
        </div>

        <div class="poster-box" @click="isShowPoster()" v-if="isPoster">
            <div class="image-box">
                <img :src="posterImg" alt="">
                <div class="btn-down"><a :href="posterImg" download style="width: 100%;height: 40px">下载海报图片</a></div>
            </div>
        </div>
    </div>

</template>
<script>

export default {
    name: 'OrderList',
    data() {
        return {
            list: [],
            current_page: 1,
            last_page: 1,
            isHasMore: true,
            isLoading: false,
            isPoster: false, // 展示海报图片
            isShowPop: false,
            detail: {},
            posterImg: '',
            key: '',
            copyUrl: '',
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
        _this.getList()
        _this.shareInit()
    },
    methods: {

        // 初始化分享
        shareInit() {
            let _this = this;
            _this.wechatUtil((wx, res) => {
                let shareData = {
                    title: _this.detail.title, // 分享标题
                    desc: _this.detail.content, // 分享描述
                    link: _this.detail.share_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _this.detail.image.file_path, // 分享图标
                };
                // 分享到朋友
                wx.onMenuShareAppMessage(shareData);
                // 分享到朋友圈
                wx.onMenuShareTimeline(shareData)
                // 分享到qq
                wx.onMenuShareQQ(shareData);
                // 分享到qq空间
                wx.onMenuShareQZone(shareData);
                // 分享到新浪微博
                wx.onMenuShareWeibo(shareData);
            });
        },

        // 提交生成链接
        showPop() {
            let _this = this;
            _this.isShowPop = !_this.isShowPop;
        },

        // 复制链接
        copyLink() {
            let _this = this;
            _this.$copyText(_this.detail.share_url).then(function (e) {
                _this.$toast.success('复制成功');
            })
        },

        // 生成海报
        poster() {
            let _this = this;
            _this._get('Generate/poster', {
                key: _this.key
            }, res => {
                _this.posterImg = res.data.qrcode
                _this.isPoster = true
            })
        },

        isShowPoster() {
            this.isPoster = !this.isPoster
        },

        // 重新生成
        regenerate(key) {
            let _this = this;
            _this.key = key;
            _this.loading = this.$toast.loading('Loading...', {
                coverColor: "rgba(0,0,0,0.5)",
            });
            _this._get('generate/detail', {
                key: _this.key
            }, res => {
                _this.isShowPop = true
                _this.detail = res.data.detail
                _this.shareInit()
                _this.loading.hide();
            });
        },

        // 获取列表
        getList(page = 1) {
            let _this = this;
            _this._get('generate/lists', {
                page
            }, res => {
                _this.list = _this.list.concat(res.data.list.data)
                _this.current_page = res.data.list.current_page
                _this.last_page = res.data.list.last_page
                _this.loading.hide();
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
            this.getList(this.current_page + 1);
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
@import "list.scss";
</style>


