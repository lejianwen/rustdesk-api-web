import { T } from '@/utils/i18n'

export function timeAgo (time) {
  let now = new Date().getTime()
  let after = new Date(time).getTime()
  let dis = now - after
  if (dis < 60 * 1000) {
    return T('JustNow')
  } else if (dis < 60 * 60 * 1000) {
    const num = Math.floor(dis / (60 * 1000))
    return T('MinutesAgo', { param: num }, num)
  } else if (dis < 24 * 60 * 60 * 1000) {
    const num = Math.floor(dis / (60 * 60 * 1000))
    return T('HoursAgo', { param: num }, num)
  } else if (dis < 30 * 24 * 60 * 60 * 1000) {
    const num = Math.floor(dis / (24 * 60 * 60 * 1000))
    return T('DaysAgo', { param: num }, num)
  } else if (dis < 12 * 30 * 24 * 60 * 60 * 1000) {
    const num = Math.floor(dis / (30 * 24 * 60 * 60 * 1000))
    return T('MonthsAgo', { param: num }, num)
  } else {
    const num = Math.floor(dis / (12 * 30 * 24 * 60 * 60 * 1000))
    return T('YearsAgo', { param: num }, num)
  }
}

export function formatTime (unix, format = 'yyyy-MM-dd hh:mm:ss') {
  let date = new Date(unix)
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}
