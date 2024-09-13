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

export function changePwd (data) {
  return request({
    url: '/address_book/changePwd',
    method: 'post',
    data,
  })
}
