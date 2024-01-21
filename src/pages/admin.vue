<template>
    <div class="admin-box" >
        <el-container>

            <el-aside width="200px">
                <Asidemenu></Asidemenu>
            </el-aside>
            <el-container>
                <el-header class="el-header">
                    <MenuHeader></MenuHeader>
                </el-header>
                <el-main >
                    <router-view :v-loading="fullscreenLoading" />
                </el-main>
                <el-footer class="footer">
                    <Footermenu></Footermenu>
                </el-footer>
            </el-container>
        </el-container>

    </div>
</template>

<script>

import Asidemenu from '@/components/Asidemenu.vue';
import MenuHeader from '@/components/MenuHeader.vue';
import Footermenu from '@/components/Footermenu.vue';
import { Aside } from 'element-ui';
export default {
    name: 'Shootborad',
    data() {
        return {
            fullscreenLoading: true,
        }
    },
    components: {
        Asidemenu,
        Aside,
        MenuHeader,
        Footermenu
    },
    created() {
        this.fullscreenLoading = true;

    },
    mounted() {
        setTimeout(() => {
            // this.init();
            this.fullscreenLoading = false;
        }, 1000)
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.el-header{
    padding: 0!important;
}
.footer{
    padding: 0!important;
}
</style>
