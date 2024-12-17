import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/my/peer/list',
    params,
  })
}
