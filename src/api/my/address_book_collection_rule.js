import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/my/address_book_collection_rule/list',
    params,
  })
}

export function create (data) {
  return request({
    url: '/my/address_book_collection_rule/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/my/address_book_collection_rule/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/my/address_book_collection_rule/delete',
    method: 'post',
    data,
  })
}

export function batchCreate (data) {
  return request({
    url: '/my/address_book_collection_rule/batchCreate',
    method: 'post',
    data,
  })
}
