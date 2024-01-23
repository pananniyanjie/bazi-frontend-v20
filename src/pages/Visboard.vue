<template>
  <div ref="shootbox" class="shootbox" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <div class="top"></div>
    <div id="shootboxMid" class="mid">
      <div class="headbox">
        <h3>欢迎使用{{ config.oemtitle }}激光射击练习系统 已授权 <span class="modeText">{{ sysinfo.mode == 0 ? '练习模式' : '比赛模式' }}</span>
          <span class="timeText">{{ timetitle }}</span>
        </h3>
        <h3>当前射手：{{ user.nickname }}</h3>
      </div>
      <div class="lastbox">
        <div ref="lbox" class="leftbox">
          <img ref="backImg" id="canven-img" class="canven-img"
            v-bind:style="{ width: wd.kuan + 'px', height: wd.gao + 'px' }"
            :src="sysinfo.type == 1 ? 'shou.png' : 'bu.png'" alt="" />
          <canvas id="baziCanvas" class="bazicanven"
            v-bind:style="{ top: 0, width: wd.kuan + 'px', height: wd.kuan + 'px' }"></canvas>
        </div>

        <div class="rightbox">
          <div class="topbox">
            <div id="scoreText" ref="scoreText" class="score-text">
              {{ nowscore }}
            </div>
          </div>
          <div class="midbox">
            <div class="shootList">
              <el-table :data="tableData" height="100%" width="100%" size="mini">
                <el-table-column prop="bazi_id" label="靶号">
                </el-table-column>
                <el-table-column prop="username" label="射手">
                </el-table-column>
                <el-table-column prop="id" label="轮次">
                </el-table-column>
                <el-table-column prop="scoure" label="成绩">
                </el-table-column>
                <el-table-column prop="type" label="方位">
                </el-table-column>
                <el-table-column prop="timeabs" label="间隔">
                </el-table-column>
                <el-table-column prop="allsum" label="累计">
                </el-table-column>
              </el-table>
            </div>

          </div>
          <div class="endbox">
            <div class="btnList">

              <el-button @click="btnStart" type="primary">{{ sysinfo.start == 0 ? '开始' : '结束' }}</el-button>
              <el-button @click="btnClear" type="primary">清空</el-button>
              <el-button @click="btnMode" type="primary">赛/练</el-button>
              <!--<el-button @click="test" type="primary">测试</el-button>-->
              <el-button @click="btnMenu" type="primary">菜单</el-button>
              <el-button @click="btn" type="primary">设置</el-button>

            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="end">
      <el-dialog title="菜单" :visible.sync="menuVisible" width="80%">
        <div style="margin-top:10px">
          <span>导航</span>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-s-home">首 页</el-button>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-s-data">成绩列表</el-button>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-close">退出登录</el-button>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-s-tools">系统设置</el-button>
        </div>

        <div style="margin-top:10px">
          <span>数据</span>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-upload">保存</el-button>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-download">下载</el-button>
        </div>

        <div style="margin-top:10px">
          <span>其他</span>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-paperclip">绑定分组</el-button>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-paperclip" @click="btnSwitch">切换
            手/步</el-button>
          <el-button style="margin-left:10px" type="primary" icon="el-icon-headset">反馈</el-button>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="menuVisible = false">关 闭</el-button>
        </span>
      </el-dialog>

      <el-drawer title="回合设置" :visible.sync="vis" direction="rtl" :before-close="handleClose">


        <el-form :model="config" :rules="rules" ref="ruleForm" style="width: 95%" label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="计分精度" prop="decimal">
            <el-select v-model="config.decimal" placeholder="请选择计分精度">
              <el-option label="整数" :value=0></el-option>
              <el-option label="单精度" :value=1></el-option>
              <el-option label="双精度" :value=2></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="语音播报" prop="TTSstate">
            <el-select v-model="config.TTSstate" placeholder="请选择播报方式">
              <el-option label="全部播报" :value=1></el-option>
              <el-option label="仅播报环数" :value=2></el-option>
              <el-option label="仅播报操作" :value=3></el-option>
              <el-option label="全部关闭" :value=0></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认靶纸" prop="firsttype">
            <el-select v-model="config.firsttype" placeholder="请选择靶纸">
              <el-option label="手枪靶" :value=0></el-option>
              <el-option label="步枪靶" :value=1></el-option>
              <!-- <el-option label="仅播报操作" :value=2></el-option>
              <el-option label="全部关闭" :value=3></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="默认模式" prop="firstmode">
            <el-select v-model="config.firstmode" placeholder="请选择靶纸">
              <el-option label="练习模式" :value=0></el-option>
              <el-option label="比赛模式" :value=1></el-option>
              <!-- <el-option label="仅播报操作" :value=2></el-option>
              <el-option label="全部关闭" :value=3></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="轮次" prop="round">
            <el-input v-model.number="config.round"></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-input v-model.number="config.time"></el-input>
          </el-form-item>
          <el-form-item label="播报速度" prop="TTSspeed">
            <el-input v-model.number="config.TTSspeed"></el-input>
          </el-form-item>
          <el-form-item label="播报音调" prop="TTShz">
            <el-input v-model.number="config.TTShz"></el-input>
          </el-form-item>
          <!--
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间" required>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"
                  style="width: 95%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="date2">
                <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送" prop="delivery">
            <el-switch v-model="ruleForm.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
        -->
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交修改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>

      </el-drawer>
    </div>
    <!--是否保存场次-->

  </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';
