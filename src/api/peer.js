import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/peer/list',
    params,
  })
}

export function detail (id) {
  return request({
    url: `/peer/detail/${id}`,
  })
}

export function create (data) {
  return request({
    url: '/peer/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/peer/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/peer/delete',
    method: 'post',
    data,
  })
}

export function batchRemove (data) {
  return request({
    url: '/peer/batchDelete',
    method: 'post',
    data,
  })
}

export function simpleData (data) {
  return request({
    url: '/peer/simpleData',
    method: 'post',
    data,
  })
}
