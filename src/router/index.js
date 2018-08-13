import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/users/users'
Vue.use(Router)

// 配置路由
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        }
      ]
    }
  ]
})
// 配置路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || localStorage.getItem('userToken')) {
    next()
  } else {
    next('/login')
  }
})

export default router
