import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 导入NProgress 包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://1.15.186.9:8082/'
// 在request拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) { // 哪些需要验证
    if (!sessionStorage.getItem('token')) { // token存在条件
    //  this.$message.info('请先登录')
      alert('请先登录')
      next({
        path: '/login', // 验证失败要跳转的页面
        query: {
          redirect: to.fullPath // 要传的参数
        }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
