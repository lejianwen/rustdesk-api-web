import request from '@/utils/request'

export function config () {
  return request({
    url: '/server-config',
    method: 'get',
  })
}
