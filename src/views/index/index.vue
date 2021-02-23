<template>
    <div class="index-box" style="padding-bottom: 80px;">
        <!-- banner -->
        <div class="banner" v-if="bannerList.length">
            <nut-swiper
                direction="horizontal"
                :loop="true"
                :canDragging="false"
                :paginationVisible="true"
                :swiperData="bannerList"
                :autoPlay=5000
            >
                <div v-for="(item,index) in bannerList" :key="index" class="nut-swiper-slide">
                    <div @click="toBanner(item.h5_links)">
                        <img :src="item.image.file_path">
                    </div>
                </div>
            </nut-swiper>
        </div>
        <!-- banner end -->
        <div class="content-box">
            <div class="list-box">
                <div class="list-left">原始链接：</div>
                <div class="list-right">
                    <input type="text" v-model="haraUrl" placeholder="请将原始链接复制到这里">
                </div>
            </div>
            <div class="list-box">
                <div class="list-left">赋能开关：</div>
                <div class="list-right">
                    <nut-switch
                        :active="isEmpower"
                        @change="onEmpower"
                        class="my-switch"
                    >
                    </nut-switch>
                </div>
            </div>
            <div class="list-box">
                <div class="list-left">推广口令：</div>
                <div class="list-right">
                    <input type="text" v-model="command" placeholder="请将要推广的口令复制到这里">
                </div>
            </div>
            <div class="list-box">
                <div class="list-left">转发标题：</div>
                <div class="list-right">
                    <input type="text" v-model="shareTitle" placeholder="请输入转发的标题">
                </div>
            </div>
            <div class="textarea-box">
                <div class="title">转发内容：</div>
                <textarea v-model="shareContent" cols="45" rows="5" placeholder="链接内容复制到这里"></textarea>
            </div>
            <div class="share-image">
                <div class="title">转发图片：</div>
                <div class="image-box">
                    <!--                    <div class="empty-box">-->
                    <!--                        <div class="icon-img">-->
                    <!--                            <img src="../../assets/icon/zhaoxiangji.svg" alt="">-->
                    <!--                        </div>-->
                    <!--                        <div class="text">添加照片</div>-->
                    <!--                    </div>-->
                    <nut-imagepicker
                        @imgMsg="imgMsg"
                        :width="105"
                        :height="90"
                        :margin="10"
                        :imgList.sync="images"
                        :max="1"
                    >
                    </nut-imagepicker>
                </div>
            </div>
            <div class="btn-box" @click="submitPop()">
                生成链接
            </div>
        </div>
        <div class="pop-box" v-if="isShowPop">
            <div class="pop-modal">
                <div class="avatar-box">
                    <div class="yuan">
                        <img :src="userInfo.avatarUrl" alt="">
                    </div>
                    <div class="close" @click="showPop()">X</div>
                </div>
                <div class="name-box">{{ userInfo.nickName }}</div>
                <div class="name-box tips">赋能链接海报已生成!快去分享吧</div>
                <div class="share-img">
                    <img :src="promoteImg" alt="">
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

        <Tabber></Tabber>
    </div>
