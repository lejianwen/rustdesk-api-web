import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/address_book_collection/list',
    params,
  })
}

export function detail (id) {
  return request({
    url: `/address_book_collection/detail/${id}`,
  })
}

export function create (data) {
  return request({
    url: '/address_book_collection/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/address_book_collection/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/address_book_collection/delete',
    method: 'post',
    data,
  })
}

