import en from '@/utils/i18n/en.json'
import zhCN from '@/utils/i18n/zh_CN.json'
import { useAppStore } from '@/store/app'
import { pinia } from '@/store'

export function T (key, params, num = 0) {
  const appStore = useAppStore(pinia)
  const lang = appStore.setting.lang
  const trans = lang === 'zh-CN' ? zhCN : en
  const tran = trans[key]
  if (!tran) {
    return key
  }
  const msg = num > 0 ? (tran.Other ? tran.Other : tran.One) : tran.One
  //msg 是这样 {name} is name
  //params 是这样 {name: 'zhangsan'}
  //替换
  return msg.replace(/{(\w+)}/g, function (match, key) {
    return params[key] || match
  })
}
