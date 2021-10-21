declare module 'lodash'
declare module 'element-plus/lib/locale/lang/zh-cn'
declare module '@/components/common/citydata'

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}