</template>
<script>
import Tabber from '@/components/Tabber.vue'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default {
    name: 'index',
    components: {
        Tabber
    },
    data() { //默认数据
        return {
            bannerList: [],
            haraUrl: '',
            command: '',
            shareTitle: '',
            shareContent: '',
            isEmpower: true,
            isShowPop: false,
            images: [],
            uploadImgs: [], // 待上传图片文件
            promoteImg: '',
            copyUrl: '',
            userInfo: {},
            key: '',
            isPoster: false, // 展示海报图片
            posterImg: 'https://funeng.test.noteo.cn/temp/10001/goods_41c1a2f7f873c871bb4a3547159401e0.png?t=1604309672',
        }
    },
    created() {
        let _this = this;
        this.loading = this.$toast.loading('Loading...', {
            coverColor: "rgba(0,0,0,0.5)",
        });
    },
    mounted() {
        let _this = this;
        _this.getBanner();
        _this.shareInit()
    },

    methods: {

        // 跳转banner
        toBanner(link) {
            let _this = this;
            if (link != 0) {
                _this.navigationTo(link)
            }
        },

        // 图片处理
        imgMsg(data) {
            let _this = this;
            if (data.code == 2) {
                _this.cacheImages = _this.images;
                data.msg.forEach((item, index) => {
                    getBase64(item).then(val => {
                        if (_this.images.indexOf(val)) {
                            _this.uploadImgs = item;
                        }
                    });
                });
            }
            if (data.code == 3) {
                _this.cacheImages.forEach((item, index) => {
                    if (item.id == data.msg) {
                        _this.uploadImgs = [];
                    }
                });
            }
        },

        // 图片文件
        uploadFile(imagesFile, callBack, formData) {
            let _this = this,
                form = new FormData();
            form.append('iFile', imagesFile);
            _this._post_form('upload/image', form, (res) => {
                if (res.code === 1) {
                    let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
                    // 所有文件上传完成
                    formData = result;
                    // 执行回调函数
                    callBack && callBack(formData);
                }
            });

        },

        // 获取banner
        getBanner() {
            let _this = this;
            _this._get('wxapp/banner', {}, res => {
                _this.bannerList = res.data.bannerList
                _this.loading.hide();
            });

        },

        // 赋能开关
        onEmpower(e) {
            let _this = this;
            console.log(e)
            _this.isEmpower = e;
        },

        // 提交生成链接
        showPop() {
            let _this = this;
            _this.isShowPop = !_this.isShowPop;
        },

        // 初始化分享
        shareInit() {
            let _this = this;
            _this.wechatUtil((wx, res) => {
                let shareData = {
                    title: _this.shareTitle, // 分享标题
                    desc: _this.shareContent, // 分享描述
                    link: _this.copyUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _this.promoteImg, // 分享图标
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
        submitPop() {
            let _this = this;
            // 表单校验
            if (!_this._validation()) {
                return false;
            }
            _this.loading = this.$toast.loading('Loading...', {
                coverColor: "rgba(0,0,0,0.5)",
            });
            // 执行文件上传
            _this.uploadFile(_this.uploadImgs, (res) => {
                _this.promoteImg = res.file_path
                _this._post_form('generate/create', {
                    hara_url: _this.haraUrl,
                    title: _this.shareTitle,
                    content: _this.shareContent,
                    file_id: res.file_id,
                    is_switch: _this.isEmpower ? 10 : 20,
                    command: _this.command,
                }, result => {
                    _this.copyUrl = result.data.url
                    _this.key = result.data.key
                    _this.shareInit()
                    _this.getUserInfo();
                });
            })
        },

        //  获取用户信息
        getUserInfo() {
            let _this = this;
            _this._get('user/detail', {}, res => {
                _this.userInfo = res.data.userInfo
                _this.isShowPop = true
                _this.loading.hide();
            });
        },

        // 复制链接
        copyLink() {
            let _this = this;
            console.log(_this.copyUrl)
            _this.$copyText(_this.copyUrl).then(function (e) {
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

        // 规则校验
        _validation() {
            if (this.haraUrl == '') {
                this.$toast.warn('请填写原始链接');
                return false
            }
            let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
            if (!reg.test(this.haraUrl)) {
                this.$toast.warn('原始链接不是一个标准的网站地址');
                return false;
            }
            // if (this.command == '') {
            //     this.$toast.warn('请填写推广口令');
            //     return false
            // }
            if (this.shareTitle == '') {
                this.$toast.warn('请填写转发标题');
                return false
            }
            if (this.shareContent == '') {
                this.$toast.warn('请填写转发内容');
                return false
            }
            if (typeof this.uploadImgs.length == 'number') {
                this.$toast.warn('请上传转发图片');
                return false
            }
            return true
        },


    },
    destroyed() {
        let _this = this;
        //切记页面销毁需要销毁
        // window.removeEventListener('scroll', this.windowScroll);
        _this.loading.hide();
    }
}
</script>
<style lang="scss">
.index-box {
    background: #f7f7f7;
    position: relative;
    z-index: 1;

    &::after {
        content: "";
        height: 200px;
        //background: #6979F8;
        border-radius: 0 0 250px 250px;
        position: absolute;
        top: 0;
        left: -75px;
        right: -75px;
        z-index: -1;
    }

    .nut-swiper .nut-swiper-pagination .swiper-pagination-bullet.active {
        background: $main-color;
    }

    .countdown-box {
        float: left;

        span {
            float: left;
            color: $main-color;
            font-weight: bold;
        }

        .nut-cd-block {
            height: 24px;
            padding: 0 4px;
            background: $main-color;
            color: #fff;
            margin: 0 4px;
            border-radius: 4px;
        }
    }

    .nut-cd-timer {
        display: flex;
        align-items: center;
        justify-content: center;

        .nut-cd-block {
            display: block;
            font-size: 12px;
            width: 22px;
            height: 18px;
            background: #6979F8;
            color: #ffffff;
            text-align: center;
            line-height: 18px;
            border-radius: 5px;
            font-weight: 500;

            &:first-child {
                display: none;
            }
        }

        .nut-cd-dot {
            width: 10px;
            height: 10px;
            font-size: 20px;
            color: #6979F8;
            line-height: 10px;
            text-align: center;

            &:nth-child(2) {
                display: none;
            }
        }
    }

}
</style>
<style lang="scss" scoped>
@import "index.scss";
</style>
