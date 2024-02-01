<template>
    <div class="root" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        <el-container>
            <el-header style="padding:0;">
                <div class="contralBar">
                    <el-button type="text" disabled>靶位选择</el-button>
                    <el-select style="margin:15px" v-model="chooseBazi" placeholder="请选择预览靶子" multiple collapse-tags>
                        <el-option v-for="item in options" :key="item.id" :label="item.display_id" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" style="margin:15px" @click="refish()">刷新</el-button>
                    <el-button type="primary" style="margin:15px" @click="reback()">返回</el-button>
                </div>
            </el-header>
            <el-main>
                <div class="bazibox">
                    <div v-for="it in lst" :key="it.data" class="a">
                        <BaziCanvens :data="it.data" :id="it.id" :config="it"></BaziCanvens>
                        <!-- <p>靶号：{{ it.display_id }}</p>
                        <p>射手：{{ it.nick_name }}</p>
                        <p>计次：15 环数：999.99 最近：10.99</p> -->
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';
import BaziCanvens from './baziCanvens.vue'
export default {
    name: 'AllCanvens',
    data() {
        return {
            fullscreenLoading: true,
            lst: [],
            options: [],
            chooseBazi: [],
            timer: null,
            timeLock: false,
            sysinfo: {
                startTime: 0,
                endTime: 0,
            }
        }
    },
    components: {
        BaziCanvens: BaziCanvens
    },
    created() {
        this.fullscreenLoading = true;
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    mounted() {

        setTimeout(() => {
            // this.init();
            this.fullscreenLoading = false;
        }, 100)
        this.getBaziList();
        this.chooseBazi = this.$route.query.lst
        this.sysinfo.startTime = new Date().getTime();
        // this.sysinfo.startTime = 0;
        this.refish();
        this.timer = setInterval(() => {
            //需要定时执行的代码，这个3000代表的是毫秒。
            this.getnew();
            // console.log("定时器执行成功");
        }, 500);




    },
    methods: {
        loaded() {
            console.log("页面加载完毕");
        },
        getBaziList() {
            axios.get('/api/shoot/getBaziList.php')
                .then(res => {
                    if (res.data.code == 200) {
                        this.options = res.data.data;
                        // console.log(this.options);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message.error('502 服务器连接失败 [' + err.message + "]");
                });
        },
        refish() {
            // console.log(this.chooseBazi);
            // 获取选中的靶子的信息
            axios.post('/api/shoot/getBaziInfo.php',
                {
                    token: Cookies.get('token'),
                    lst: this.chooseBazi
                }).then(res => {
                    if (res.data.code == 200) {
                        // this.$message.success("更新成功");
                        console.log("获取到靶子列表");
                        this.lst = res.data.data;
                        // console.log(res.data.data);
                        for (let i = 0; i < this.lst.length; i++) {
                            this.lst[i].data = [];
                        }
                        // console.log(this.lst);
                    } else {
                        this.$message.error('获取详细信息失败 [' + res.data.msg + ']');
                        console.log(res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message.error('502 服务器连接失败 [' + err.message + "]");
                });
        },
        getnew() {
            if (this.timeLock == true) {
                //遇到锁退出
            } else {
                this.timeLock = true
                this.sysinfo.endTime = new Date().getTime();
                axios.post('/api/shoot/getlists.php',
                    {
                        token: Cookies.get('token'),
                        baziId: this.chooseBazi,
                        startime: this.sysinfo.startTime,
                        endtime: this.sysinfo.endTime,
                        type: 0
                    })
                    .then(res => {
                        if (res.data.code == 200) {
                            // console.log(res.data.data);
                            for (let i = 0; i < this.lst.length; i++) {
                                //填充对应靶子射击记录

                                this.lst[i].data = res.data.data[this.lst[i].id];
                                // console.log("靶子号"+this.lst[i].id+"=》"+res.data.data[this.lst[i].id].length);
                            }
                            // console.log(this.lst);
                        } else {
                            this.$message.error('获取射击记录失败 [' + err.message + "]");
                        }


                    })
                    .catch(err => {
                        console.log(err);
                        this.timeLock = false;
                        this.$message.error('与射击服务器断开了连接 [' + err.message + "]");
                        this.gameoff();
                    });
                this.timeLock = false;
            }
            this.$forceUpdate();
        },
        reback() {
            this.$router.go(-1);

        }

    }
}
</script>

<style lang="less" scoped>
.root {
    background-color: #F3F4F7;
}

.contralBar {
    background-color: #fff;
    color: #333;
    text-align: center;
    width: 100%;


}


.bazibox {
    display: flex;
    width: 100%;
    color: #333;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    text-align: center;

    .a {
        margin-top: 15px;
    }

    p {
        margin-top: 5px;
    }
}
</style>
