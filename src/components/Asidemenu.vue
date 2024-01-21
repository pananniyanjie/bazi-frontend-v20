<template>
    <div>
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->

        <el-menu default-active="home" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
            :unique-opened="true" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
            <div class="menu-title">

                <el-image style="width: 30px; height: 30px" src="/favicon.ico" fit="cover"></el-image>
                <h3 style="margin-left:5px">射击系统管理后台</h3>

            </div>
            <el-menu-item :index="item.name" v-for="item in noChildren" :key="item.name">
                <i :class="`el-icon-${item.icon}`"></i>
                <span slot="title">{{ item.label }}</span>
            </el-menu-item>
            <el-submenu :index="item.model" v-for="item in hasChildren" :key="item.name">
                <template slot="title">
                    <i :class="`el-icon-${item.icon}`"></i>
                    <span slot="title">{{ item.label }}</span>
                </template>
                <el-menu-item-group v-for="child in item.children" :key="child.name">
                    <el-menu-item :index="child.name">{{ child.label }}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    height: 100vh;
}

.el-menu {
    border-right: solid 0px #e6e6e6;

    h3 {
        text-align: center;
        font-size: 16px;
        color: #ffffff;
        font-weight: 400;
    }
}

.menu-title {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;

}
</style>




<script>
export default {
    name: "Asidemenu",
    data() {
        return {
            isCollapse: true,
            home: 0,
            menuData: [
                {
                    name: 'home',
                    label: '首 页',
                    icon: 's-home',
                },
                {
                    model: 'exam',
                    label: '竞赛管理',
                    icon: 's-flag',
                    children: [
                        {
                            name: 'examlist',
                            label: '竞赛列表',
                            icon: 'setting',
                        }
                    ]
                },
                {
                    model: 'user',
                    label: '客户管理',
                    icon: 's-custom',
                    children: [
                        {
                            name: 'userlist',
                            label: '客户列表',
                            icon: 'video-play',
                        },
                        {
                            name: 'userlink',
                            label: '绑定机器',
                            icon: 'video-play',
                        },
                        {
                            name: 'rulelist',
                            label: '权限组',
                            icon: 'video-play',
                        }
                    ]
                },
                {
                    model: 'bazi',
                    label: '靶机管理',
                    icon: 's-grid',
                    children: [
                        {
                            name: 'deviceslist',
                            label: '靶机管理',
                            icon: 'user',
                        }
                    ]
                },
                {
                    model: 'group',
                    label: '分组管理',
                    icon: 'place',
                    children: [
                        {
                            name: 'grouplist',
                            label: '分组列表',
                            icon: 'setting',
                        },
                        {
                            name: 'grouplink',
                            label: '分组成员',
                            icon: 'setting',
                        }
                    ]
                },
                {
                    label: '系统设置',
                    icon: 'setting',
                    children: [
                        {
                            name: 'baseset',
                            label: '常规设置',
                            icon: 'setting',
                        },
                        {
                            name: 'accesskey',
                            label: '授权激活',
                            icon: 'setting',
                        }
                    ]
                }
            ]


        };
    },
    computed: {
        //筛选没孩子的
        noChildren() {
            return this.menuData.filter(item => !item.children)
        },
        //筛选有孩子的
        hasChildren() {
            return this.menuData.filter(item => item.children)
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }

    }
}
</script>
