<template>
    <div ref="shootbox" class="shootbox" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        <el-container>
            <el-header>
                <div class="header">好久不见，{{ user.nick_name }}</div>
            </el-header>
            <el-main>
                <div class="main">
                    <div class="menu-item" @click="gotoShoot">
                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                            <img src="../assets/images/icon_shoot.png" class="image" style="width:100%">
                            <div style="padding: 14px;">
                                <span>进入射击</span>
                                <div class="bottom clearfix">
                                    <!-- <time class="time">{{ currentDate }}</time> -->
                                    <!-- <el-button type="text" class="button">操作按钮</el-button> -->
                                </div>
                            </div>
                        </el-card>
                    </div>

                    <div class="menu-item" @click="gotoList">
                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                            <img src="../assets/images/icon_list.png" class="image" style="width:100%">
                            <div style="padding: 14px;">
                                <span>查看成绩</span>
                                <div class="bottom clearfix">
                                    <!-- <time class="time">{{ currentDate }}</time> -->
                                    <!-- <el-button type="text" class="button">操作按钮</el-button> -->
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <div class="menu-item" @click="gotoPerson">
                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                            <img src="../assets/images/icon_person.png" class="image" style="width:100%">
                            <div style="padding: 14px;">
                                <span>个人中心</span>
                                <div class="bottom clearfix">
                                    <!-- <time class="time">{{ currentDate }}</time> -->
                                    <!-- <el-button type="text" class="button">操作按钮</el-button> -->
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <div class="menu-item" @click="gotoSetting">
                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                            <img src="../assets/images/icon_setting.png" class="image" style="width:100%">
                            <div style="padding: 14px;">
                                <span>系统设置</span>
                                <div class="bottom clearfix">
                                    <!-- <time class="time">{{ currentDate }}</time> -->
                                    <!-- <el-button type="text" class="button">操作按钮</el-button> -->
                                </div>
                            </div>
                        </el-card>
                    </div>



                    <div class="menu-item" v-if="adminisShow" @click="gotoAdmin">
                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                            <img src="../assets/images/icon_admin.png" class="image" style="width:100%">
                            <div style="padding: 14px;">
                                <span>管理后台</span>
                                <div class="bottom clearfix">
                                    <!-- <time class="time">{{ currentDate }}</time> -->
                                    <!-- <el-button type="text" class="button">操作按钮</el-button> -->
                                </div>
                            </div>
                        </el-card>
                    </div>

                </div>

            </el-main>
            <el-footer>
                <div class="footer">版权所有 祥源体育 2022-2023 © All CopyRights Reserved.</div>
            </el-footer>
        </el-container>

        <!-- 选择枪位对话框 -->
        <el-dialog title="请选择靶位" :visible.sync="ChooseShootSit" width="80%" center>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="gotoallboard()">多靶位预览</el-button>
            </span>
            <div class="shootlst">

                <div class="a" v-for="it in shootLst" :key="it.id">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="it.state != 2 ? it.mode == 1 ? require('../assets/images/free.png') : require('../assets/images/useed.png') : require('../assets/images/unconntd.png')"
                            class="image" style="width:100%">
                        <div style="padding: 8px;">
                            <span style="font-size:18px;font-family:'simsun';font-weight: bold;">{{ it.display_id }}</span>
                            <div class="bottom clearfix">
                                <!-- <time class="time">{{ it.mac }}</time><br /> -->
                                <time class="time" style="color:darkgray;font-size:13px">模式：{{ it.type == 1 ? '手枪靶' : '步枪靶'
                                }}</time><br />
                                <time class="time" style="color:darkgray;font-size:13px">占用：{{ it.nick_name }}</time><br />
                                <div style="display:flex;flex-direction: column">
                                    <el-button :disabled="it.state == 2" style="margin-top:10px"
                                        :type="it.state != 2 ? 'success' : 'info'" class="button"
                                        @click="gotoshootboard(it)">{{ it.mode == 2 ? '加入比赛' : it.state != 2 ?
                                            '开始练习' : '设备离线'
                                        }}</el-button>
                                    <el-button :disabled="it.state == 2" style="margin-top:10px;margin-left:0"
                                        :type="it.state != 2 ? 'success' : 'info'" class="button"
                                        @click="gotovisboard(it)">{{ it.state != 2 ? '前往观战' : '设备离线' }}</el-button>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>

            </div>
        </el-dialog>


    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';
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
            ChooseShootSit: false, // 选择射击位置
            form: {
                username: '',
                password: ''
            },
            user: null,
            adminisShow: false,
            shootLst: []
        }
    },
    components: {

    },
    created() {
        this.fullscreenLoading = true;

    },
    mounted() {

        const token = Cookies.get('token'); // 获取名为 'username' 的cookie的值
        if (token) {
            this.user = JSON.parse(decodeURIComponent(atob(token)));
            console.log(this.user);
            if (this.user.rule >= 10) this.adminisShow = true;


        } else {
            console.log('Cookie不存在');
            this.$message.warning("请先登录！")
            this.$router.push('/login?reback=home');
        }

        axios.get('/api/shoot/getBaziList.php')
            .then(res => {
                if (res.data.code == 200) {
                    this.shootLst = res.data.data;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
            .catch(err => {
                console.log(err);
                this.$message.error('502 服务器连接失败 [' + err.message + "]");
            });

        setTimeout(() => {
            this.fullscreenLoading = false;
        }, 1000)

    },
    methods: {
        gotoShoot() {
            this.ChooseShootSit = true;
            // this.$router.push('/shootboard?from=home');
        },
        gotoshootboard(it) {
            axios.post('/api/user/useBazi.php',
                {
                    token: Cookies.get('token'),
                    bazi_id: it.id
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success("正在进入");
                        if (it.mode == 1) {
                            this.$router.push('/shootboard?baziId=' + it.id + '&mode=' + it.mode + '&onlyVis=0&from=home');
                        } else {
                            this.$router.push('/contestboard?baziId=' + it.id + '&mode=' + it.mode + '&onlyVis=0&from=home');
                        }
                    } else {
                        this.$message.error('跳转失败 [' + res.data.msg + ']');
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message.error('502 服务器连接失败 [' + err.message + "]");
                });



        },
        gotovisboard(it) {
            this.$router.push('/visboard?baziId=' + it.id + '&mode=' + it.mode + '&onlyVis=1&from=home');
        },
        gotoallboard() {
            this.$router.push('/allboard');
        },
        gotoList() {
            this.$router.push('/examlist');
        },
        gotoPerson() {
            this.$router.push('/my');
        },
        gotoSetting() {
            this.$router.push('/setting');
        },
        gotoAdmin() {
            this.$router.push('/admin/home');
        }
    }
}
</script>

<style lang="less" scoped>
.header {
    display: flex;
    justify-content: center;
    width: 100%;
    color: #fff;
    font-size: 30px;
    margin: 15px;
    margin-top: 200px;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);

}

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
    flex-wrap: wrap;

    .menu-item {
        text-align: center;
        margin: 15px;
        width: 150px;
        height: 200px;

    }

}



.footer {
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);

}

.shootlst {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    width: 100%;

    .image {
        height: 70px;
        width: 70px;
    }

    .a {
        // display: flex;
        text-align: center;
        height: 220px;
        width: 150px;
        margin: 10px;
        margin-top: 25px;
    }

}
</style>
