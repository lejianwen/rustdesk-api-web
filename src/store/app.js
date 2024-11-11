import { defineStore, acceptHMRUpdate } from 'pinia'
import logo from '@/assets/logo.png'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ko from 'element-plus/es/locale/lang/ko'
import ru from 'element-plus/es/locale/lang/ru'
import { admin, app } from '@/api/config'

const langs = {
  'zh-CN': { name: '中文', value: zhCn },
  'en': { name: 'English', value: en },
  'ko': { name: '한국어', value: ko },
  'ru': { name: 'русский', value: ru },
}
export const useAppStore = defineStore({
  id: 'App',
  state: () => ({
    setting: {
      title: 'Rustdesk-Api-Admin',
      hello: '',
      sideIsCollapse: false,
      logo,
      langs: langs,
      lang: localStorage.getItem('lang') || 'zh-CN',
      locale: langs[(localStorage.getItem('lang') || 'zh-CN')].value,
      appConfig: {
        web_client: 1,
      },
    },
  }),

  actions: {
    sideCollapse () {
      this.setting.sideIsCollapse = !this.setting.sideIsCollapse
    },
    setLang (lang) {
      console.log('setLang', lang)
      this.setting.lang = lang
      this.setting.locale = langs[lang].value
      localStorage.setItem('lang', lang)
    },
    changeLang (v) {
      this.setLang(v)
    },
    loadConfig(){
      this.getAppConfig()
      this.getAdminConfig()
    },
    getAppConfig () {
      console.log('getAppConfig')
      app().then(res => {
        this.setting.appConfig = res.data
      })
    },
    getAdminConfig(){
      console.log('getAdminConfig')
      admin().then(res => {
        this.setting.title = res.data.title
        this.setting.hello = res.data.hello
      })
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
