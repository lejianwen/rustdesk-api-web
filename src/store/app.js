import { defineStore, acceptHMRUpdate } from 'pinia'
import logo from '@/assets/logo.png'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ko from 'element-plus/es/locale/lang/ko'
import ru from 'element-plus/es/locale/lang/ru'
import fr from 'element-plus/es/locale/lang/fr'
import es from 'element-plus/es/locale/lang/es'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import { admin, app } from '@/api/config'

const langs = {
  'zh-CN': { name: '中文', value: zhCn, sideBarWidth: '210px' },
  'en': { name: 'English', value: en, sideBarWidth: '230px' },
  'fr': { name: 'Français', value: fr, sideBarWidth: '280px' },
  'ko': { name: '한국어', value: ko, sideBarWidth: '230px' },
  'ru': { name: 'русский', value: ru, sideBarWidth: '250px' },
  'es': { name: 'español', value: es, sideBarWidth: '280px' },
  'zh-TW': { name: '中文繁体', value: zhTw, sideBarWidth: '210px' },
}
const defaultLang = localStorage.getItem('lang') || navigator.language || 'zh-CN'
export const useAppStore = defineStore({
  id: 'App',
  state: () => ({
    setting: {
      title: 'Rustdesk API Admin',
      hello: '',
      sideIsCollapse: false,
      logo,
      langs: langs,
      lang: defaultLang,
      locale: langs[defaultLang] ? langs[defaultLang] : langs['en'],
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
      this.setting.locale = langs[lang]
      localStorage.setItem('lang', lang)
    },
    changeLang (v) {
      this.setLang(v)
    },
    loadConfig () {
      this.getAppConfig()
      this.getAdminConfig()
    },
    getAppConfig () {
      console.log('getAppConfig')
      return app().then(res => {
        this.setting.appConfig = res.data
      })
    },
    getAdminConfig () {
      console.log('getAdminConfig')
      return admin().then(res => {
        this.replaceAdminTitle(res.data.title)
        this.setting.hello = res.data.hello
      })
    },
    replaceAdminTitle(newTitle){
      document.title = document.title.replace(`- ${this.setting.title}`, `- ${newTitle}`)
      this.setting.title = newTitle
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