import { Buffer } from 'buffer';
export default {
  name: 'Shootborad',
  data() {
    return {
      timetitle: null,
      upnum: 0,
      ruleForm: {
        name: '',

        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        TTSstate: [
          { required: true, message: '请选择播报方式', trigger: 'blur' }
        ],
        decimal: [
          { required: true, message: '请选择小数精度', trigger: 'blur' }
        ],
        round: [
          { required: true, message: '请填写回合轮次', trigger: 'blur' },
          { type: 'number', message: '请填写整数，单位 次' }
        ],
        time: [
          { required: true, message: '请填写回合时间', trigger: 'blur' },
          { type: 'number', message: '请填写整数，单位 秒' }
        ],
        firsttype: [
          { required: true, message: '请选择默认靶纸', trigger: 'blur' }
        ],
        firstmode: [
          { required: true, message: '请选择默认模式', trigger: 'blur' }
        ],
        TTSspeed: [
          { required: true, message: '请填写播报语速', trigger: 'blur' },
          { min: 0.1, max: 10, type: 'float', message: '范围 0.1-10的小数' }
        ],
        TTShz: [
          { required: true, message: '请填写播报语调', trigger: 'blur' },
          { min: 0, max: 2, type: 'float', message: '范围 0-2的小数' }
        ]

      },
      media_biu: null,
      fullscreenLoading: true,
      user: {
        id: 114514,
        username: "wdzt",
        nickname: "扎蹄叔叔"
      },
      wd: {
        kuan: 1086,
        gao: 720,
        fontsize: 90
      },
      base: {
        kuan: 100,
        gao: 100
      },
      nowscore: "10.99环",
      listconut: null,
      config: {
        user: {},
        TTSspeed: 1.2,
        TTShz: 1.2,
        TTSvoiceid: 1,
        TTSstate: 1,
        TTSvolume: 1,
        decimal: 1,//小数精度
        time: 600,
        round: 20,
        firsttype: 0,
        firstmode: 1,
        oemtitle: "祥源体育"
      },
      tableData: [],
      sysinfo: {
        mode: 0,//比赛/练习模式
        type: 1,//步枪，手枪模式
        start: 0,
        allRound: 20,//总轮次
        allTime: 600,//总时间
        round: 0,
        startTime: 0,
        endTime: 0,
        sum: 0,


      },
      synth: null,
      msg: null,
      voicelist: null,
      Timer: null,
      dir: ["*", "↑", "↗", "→", "↘", "↓", "↙", "←", "↖"],
      timeLock: false,
      tmp: {
        id: null,
        bazi_id: null,
        username: null,
        scoure: null,
        type: null,
        timeabs: null,
        allsum: null,
        point_x: null,
        point_y: null,
        shoot_time: null
      },
      menuVisible: false,
      vis: false,
      music_mp3: null,
      canvas: null,
      ctx: null

    }
  },
  components: {

  },
  created() {
    this.fullscreenLoading = true;

  },
  async mounted() {
    //重新计算页面
    // this.init();
    //添加监听器，当页面发生变化时重新计算/- 防止数据丢失，暂不开启  -/
    setTimeout(() => {
      this.init();

      this.canvas = document.querySelector('#baziCanvas');
      this.ctx = this.canvas.getContext('2d'); //获得上下文
      // this.canvas.width = window.innerWidth * devicePixelRatio; //设置标签的属性宽高
      // this.canvas.height = window.innerWidth * devicePixelRatio; //千万不要用 canvas.style.height
      this.canvas.width = 1024; //设置标签的属性宽高
      this.canvas.height = 1024; //千万不要用 canvas.style.height

      this.canvas.style.border = '1px solid #000';

      this.fullscreenLoading = false;
    }, 3000);
    const token = Cookies.get('token');
    if (token) {
      let tmp = JSON.parse(decodeURIComponent(atob(token)));
      // console.log(tmp);
      this.config.TTSspeed = tmp.setting.TTSspeed;
      this.config.TTShz = tmp.setting.TTShz;
      this.config.TTSvoiceid = tmp.setting.TTSvoiceid;
      this.config.TTSstate = tmp.setting.TTSstate;
      this.config.TTSvolum = tmp.setting.TTSvolum;
      this.config.decimal = tmp.setting.decimal;
      this.config.time = tmp.setting.time;
      this.config.round = tmp.setting.round;
      this.config.firsttype = tmp.setting.firsttype;
      this.config.firstmode = tmp.setting.firstmode;
      this.config.oemtitle = tmp.setting.oemtitle;

    } else {
      console.log('请先登录');
      this.$message.warning("请先登录！")
      this.$router.push('/login?reback=shootboard');
    }




    window.addEventListener('resize', () => this.init());

    this.media_biu = new Audio("/assets/biu.mp3")
    this.nowscore = null;
    this.synth = window.speechSynthesis; // 启用文本
    this.msg = new SpeechSynthesisUtterance(); // 表示一次发音请求。其中包含了将由语音服务朗读的内容，以及如何朗读它（例如：语种、音高、音量）。


    this.music_mp3 = new Audio("../assets/audio/biu.mp3");
    this.sysinfo.start = 0;
    this.sysinfo.mode = 0;
    setInterval(this.ui, 1000);
    //载入用户配置
    this.sysinfo.allRound = this.config.round
    this.sysinfo.allTime = this.config.time
    this.sysinfo.mode = this.config.firstmode
    this.sysinfo.type = this.config.firsttype




    this.play("欢迎使用" + this.config.oemtitle + "激光射击练习系统", 1)
    //this.music_mp3.play();
    /*
    let Voices = await window.speechSynthesis.getVoices();
    this.voicelist = [];
    let cnt = 0;
    for (let i = 0; i < Voices.length; i++) {
      // 筛选出可以用的发音人
      if (Voices[i].lang == "zh-CN" && Voices[i].localService) {
        let tp = {
          id: cnt,
          data: Voices[i]
        }
        cnt++;
        this.voicelist.push(tp);
      }
    }
    */
  },
  methods: {
    test() {
      this.darwpoint(512, 512, 10)
    },
    Refresh() {
      this.$router.go(0);
    },
    ui() {
      this.timetitle = "233";
    },
    initgame() {
      this.sysinfo.round = 1;
      this.sysinfo.start = 0;
      this.sysinfo.sum = 0;
      this.nowscore = "";
      this.tableData = [];

    },
    init() {
      try {
        let kuan = this.$refs.shootbox.offsetWidth;
        let gao = 0;
        gao = Math.round((kuan / 16) * 9);
        if (gao > this.$refs.shootbox.offsetHeight) {
          gao = this.$refs.shootbox.offsetHeight;
          kuan = Math.round((gao / 9) * 16);
        }
        this.base.gao = gao;
        this.base.kuan = kuan;
        document.getElementById("shootboxMid").setAttribute("style", "height: " + this.base.gao + "px;width: " + this.base.kuan + "px;");

        this.wd.kuan = Math.min(this.$refs.lbox.offsetHeight, this.$refs.lbox.offsetWidth) - 15;
        this.wd.gao = this.wd.kuan;
        this.wd.fontsize = Math.round(this.$refs.scoreText.offsetHeight * 0.8);
        document.getElementById("scoreText").style.fontSize = this.wd.fontsize + "px";
      } catch {
        // 处理所有异常的代码
      }

    },
    darwpoint(x, y, r) {
      let ctx = this.ctx;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = "pink";
      ctx.fill();
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 10;
      ctx.stroke();
    },
    darwlast(x, y, r) {
      let ctx = this.ctx;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 10;
      ctx.stroke();

    },
    gameon() {
      this.sysinfo.round = 1;
      this.sysinfo.start = 1;
      this.sysinfo.sum = 0.00;
      this.sysinfo.startTime = new Date().getTime();
      this.nowscore = null;
      this.sysinfo.endTime = this.sysinfo.startTime + this.sysinfo.allTime * 60000;
      this.timer = setInterval(this.getnew, 300);

      if (this.sysinfo.mode == 0) {
        //练习
        this.play("练习开始", 1);
      } else {
        //比赛
        this.play("比赛预备", 1);
      }
    },
    gameoff() {
      clearInterval(this.timer);
      this.sysinfo.start = 0;
      if (this.tableData.length != 0) this.nowscore = this.tableData[0].allsum;
      if (this.sysinfo.mode == 0) {
        //练习
        this.play("练习结束", 1);
      } else {
        //比赛
        this.play("比赛结束", 1);
      }


    },
    btnStart() {
      if (this.sysinfo.start == 0) {
        this.gameon();
      } else {
        this.gameoff();

      }
    },
    btnClear() {
      if (!(this.sysinfo.start != 0) || this.sysinfo.mode == 0) {
        this.$confirm('此操作将永久删除这些射击记录, 是否继续?', '二次确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData = [];
          this.sysinfo.round = 1;
          this.sysinfo.sum = 0;
          this.scoreText = "";
          this.nowscore = ""
          this.reshBoard();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });



        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        this.$message.warning("必须结束比赛之后才能清空！");
      }
    },
    getnew() {
      //轮询，并发现新的射击记录
      var that = this;
      if (this.timeLock) {
        console.log("遇到锁，退出。");
        return;
      } else {
        console.log("正常请求" + this.sysinfo.mode + " " + this.sysinfo.start);
        this.timeLock = true;
        axios.post('/api/shoot/getlist.php',
          {
            token: Cookies.get('token'),
            baziId: this.$route.query.baziId,
            startime: this.sysinfo.startTime,
            endtime: this.sysinfo.endTime,
            type: 1
          })
          .then(res => {

            if (res.data.code == 200) {
              //分模式

              if (this.sysinfo.mode == 0) {
                //练习模式
                if (this.sysinfo.start == 0) {
                  this.timeLock = false;
                } else {
                  if (res.data.data.length != this.upnum) {
                    this.upnum =res.data.data.length;
                    this.tableData = []
                    this.sysinfo.round = 1;
                    this.playbiu();
                    for (let i = 0; i < res.data.data.length; i++) {
                      //计算轮次
                      let tmp = this.tmp;
                      tmp.id = this.sysinfo.round;
                      this.sysinfo.round = this.sysinfo.round + 1;
                      //显示靶号，射击人，保存坐标
                      tmp.bazi_id = res.data.data[i].bazi_id;
                      tmp.username = this.user.nickname;
                      tmp.point_x = res.data.data[i].point_x;
                      tmp.point_y = res.data.data[i].point_y;
                      tmp.shoot_time = res.data.data[i].shoot_time;
                      //计算成绩
                      let num = this.getrealnum(res.data.data[i].scoure)
                      tmp.scoure = this.numTotext(num)

                      if (i == res.data.data.length - 1) {
                        //如果成绩是0显示脱靶但是不改内部
                        if (tmp.scoure == 0) {
                          this.nowscore = "脱靶";
                          //报靶
                          this.play(this.nowscore, 2);
                        } else {
                          this.nowscore = tmp.scoure;
                          //报靶
                          this.play(this.nowscore + "环", 2);
                        }
                      }

                      //显示方位，计算时间差
                      tmp.type = this.dir[Number(res.data.data[i].type)];
                      let timeab = 0.00;
                      if (this.tableData.length != 0) {
                        timeab = res.data.data[i].shoot_time - this.tableData[0].shoot_time;
                        timeab = timeab / 1000;
                        timeab = timeab.toFixed(2)
                      } else {
                        timeab = 0.00;
                      }
                      tmp.timeabs = timeab
                      //累计成绩
                      this.sysinfo.sum += Number(num);
                      tmp.allsum = this.numTotext(this.sysinfo.sum);
                      //插入队首
                      this.tableData.unshift(JSON.parse(JSON.stringify(tmp)));



                      if (this.sysinfo.round > 999) {
                        this.gameoff();
                        break;
                      }
                    }
                  }


                  this.timeLock = false;
                }

              } else {
                //比赛模式
                //没开始的所有信号都不算
                //过滤中间态
                if (this.sysinfo.start == 0 || this.sysinfo.start == 2) {
                  this.timeLock = false;
                } else {
                  //表示预备/正式开始
                  for (let i = 0; i < res.data.data.length; i++) {

                    //第一枪要作为信号枪过滤。
                    if (this.sysinfo.start == 1) {
                      this.sysinfo.start = 2;
                      this.play("3", 1);

                      setTimeout(function () {
                        that.play("2", 1);
                      }, 1000);
                      setTimeout(function () {
                        that.play("1", 1);
                      }, 2000);
                      setTimeout(function () {
                        that.play("比赛开始", 1);
                        that.sysinfo.start = 3;
                      }, 4000);

                      break;
                    }
                    //正式开始
                    if (this.sysinfo.start == 3) {
                      //计算轮次
                      let tmp = this.tmp;
                      tmp.id = this.sysinfo.round;
                      this.sysinfo.round = this.sysinfo.round + 1;
                      //显示靶号，射击人，保存坐标
                      tmp.bazi_id = res.data.data[i].bazi_id;
                      tmp.username = this.user.nickname;
                      tmp.point_x = res.data.data[i].point_x;
                      tmp.point_y = res.data.data[i].point_y;
                      tmp.shoot_time = res.data.data[i].shoot_time;
                      //计算成绩
                      let num = this.getrealnum(res.data.data[i].scoure)
                      tmp.scoure = this.numTotext(num)

                      //如果成绩是0显示脱靶但是不改内部
                      if (tmp.scoure == 0) {
                        this.nowscore = "脱靶";
                        //报靶
                        this.play(this.nowscore, 2);
                      } else {
                        this.nowscore = tmp.scoure;
                        //报靶
                        this.play(this.nowscore + "环", 2);
                      }

                      //显示方位，计算时间差
                      tmp.type = this.dir[Number(res.data.data[i].type)];
                      let timeab = 0.00;
                      if (this.tableData.length != 0) {
                        timeab = res.data.data[i].shoot_time - this.tableData[0].shoot_time;
                        timeab = timeab / 1000;
                        timeab = timeab.toFixed(2)
                      } else {
                        timeab = 0.00;
                      }
                      tmp.timeabs = timeab
                      //累计成绩
                      this.sysinfo.sum += Number(num);
                      tmp.allsum = this.numTotext(this.sysinfo.sum);
                      //插入队首
                      this.tableData.unshift(JSON.parse(JSON.stringify(tmp)));
                      this.playbiu();

                      if (this.sysinfo.round > this.sysinfo.allRound) {
                        this.gameoff();
                        return;
                      }
                    }
                  }
                  this.timeLock = false;
                }

              }
            } else {
              this.$message.error(res.data.msg);
              this.timeLock = false;
            }
          })
          .catch(err => {
            console.log(err);
            this.timeLock = false;
            this.$message.error('与射击服务器断开了连接 [' + err.message + "]");
            this.gameoff();
          });
        this.reshBoard();
      }



    },
    reshBoard() {
      this.ctx.clearRect(0, 0, 1024, 1024);
      for (let i = this.tableData.length - 1; i >= 0; i--) {
        if (i == 0) {
          this.darwlast(this.tableData[i].point_x, this.tableData[i].point_y, 10);
        } else {
          this.darwpoint(this.tableData[i].point_x, this.tableData[i].point_y, 10);
        }

      }
    },
    getrealnum(raw) {
      let res
      if (this.config.decimal == 1) {
        //单精度
        res = Math.trunc(raw / 10)
        res *= 10;
      } else if (this.config.decimal == 2) {
        //双精度
        res = raw
      } else {
        //取整
        res = Math.trunc(raw / 100) * 100
      }
      return res;
    },
    numTotext(raw) {
      let res

      if (this.config.decimal == 1) {
        //单精度
        res = raw / 100;
        res = Number(res).toFixed(1)
      } else if (this.config.decimal == 2) {
        //双精度
        res = raw / 100;
        res = Number(res).toFixed(0)
      } else {
        //取整
        res = Math.trunc(raw / 100)
      }
      //console.log("原来数字"+raw+"精度格式化后"+res);
      return res;
    },
    btnSwitch() {
      if (!(this.sysinfo.start != 0)) {
        this.$confirm('此操作将删除还未保存的射击记录并重新加载页面, 是否继续?', '二次确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          if (this.sysinfo.type == 1) {
            //步枪换手枪
            this.sysinfo.type = 0;
          } else {
            //手枪换步枪
            this.sysinfo.type = 1;


          }
          this.$message({
            type: 'success',
            message: '更换成功!'
          });
          this.initgame();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        this.$message.warning("如您想要切换靶纸，请先结束比赛！");
      }

    },
    btnMenu() {
      this.menuVisible = true;
    },
    play(text, type) {
      if (type == 1) {
        //提示音
        if (this.config.TTSstate == 3 || this.config.TTSstate == 0) return;
      }
      if (type == 2) {
        //报靶
        if (this.config.TTSstate == 2 || this.config.TTSstate == 0) return;
      }
      let msg = this.msg;
      //msg.voice = this.voicelist[this.config..TTSvoiceid].data;
      msg.text = text; // 文字内容: 测试内容
      msg.lang = "zh-CN"; // 使用的语言:中文
      msg.volume = this.config.TTSvolume; // 声音音量：1
      msg.rate = this.config.TTSspeed // 语速：1
      msg.pitch = this.config.TTShz; // 音高：1
      this.synth.speak(msg); // 播放
    },
    btn() {
      //this.media_biu.play();
      this.vis = true;
    },
    btnMode() {
      if (this.sysinfo.mode == 1) {
        this.sysinfo.mode = 0;
        this.play("练习模式", 1);

      } else {
        this.sysinfo.mode = 1;
        this.play("比赛模式", 1);

      }

    },
    playbiu() {
      const that = this
      //重新播放

      this.music_mp3.pause();
      this.music_mp3.currentTime = 0;
      setTimeout(() => {
        that.music_mp3.play()
      }, 10)

    },
    handleClose(done) {
      this.$confirm('确认关闭？关闭后刷新后将不会保存您做的更改')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    submitForm(formName) {
      const that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let tmp = JSON.parse(decodeURIComponent(atob(Cookies.get("token"))));
          tmp.setting = this.config;
          console.log(JSON.stringify(tmp));
          let jsonBuffer = Buffer.from(JSON.stringify(tmp));
          let base64Buffer = jsonBuffer.toString('base64');


          Cookies.set("token", base64Buffer);
          console.log(base64Buffer);
          let tm = tmp.setting;
          jsonBuffer = Buffer.from(JSON.stringify(tm));
          base64Buffer = jsonBuffer.toString('base64');
          axios.post('/api/user/setuserconfig.php',
            {
              token: Cookies.get('token'),
              config: base64Buffer
            }).then(res => {
              if (res.data.code == 200) {
                this.$message.success("更新成功，正在刷新页面");
              } else {
                this.$message.error('保存配置失败 [' + res.data.msg + ']');
              }
            })
            .catch(err => {
              console.log(err);
              this.$message.error('502 服务器连接失败 [' + err.message + "]");
            });

          // that.$router.go("/");
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }

  }

}

