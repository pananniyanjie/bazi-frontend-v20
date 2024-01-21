<template>
    <div class="header-container">
        <div class="l-part">
            <i class="el-icon-menu"></i>
            <span>首页</span>
        </div>


        <el-dropdown class="dropdown r-part">
            <span class="el-dropdown-link ">
                <img class="person-img" src="/favicon.ico" alt="">
            </span>
                <el-dropdown-menu slot="dropdown" class="dp-text">
                    <el-dropdown-item>前台主页</el-dropdown-item>
                    <el-dropdown-item>退 出</el-dropdown-item>
                </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    export default {
        name: "MenuHeader"
    }
</script>

<style lang="less" scoped>
    .header-container {
        .l-part {
            font-size: 14px;
            span {
                color: #ffffff;
                margin-left: 10px;
            }
        }

        background-color: #333;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 20px;



        .dropdown {
            img {
                height: 40px;
                width: 40px;
                border-radius: 50%;
            }
            text-align: center;
        }


    }

    .person-img{
        border:1.5px solid #fff;

    }

</style>
