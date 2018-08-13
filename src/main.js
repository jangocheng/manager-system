import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
// 引入Element-UI
import ElementUI from 'element-ui'
// 引入Element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'
// 使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false
// 将vue原型上添加 axios
Vue.prototype.axios = axios
// 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   config.baseURL = 'http://localhost:8888/api/private/v1/'
//   config.headers.Authorization = localStorage.getItem('userToken')
//   return config
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error)
// })
// 设置axios 默认值 此处有个坑: 需要将token默认配置放在登录成功后配置, 因为登录成功后才将token 存入localStorage中
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 因为token默认配置是在登录成功后设置的, 如果发生页面刷新而入口文件中又没配置会出现token获取不到的情况
axios.defaults.headers.common['Authorization'] = localStorage.getItem('userToken')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
