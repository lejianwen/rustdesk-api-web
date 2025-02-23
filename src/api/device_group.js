import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/device_group/list',
    params,
  })
}

export function detail (id) {
  return request({
    url: `/device_group/detail/${id}`,
  })
}

export function create (data) {
  return request({
    url: '/device_group/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/device_group/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/device_group/delete',
    method: 'post',
    data,
  })
}
