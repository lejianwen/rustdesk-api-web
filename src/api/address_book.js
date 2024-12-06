import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/address_book/list',
    params,
  })
}

export function detail (id) {
  return request({
    url: `/address_book/detail/${id}`,
  })
}

export function create (data) {
  return request({
    url: '/address_book/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/address_book/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/address_book/delete',
    method: 'post',
    data,
  })
}

export function batchCreate (data) {
  return request({
    url: '/address_book/batchCreate',
    method: 'post',
    data,
  })
}

export function shareByWebClient (data) {
  return request({
    url: '/address_book/shareByWebClient',
    method: 'post',
    data,
  })
}

export function batchCreateFromPeers (data) {
  return request({
    url: '/address_book/batchCreateFromPeers',
    method: 'post',
    data,
  })
}

export function batchUpdateTags (data) {
  return request({
    url: '/address_book/batchUpdateTags',
    method: 'post',
    data,
  })
}
