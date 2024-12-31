import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/rustdesk/cmdList',
    params,
  })
}

export function create (data) {
  return request({
    url: '/rustdesk/cmdCreate',
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: '/rustdesk/cmdUpdate',
    method: 'post',
    data,
  })
}

export function remove (data) {
  return request({
    url: '/rustdesk/cmdDelete',
    method: 'post',
    data,
  })
}

export function sendCmd (data) {
  return request({
    url: '/rustdesk/sendCmd',
    method: 'post',
    data,
  })
}
