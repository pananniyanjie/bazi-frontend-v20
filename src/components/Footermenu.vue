<template>
    <div class="footer-container">
        <div class="part">
            <span>祥源体育 版权所有 2022-2023 © All CopyRights Reserved.</span>
        </div>


    </div>
</template>

<script>
    export default {
        name: "MenuHeader"
    }
</script>

<style lang="less" scoped>
    .footer-container {
        .part {
            font-size: 14px;
            span {
                color: #ffffff;
                margin-left: 10px;
            }
        }

        background-color: #333;
        height: 60px;
        display: flex;
        justify-content: center;
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
