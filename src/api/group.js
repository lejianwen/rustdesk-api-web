import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/group/list',
    params,
  })
}

export function detail (id) {
  return request({
    url: `/group/detail/${id}`,
  })
}

export function create (data) {
  return request({
    url: '/group/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/group/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/group/delete',
    method: 'post',
    data,
  })
}
