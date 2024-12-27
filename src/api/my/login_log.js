import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/my/login_log/list',
    params,
  })
}

export function remove (data) {
  return request({
    url: '/my/login_log/delete',
    method: 'post',
    data,
  })
}

export function batchDelete (data) {
  return request({
    url: '/my/login_log/batchDelete',
    method: 'post',
    data,
  })
}
