import { defineStore, acceptHMRUpdate } from 'pinia'
import logo from '@/assets/logo.png'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ko from 'element-plus/es/locale/lang/ko'
import ru from 'element-plus/es/locale/lang/ru'
import fr from 'element-plus/es/locale/lang/fr'
import es from 'element-plus/es/locale/lang/es'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import sk from 'element-plus/es/locale/lang/sk'
import cs from 'element-plus/es/locale/lang/cs'
import de from 'element-plus/es/locale/lang/de'
import pl from 'element-plus/es/locale/lang/pl'
import hu from 'element-plus/es/locale/lang/hu'

import { admin, app, server } from '@/api/config'

const langs = {
  'zh-CN': { name: '中文', value: zhCn, sideBarWidth: '210px' },
  en: { name: 'English', value: en, sideBarWidth: '230px' },
  fr: { name: 'Français', value: fr, sideBarWidth: '280px' },
  ko: { name: '한국어', value: ko, sideBarWidth: '230px' },
  ru: { name: 'Русский', value: ru, sideBarWidth: '250px' },
  es: { name: 'Español', value: es, sideBarWidth: '280px' },
  'zh-TW': { name: '中文繁体', value: zhTw, sideBarWidth: '210px' },
  sk: { name: 'Slovenčina', value: sk, sideBarWidth: '260px' },
  cs: { name: 'Čeština', value: cs, sideBarWidth: '260px' },
  de: { name: 'Deutsch', value: de, sideBarWidth: '260px' },
  pl: { name: 'Polski', value: pl, sideBarWidth: '260px' },
  hu: { name: 'Magyar', value: hu, sideBarWidth: '260px' },
}

// EN-only comment: Normalize browser lang like "en-US" -> "en"
const resolveDefaultLang = () => {
  const raw = localStorage.getItem('lang') || navigator.language || 'zh-CN'
  if (langs[raw]) return raw
  const short = String(raw).split('-')[0]
  if (langs[short]) return short
  return 'en'
}

const defaultLang = resolveDefaultLang()

export const useAppStore = defineStore({
  id: 'App',
  state: () => ({
    setting: {
      title: 'Rustdesk API Admin',
      hello: '',
      sideIsCollapse: false,
      logo,
      langs,
      lang: defaultLang,
      locale: langs[defaultLang] || langs.en,
      appConfig: {
        web_client: 1,
      },
      rustdeskConfig: {
        id_server: '',
        key: '',
        relay_server: '',
        api_server: '',
      },
    },
  }),

  actions: {
    sideCollapse () {
      this.setting.sideIsCollapse = !this.setting.sideIsCollapse
    },
    setLang (lang) {
      this.setting.lang = lang
      this.setting.locale = langs[lang] || langs.en
      localStorage.setItem('lang', lang)
    },
    changeLang (v) {
      this.setLang(v)
    },
    loadConfig () {
      this.getAppConfig()
      this.getAdminConfig()
      this.loadRustdeskConfig()
    },
    getAppConfig () {
      return app().then(res => {
        this.setting.appConfig = res.data
      })
    },
    getAdminConfig () {
      return admin().then(res => {
        this.replaceAdminTitle(res.data.title)
        this.setting.hello = res.data.hello
      })
    },
    replaceAdminTitle (newTitle) {
      document.title = document.title.replace(`- ${this.setting.title}`, `- ${newTitle}`)
      this.setting.title = newTitle
    },
    async loadRustdeskConfig () {
      const res = await server().catch(() => false)
      if (res) {
        this.setting.rustdeskConfig = res.data
        const prefix = 'wc-'
        localStorage.setItem(`${prefix}custom-rendezvous-server`, res.data.id_server)
        localStorage.setItem(`${prefix}key`, res.data.key)
        localStorage.setItem(`${prefix}api-server`, res.data.api_server)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
