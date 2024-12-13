import request from '@/utils/request'

export function share_record_list (params) {
  return request({
    url: '/my/share_record/list',
    params,
  })
}

export function share_record_remove (data) {
  return request({
    url: '/my/share_record/delete',
    method: 'post',
    data,
  })
}

export function share_record_batchDelete (data) {
  return request({
    url: '/my/share_record/batchDelete',
    method: 'post',
    data,
  })
}
