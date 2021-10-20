import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/global.css'
import './assets/fonts/iconfont.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/"
axios.defaults.timeout = 10000
axios.interceptors.request.use((config: any) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})


const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.use(router)
app.use(VueAxios, axios)
app.use(ElementPlus)
// app.use(VueQuill)
app.mount('#app')

