import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/global.css'
import './assets/fonts/iconfont.css'

//修改element页码区域文字默认样式
import locale from './assets/cn';
import zhLang from 'element-plus/lib/locale/lang/zh-cn'

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

//全局挂载时间处理函数
app.config.globalProperties.$dateHandle = (val: number) => {
  const dt = new Date(val);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");
  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
};
app.use(router)
app.use(VueAxios, axios)
app.use(ElementPlus, {
  locale: { ...zhLang, ...locale }, // 使用本地的 locale 去覆盖官方的 zhLang
})

app.mount('#app')

