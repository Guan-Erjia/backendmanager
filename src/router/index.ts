import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
const Welcome = () => import('@/components/Welcome.vue')
const Users = () => import('@/components/Users.vue')
const Rights = () => import('@/components/Rights.vue')
const Roles = () => import('@/components/Roles.vue')
const Goods = () => import('@/components/Goods.vue')
const Categories = () => import('@/components/Categories.vue')
const Params = () => import('@/components/Params.vue')
const Add = () => import('@/components/Add.vue')
// import Add from '@/components/Add.vue'
const Orders = () => import('@/components/Orders.vue')
const Reports = () => import('@/components/Reports.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },

  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        redirect: '/welcome'
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      },


    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // console.log(tokenStr);

  if (!tokenStr) return next('/login')
  return next()
})

export default router
