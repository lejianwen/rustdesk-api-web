import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/share_record/list',
    params,
  })
}

export function remove (data) {
  return request({
    url: '/share_record/delete',
    method: 'post',
    data,
  })
}

export function batchDelete (data) {
  return request({
    url: '/share_record/batchDelete',
    method: 'post',
    data,
  })
}
