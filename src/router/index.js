import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/login.vue'
// import Home from '../views/home.vue'
/* 异步导入 */
const Login = () => import('../views/login.vue')
const Home = () => import('../views/home.vue')
const welcome = () => import('../views/welcome.vue')
const users = () => import('../views/users.vue')
const rights = () => import('../views/rights.vue')
const roles = () => import('../views/roles.vue')
const categories = () => import('../views/categories.vue')
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/home',
    component: Home,
    name: 'home',
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: categories }
    ]
  }
]

const router = new VueRouter({
  routes
})
/* 配置全局路由守卫 */
router.beforeEach(function(to, from, next) {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    return next()
  }
  if (token) {
    next()
  } else {
    router.push('/login')
  }
})
export default router
