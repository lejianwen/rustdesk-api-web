import { defineStore, acceptHMRUpdate } from 'pinia'
import logo from '@/assets/logo.png'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

export const useAppStore = defineStore({
  id: 'App',
  state: () => ({
    setting: {
      title: 'Rustdesk-Api-Admin',
      sideIsCollapse: false,
      logo,
      lang: localStorage.getItem('lang') || 'zh-CN',
      locale: localStorage.getItem('lang') === 'en' ? en : zhCn,
    },
  }),

  actions: {
    sideCollapse () {
      this.setting.sideIsCollapse = !this.setting.sideIsCollapse
    },
    setLang (lang) {
      this.setting.lang = lang
      this.setting.locale = lang === 'zh-CN' ? zhCn : en
      localStorage.setItem('lang', lang)
    },
    changeLang () {
      this.setLang(this.setting.lang === 'zh-CN' ? 'en' : 'zh-CN')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
