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
