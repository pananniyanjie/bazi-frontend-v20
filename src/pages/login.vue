<template>
    <div ref="shootbox" class="shootbox" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        <el-container>
            <el-header></el-header>
            <el-main>
                <div class="main">
                    <div class="login-box">

                        <el-card class="box-card" style="width:450px;">
                            <div slot="header" class="clearfix">
                                <span style="font-size:20px">欢迎使用祥源体育激光射击练习系统</span>

                            </div>
                            <div style="margin:25px;">
                                <el-form ref="form" :model="form">
                                    <el-form-item>
                                        <el-input prefix-icon="el-icon-user" v-model="form.username"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-input prefix-icon="el-icon-lock" v-model="form.password"
                                            show-password></el-input>
                                    </el-form-item>
                                    <br />

                                    <el-button type="primary" style="width:100%" @click="onSubmit"
                                        :loading="btnlooding">登录</el-button>
                                    <span style="display:flex;justify-content: space-between;margin-top:15px">
                                        <el-button style="float: right; padding: 3px 0" type="text"
                                            @click="forgetpwd">忘记密码?</el-button>
                                        <el-button style="float: right; padding: 3px 0" type="text"
                                            @click="tohelp">帮助文档</el-button>
                                    </span>
                                    <!-- <el-button style="float: right; padding: 3px 0" type="text">帮助文档</el-button> -->
                                </el-form>
                            </div>
                        </el-card>
                    </div>
                </div>

            </el-main>
            <el-footer>
                <div class="footer">祥源体育 版权所有 2022-2023 © All CopyRights Reserved.</div>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios'
import md5 from 'js-md5';
import JSEncrypt from 'jsencrypt'
export default {
    name: 'login',
    data() {
        return {
            btnlooding: false,
            fullscreenLoading: true,
            username: null,
            password: null,
            respoen: null,
            form: {
                username: '',
                password: ''
            }
        }
    },
    components: {

    },
    created() {
        this.fullscreenLoading = true;

    },
    mounted() {
        document.title = '登录页';
        setTimeout(() => {
            this.fullscreenLoading = false;
        }, 1000)

    },
    methods: {
        loaded() {
            // this.init();
            // this.fullscreenLoading = false;
            console.log("页面加载完毕");
        },
        forgetpwd() {
            this.$alert('如果您忘记了您账号的密码，请联系场地管理员在后台重置您的账号', '我忘记了我的密码。', {
                confirmButtonText: '确定',
                callback: action => {
                }
            });
        },
        tohelp() {
            this.$router.push('/help');
        },
        onSubmit() {
            this.btnlooding = true;
            console.log("login???");
            Cookies.remove('username'); // 先删除cookie
            Cookies.remove('userid'); // 先删除
            Cookies.remove('token'); // 先删除cookie
            Cookies.remove('type'); // 先删除cookie
            let pwd = md5(this.form.password);
            axios.get('/api/user/login.php?username=' + this.form.username + "&password=" + pwd)
                .then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('欢迎回来，'+ res.data.data.nickName);



                        Cookies.set('token', res.data.data.token, { expires: 7 }); // 设置名为 'username' 的cookie，有效期为7天
                        Cookies.set('nickname', res.data.data.nickName, { expires: 7 }); // 设置名为 'username' 的cookie，有效期为7天

                        setTimeout(() => {
                            let reback = this.$route.query.reback;
                            this.btnlooding = false;
                            if( reback == "shootboard" ){
                                this.$router.push('/shootboard');
                            }else if(reback == "home"){
                                this.$router.push('/home');
                            }else{
                                this.$router.push('/home');
                            }

                            

                            

                        }, 2000)
                    } else {
                        this.$message.error(res.data.msg);
                        this.btnlooding = false;
                    }


                })
                .catch(err => {
                    console.log(err);
                    this.$message.error('502 服务器连接失败 [' + err.message + "]");
                    this.btnlooding = false;
                });




        }

    }
}
</script>

<style lang="less" scoped>
.shootbox {
    background-image: url("../assets/images/login_background.jpg");
    background-size: cover;
}

.main {

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-box {
    text-align: center;
    display: flex;
    margin-bottom: 50px;

}

.footer {
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);

}
</style>
