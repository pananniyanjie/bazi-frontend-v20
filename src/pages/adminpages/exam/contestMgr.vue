<template>
    <div class="user-box" v-loading="fullscreenLoading" element-loading-text="拼命加载中">
        <div>
            <el-form ref="form" :model="contestInfo" label-width="80px">
                <el-form-item label="竞赛名称">
                    <el-input v-model="contestInfo.title"></el-input>
                </el-form-item>
                <el-form-item label="靶子类型">
                    <el-select v-model="contestInfo.mode" placeholder="请选择竞赛类型">
                        <el-option label="手枪比赛" value="1"></el-option>
                        <el-option label="步枪比赛" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计分精度">
                    <el-select v-model="contestInfo.point" placeholder="请选择计分精度">
                        <el-option label="整数" value="0"></el-option>
                        <el-option label="单精度" value="1"></el-option>
                        <el-option label="双精度" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间限制">

                    <el-col :span="11">
                        <el-input v-model="contestInfo.timeLimit"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">&nbsp;轮次限制</el-col>
                    <el-col :span="11">
                        <el-input v-model="contestInfo.roundLimit"></el-input>
                    </el-col>
                    <!-- <el-input v-model="contestInfo.timeLimit"></el-input> -->
                </el-form-item>
                <!-- <el-form-item label="轮次限制">
                    <el-input v-model="contestInfo.roundLimit"></el-input>
                </el-form-item> -->
                <el-form-item label="比赛靶机">
                    <el-transfer v-model="chooseList" :data="baziList" :titles="['自由靶机', '集控靶机']"
                        :button-texts="['释放控制', '集中控制']"></el-transfer>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updataContest()">更新设置</el-button>
                    <el-button @click="getContest()">重置</el-button>
                </el-form-item>
                <!-- <el-form-item label="自由开始">
                    <el-switch v-model="contestInfo.free"></el-switch>
                </el-form-item> -->
                <el-form-item label="竞赛控制" v-show="!contestInfo.free">
                    <h4>当前状态：{{ stateTitle }}</h4>
                    <el-button type="primary" @click="startPVP(3)">3S后开始</el-button>
                    <el-button type="primary" @click="startPVP(5)">5S后开始</el-button>
                    <el-button type="primary" @click="startPVP(10)">10S后开始</el-button>
                </el-form-item>

            </el-form>
        </div>

    </div>
</template>
<script>
import Cookies from "js-cookie";
import axios from "axios";
import loginVue from '@/pages/login.vue';

export default {
    name: "userlist",
    data() {
        return {
            baziList: [
                {
                    key: "1919",
                    label: "一号靶机",
                    disable: false
                },
                {
                    key: "1920",
                    label: "二号靶机",
                    disabled: false
                },
                {
                    key: "1921",
                    label: "三号靶机",
                    disable: false
                }
            ],
            chooseList: [],
            stateTitle: "预备",
            cando: {
                1: "射手",
                5: "教练",
                10: "管理",
            },
            contestInfo: {
                title: '默认竞赛',
                mode: {
                    label: "手枪比赛",
                    key: 1
                },
                point: {
                    label: "整数",
                    key: 0
                },
                timeLimit: 600,
                roundLimit: 20,
                startTime: 114514,
                free: false,

            },
            fullscreenLoading: true,
            // 遮罩层
            loading: true,
            form: {},
        };
    },
    components: {},
    created() {
        this.fullscreenLoading = true;
    },
    mounted() {
        setTimeout(() => {
            this.fullscreenLoading = false;
            this.getList();
            this.getContest();
        }, 1000);
    },
    methods: {
        loaded() {
            console.log("页面加载完毕");
        },
        reset() {
            this.form = {
                userId: null,
                deptId: null,
                userName: null,
                nickName: null,
                userType: null,
                email: null,
                phonenumber: null,
                sex: null,
                avatar: null,
                password: null,
                status: null,
                delFlag: null,
                loginIp: null,
                loginDate: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
            };
            this.resetForm("form");
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            // this.ids = selection.map(item => item.userId)
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加用户信息";
        },
        getList() {
            axios
                .get("/api/bazi/getlist.php", {
                    token: Cookies.get("token"),
                    type: 0,
                })
                .then((res) => {
                    if (res.data.code == 200) {
                        this.chooseList = [];
                        this.baziList = [];
                        for (let i = 0; i < res.data.data.length; i++) {
                            let tmp = {
                                key: res.data.data[i]["id"],
                                label: res.data.data[i]["display_id"],
                                disabled: false
                            };
                            this.baziList.push(JSON.parse(JSON.stringify(tmp)));
                            if (res.data.data[i]["mode"] == "2") {
                                //比赛靶直接加入列表
                                this.chooseList.push(JSON.parse(JSON.stringify(res.data.data[i]["id"])));
                            }
                        }
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("与射击服务器断开了连接 [" + err.message + "]");
                });
        },
        /** 新增用户 **/
        onSubmit() {
            this.form = {};
            this.title = "新增客户";
            this.open = true;
        },
        updataContest() {
            //上报比赛参数
            let config = this.contestInfo;
            let url = "/api/contest/setconfig.php?title=" + config.title + "&mode=" + config.mode + "&point=" + config.point
                + "&timeLimit=" + config.timeLimit + "&roundLimit="+config.roundLimit
            axios
                .get(url, {
                })
                .then((res) => {
                    this.getContest();
                    this.$message.success("设置更新成功")
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("保存参数失败 [" + err.message + "]");
                });
            //上报靶子类别
            let unfreelist = this.chooseList;
            axios.post('/api/bazi/changemode.php',
                    {
                        token: Cookies.get('token'),
                        contestBazi: unfreelist,
                    })
                    .then(res => {
                        if (res.data.code == 200) {
                            this.getList();
                        } else {
                            this.$message.error('获取射击记录失败 [' + err.message + "]");
                        }

                    })
                    .catch(err => {
                        console.log(err);
                        this.$message.error('与射击服务器断开了连接 [' + err.message + "]");
                    });

        },
        getContest() {
            axios
                .get("/api/contest/getconfig.php", {
                })
                .then((res) => {
                    if (res.data.code == 200) {
                        this.contestInfo.title = res.data.data["title"];
                        this.contestInfo.mode = res.data.data["mode"];
                        this.contestInfo.point = res.data.data["point"];
                        this.contestInfo.timeLimit = res.data.data["timeLimit"];
                        this.contestInfo.roundLimit = res.data.data["roundLimit"];
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("与射击服务器断开了连接 [" + err.message + "]");
                });
        },
        startPVP(it){
            let startTime = new Date().getTime() + 1000 * it;
            axios
                .post("/api/contest/setTime.php?startTime="+startTime,{
                })
                .then((res) => {
                    if (res.data.code == 200) {
                        this.$message.success("比赛将于"+it+"秒后开始，未预备的用户将不记录成绩.")
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("与射击服务器断开了连接 [" + err.message + "]");
                });
        }
    },
};
</script>

<style lang="less" scoped>
.user-box {
    width: 100%;
}
</style>
  