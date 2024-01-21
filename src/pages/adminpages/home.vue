<template>
    <div class="admin-box" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        <h1>这是管理页首页</h1>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'adminHome',
    data() {
        return {
            user:null,
            voiceid: 0,
            lound: 1,
            speed: 1,
            hz: 1,
            voicelist: [],
            fullscreenLoading: true,
            wd: {
                kuan: 1086,
                gao: 720
            },
            base: {
                kuan: 100,
                gao: 100
            },
            synth: null,
            msg: null
        }
    },
    components: {
     
    },
    created() {
        this.fullscreenLoading = true;
        const token = Cookies.get('token'); // 获取名为 'username' 的cookie的值
        if (token) {
            this.user = JSON.parse(atob(token));
            console.log(this.user);
            if(this.user.rule <10){
                console.log('Cookie不存在');
                this.$message.warning("对不起，您没有权限访问管理后台！")
                this.$router.push('/home');
            }


        } else {
            console.log('Cookie不存在');
            this.$message.warning("请先登录！")
            this.$router.push('/login?reback=admin');
        }

    },
    mounted() {
        //重新计算页面
        // this.init();
        


        //添加监听器，当页面发生变化时重新计算/- 防止数据丢失，暂不开启  -/
        // window.addEventListener('resize', () => this.init());
        setTimeout(() => {
            // this.init();
            this.fullscreenLoading = false;
        }, 300)

    },
    methods: {
        loaded() {
            // this.init();
            // this.fullscreenLoading = false;
            console.log("页面加载完毕");
        },
    }
}
</script>

<style lang="less" scoped>
.shootbox {
    background-color: #9a9a9a;
}

</style>
