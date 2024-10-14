import request from '@/utils/request'

export function config () {
  return request({
    url: '/server-config',
    method: 'get',
  })
}
export function appConfig () {
  return request({
    url: '/app-config',
    method: 'get',
  })
}
