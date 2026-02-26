import request from '@/utils/request'

export function listUserDevices (params) {
  return request({
    url: '/user_device/list',
    params,
  })
}

export function setUserMaxDevices (data) {
  return request({
    url: '/user_device/setLimit',
    method: 'post',
    data,
  })
}

export function unbindUserDevice (data) {
  return request({
    url: '/user_device/unbind',
    method: 'post',
    data,
  })
}