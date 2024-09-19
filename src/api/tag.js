import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/tag/list',
    params,
  })
}

export function detail (id) {
  return request({
    url: `/tag/detail/${id}`,
  })
}

export function create (data) {
  return request({
    url: '/tag/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/tag/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/tag/delete',
    method: 'post',
    data,
  })
}

