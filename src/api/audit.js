import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/audit_conn/list',
    params,
  })
}

export function remove (data) {
  return request({
    url: '/audit_conn/delete',
    method: 'post',
    data,
  })
}
