import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import ko from 'element-plus/es/locale/lang/ko'
import { router } from '@/router'
import 'normalize.css/normalize.css'
import { pinia } from '@/store'
import '@/permission'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/style.scss'
import * as ElementIcons from '@element-plus/icons'

const app = createApp(App)
app.use(ElementPlus, { locale: ko })
app.use(pinia)
app.use(router)
for (let icon in ElementIcons){
  app.component("ElIcon" +icon ,ElementIcons[icon])
}
app.mount('#app')
