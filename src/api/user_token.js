import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/user_token/list',
    params,
  })
}

export function remove (data) {
  return request({
    url: '/user_token/delete',
    method: 'post',
    data,
  })
}

export function batchRemove (data) {
  return request({
    url: '/user_token/batchDelete',
    method: 'post',
    data,
  })
}
