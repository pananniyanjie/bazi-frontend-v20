import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import './assets/css/reset.css'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$http = axios
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
