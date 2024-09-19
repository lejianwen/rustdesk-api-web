import request from '@/utils/request'

export function info (params) {
  return request({
    url: '/oauth/info',
    params,
  })

}

export function confirm (data) {
  return request({
    url: '/oauth/confirm',
    method: 'post',
    data,
  })
}

export function bind (data) {
  return request({
    url: '/oauth/bind',
    method: 'post',
    data,
  })
}

export function bindConfirm (data) {
  return request({
    url: '/oauth/bindConfirm',
    method: 'post',
    data,
  })
}
export function unbind (data) {
  return request({
    url: '/oauth/unbind',
    method: 'post',
    data,
  })
}
export function list (params) {
  return request({
    url: '/oauth/list',
    params,
  })
}

export function detail (id) {
  return request({
    url: `/oauth/detail/${id}`,
  })
}

export function create (data) {
  return request({
    url: '/oauth/create',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/oauth/update',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/oauth/delete',
    method: 'post',
    data,
  })
}
