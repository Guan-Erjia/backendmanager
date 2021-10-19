import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/components/Login.vue'
import Home from "@/components/Home.vue"
import Welcome from "@/components/Welcome.vue"
import Users from "@/components/Users.vue"
import Rights from "@/components/Rights.vue"
import Roles from "@/components/Roles.vue"
import Goods from "@/components/Goods.vue"
import Categories from "@/components/Categories.vue"
import Params from "@/components/Params.vue"
import Add from "@/components/Add.vue"
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
      }

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
  console.log(tokenStr);

  if (!tokenStr) return next('/login')
  return next()
})

export default router
