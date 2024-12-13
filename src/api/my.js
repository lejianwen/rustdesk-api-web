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

export function peer_list (params) {
  return request({
    url: '/my/peer/list',
    params,
  })
}

export function address_book_batchCreateFromPeers (data) {
  return request({
    url: '/my/address_book/batchCreateFromPeers',
    method: 'post',
    data,
  })
}
