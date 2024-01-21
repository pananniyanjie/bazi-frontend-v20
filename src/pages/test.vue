<template>
    <div ref="shootbox" class="shootbox" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        音量：<el-input v-model="lound" placeholder="请输入内容"></el-input>
        语速：<el-input v-model="speed" placeholder="请输入内容"></el-input>
        语调：<el-input v-model="hz" placeholder="请输入内容"></el-input>
        发音人：<el-select v-model="voiceid" placeholder="请选择">
            <el-option v-for="item in voicelist" :key="item.data.name" :label="item.data.name" :value="item.id">
            </el-option>
        </el-select>
        合成内容：<el-input v-model="text" placeholder="请输入内容"></el-input>
        <el-row>
            <el-button @click="play">播放</el-button>
            <el-button @click="add">添加cookie</el-button>
            <el-button @click="get">获取cookie</el-button>
        </el-row>
        
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'Shootborad',
    data() {
        return {
            text: "欢迎使用祥源体育激光射击练习系统",
            voiceid: 0,
            lound: 1,
            speed: 1,
            hz: 1,
            voicelist:[],
            fullscreenLoading: true,
            userId: 114514,
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

    },
    mounted() {
        //重新计算页面
        // this.init();
        //添加监听器，当页面发生变化时重新计算/- 防止数据丢失，暂不开启  -/
        // window.addEventListener('resize', () => this.init());
        setTimeout(() => {
            // this.init();
            this.fullscreenLoading = false;
        }, 3000)
        this.synth = window.speechSynthesis; // 启用文本
        this.msg = new SpeechSynthesisUtterance(); // 表示一次发音请求。其中包含了将由语音服务朗读的内容，以及如何朗读它（例如：语种、音高、音量）。
        let Voices = window.speechSynthesis.getVoices();
        this.voicelist = [];
        let cnt = 0;
        for (let i = 0; i < Voices.length; i++) {
            // console.log(Voices[i].lang + Voices[i].localService);
            if (Voices[i].lang == "zh-CN" && Voices[i].localService) {
                // console.log(111);
                let tmp = {
                    id:cnt,
                    data:Voices[i]
                }
                cnt++;
                this.voicelist.push(tmp);
            }
        }
        // 语音停止
        const handleStop = (e) => {
            msg.text = e;
            msg.lang = "zh-CN";
            synth.cancel(msg); // 取消该次语音播放
        }


    },
    methods: {
        loaded() {
            // this.init();
            // this.fullscreenLoading = false;
            console.log("页面加载完毕");
        },
        add(){
            Cookies.set('username', 'WDZT', { expires: 1 }); // 设置名为 'username' 的cookie，有效期为7天
        },
        get(){
            const username = Cookies.get('username'); // 获取名为 'username' 的cookie的值
            if (username) {
                console.log(`Username: ${username}`);
            } else {
                console.log('Cookie不存在');
            }
        },
        play() {
        

            let text = this.text;
            let msg = this.msg;
            msg.voice = this.voicelist[this.voiceid].data;
            msg.text = text; // 文字内容: 测试内容
            msg.lang = "zh-CN"; // 使用的语言:中文
            msg.volume = this.lound; // 声音音量：1
            msg.rate = this.speed; // 语速：1
            msg.pitch = this.hz; // 音高：1
            this.synth.speak(msg); // 播放

           
        }

    }
}
</script>

<style lang="less">
.shootbox {
    background-color: #9a9a9a;
}
</style>
