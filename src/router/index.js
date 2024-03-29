import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../pages/Home.vue'
import Shootboard from '../pages/Shootboard.vue'
import test from '../pages/test.vue'
import login from '../pages/login.vue'
import admin from '../pages/admin.vue'
import adminHome from "../pages/adminpages/home.vue"
import userList from "../pages/adminpages/user/list.vue"
import devicesList from "../pages/adminpages/devices/list.vue"
import Visboard from "../pages/Visboard.vue"
import Allvis from "../pages/allBoard/allBoard.vue"
import Contestboard from "../pages/Contestboard.vue"
import examList from "../pages/adminpages/exam/contestMgr.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/about',
    name: 'about',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  },
  {
    path: '/shootboard',
    name: 'shootboard',
    component: Shootboard
  },
  {
    path: '/visboard',
    name: 'visboard',
    component: Visboard
  },
  {
    path: '/allboard',
    name: 'allboard',
    component: Allvis
  },
  {
    path: '/contestboard',
    name: 'contestboard',
    component: Contestboard
  },
  {
    path: '/test',
    name: 'test',
    component: test
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/home',
    component: admin,
    children:[
      {
        path: 'home',
        name: 'adminHome',
        component: adminHome
      },
      {
        path: 'userlist',
        name: 'userlist',
        component: userList
      },
      {
        path: 'deviceslist',
        name: 'deviceslist',
        component: devicesList
      },
      {
        path: 'examlist',
        name: 'examlist',
        component: examList
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
