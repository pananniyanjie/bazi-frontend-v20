<template>
    <div class="haha">
        <div ref="lbox" class="leftbox">
            <img class="canven-img" v-bind:style="{ width: wd.kuan + 'px', height: wd.gao + 'px' }"
                :src="type == 0 ? 'shou.png' : 'bu.png'" alt="" />
            <canvas :id="'baziCanvas' + id" class="bazicanven"
                v-bind:style="{ top: 0, width: wd.kuan + 'px', height: wd.kuan + 'px' }"></canvas>
        </div>
        <p>靶号：{{ config.display_id }}</p>
        <p>射手：{{ config.nick_name }}</p>
        <p>计次：{{ allCount }} 环数：{{ allSum * 1.00 / 100.00 }}最近：{{ lastNum / 100 }}</p>
    </div>
</template>

<script>
import loginVue from '../login.vue';
export default {

    props: ['data', 'id', 'config'], // 声明接收的prop参数
    name: 'BaziCanvens',
    data() {
        return {
            fullscreenLoading: true,
            wd: {
                kuan: 250,
                gao: 250,
                fontsize: 90
            },
            type: 0,
            ctx: null,
            canvas: null,
            allSum: 0,
            lastNum: 0,
            allCount: 0,
            timer: null
        }
    },
    components: {

    },
    created() {

    },
    mounted() {
        // console.log("我是子组件-" + this.id + "，我收到了参数=》" + this.data);

        // console.log(this.data);

        this.canvas = document.querySelector('#baziCanvas' + this.id);
        this.ctx = this.canvas.getContext('2d'); //获得上下文
        // console.log(this.canvas);
        this.canvas.width = 1024; //设置标签的属性宽高
        this.canvas.height = 1024; //千万不要用 canvas.style.height
        // this.canvas.style.border = '1px solid #000';
        this.refresh();
       

    },
    methods: {
        refresh() {
            console.log(this.data);
            this.ctx.clearRect(0, 0, 1024, 1024);
            this.allSum = 0;
            this.allCount = this.data.length;
            for (let i = 0; i <this.data.length; i++) {
                // console.log("子组件" + this.id + "正在绘制点" + i);
                
                if (i != this.data.length-1) {
                    this.darwpoint(this.data[i].point_x, this.data[i].point_y, 10)
                } else {
                    this.lastNum = this.data[i].scoure;
                    this.darwlast(this.data[i].point_x, this.data[i].point_y, 10)
                }
                this.allSum = Number(this.allSum) + Number(this.data[i].scoure);
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
    },
    watch: {
        data(newdata) {
            console.log("子组件检测到数据变动");
            this.data = newdata;
            this.refresh();
        }
    }
}
</script>

<style lang="less" scoped>
.leftbox {
    display: flex;
    width: 250px;
    height: 250px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}


.bazicanven {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    // background: rgba(150, 0, 0, 0.3);
    margin-left: 0 !important;
}

.canven-img {
    box-shadow: 1px 1px 4px #a0a0a0;
}

.haha {
    p {
        margin-top: 5px;
    }
}
</style>
