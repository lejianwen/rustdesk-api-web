import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/login_log/list',
    params,
  })
}

export function remove (data) {
  return request({
    url: '/login_log/delete',
    method: 'post',
    data,
  })
}

export function batchDelete (data) {
  return request({
    url: '/login_log/batchDelete',
    method: 'post',
    data,
  })
}