</script>

<style lang="less">
.shootbox {

  // background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .top {
    width: 100vw;
  }

  .mid {
    // background-color: #00ff00;
    display: flex;
    flex-direction: column;

    overflow: hidden;

    .headbox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: yellow;
      height: 9%;

      .modeText {
        color: chocolate,
      }

      .timeText {
        color: #fff;
      }
    }

    .lastbox {
      display: flex;
      // overflow: hidden;
      height: 90%;

      .leftbox {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        position: relative;

      }

      .rightbox {
        width: 50%;
      }
    }
  }

  .end {
    width: 100%;
  }
}

.rightbox {
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .topbox {
    display: flex;
    flex-direction: column;
    background-color: #000;
    width: 99%;
    height: 17%;
    margin-right: 15px;
    justify-content: center;
    text-align: center;

    // align-items: center;
    .score-text {
      color: #00ff00;
      height: 100%;
    }
  }

  .midbox {
    margin-top: 10px;
    height: 70%;
    display: flex;
    width: 99%;

    .shootList {
      width: 100%;
      height: 100%;
    }
  }

  .endbox {
    margin-top: 10px;
    height: 8%;
    // background-color: aqua;
    width: 99%;
    display: flex;

    .btnList {
      margin-left: 10px;
      margin-right: 10px;
      width: 100%;
      display: flex;
      justify-content: space-between;

      button {
        width: 15%;
      }
    }
  }

}



.bazicanven {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  // background: rgba(150, 0, 0, 0.3);
  margin-left: 8px;
}

.canven-img {
  // margin: 15px;

  width: 100%;

  box-shadow: 1px 1px 4px #a0a0a0;
}
</style>
