import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/my/address_book/list',
    params,
  })
}

export function batchCreateFromPeers (data) {
  return request({
    url: '/my/address_book/batchCreateFromPeers',
    method: 'post',
    data,
  })
}

export function batchUpdateTags (data) {
  return request({
    url: '/my/address_book/batchUpdateTags',
    method: 'post',
    data,
  })
}

export function create (data) {
  return request({
    url: '/my/address_book/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/my/address_book/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/my/address_book/delete',
    method: 'post',
    data,
  })
}
