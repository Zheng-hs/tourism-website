import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Register from '../components/Register.vue'
import Scenic from '../components/Scenic.vue'
import Hotel from '../components/Hotel.vue'
import Scenicdetail from '../components/Scenicdetail.vue'
import Hoteldetail from '../components/Hoteldetail.vue'
import Shopcar from '../components/Shopcar.vue'
import Order from '../components/Order.vue'
import Evaluate from '../components/Evaluate.vue'
import Orderevaluate from '../components/Orderevaluate.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/home',
  meta: {
    title: '',
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  }
},
{
  path: '/login',
  component: Login
},
{
  path: '/register',
  component: Register
},
{
  path: '/home',
  component: Home,
  redirect: './welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/scenic',
    component: Scenic
  },
  {
    path: '/hotel',
    component: Hotel
  },
  {
    path: '/scenicdetail',
    component: Scenicdetail
  },
  {
    path: '/hoteldetail',
    component: Hoteldetail
  },
  {
    path: '/shopcar',
    component: Shopcar,
    meta: {
      requiresAuth: true // 要求验证的页面,在此情况下其子页面也会被验证.
    }
  },
  {
    path: '/order',
    component: Order,
    meta: {
      requiresAuth: true // 要求验证的页面,在此情况下其子页面也会被验证.
    }
  },
  {
    path: '/evaluate',
    component: Evaluate,
    meta: {
      requiresAuth: true // 要求验证的页面,在此情况下其子页面也会被验证.
    }
  },
  {
    path: '/orderevaluate',
    component: Orderevaluate,
    meta: {
      requiresAuth: true // 要求验证的页面,在此情况下其子页面也会被验证.
    }
  }
  ]
}
]

const router = new VueRouter({
  routes
})

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
