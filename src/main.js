import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/comment.css'
import axios from 'axios'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  /* 给每一次需要token的请求 设置请求头 */
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
