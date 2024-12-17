import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/my/tag/list',
    params,
  })
}

export function create (data) {
  return request({
    url: '/my/tag/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/my/tag/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/my/tag/delete',
    method: 'post',
    data,
  })
}

