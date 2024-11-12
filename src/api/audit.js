import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/audit_conn/list',
    params,
  })
}

export function remove (data) {
  return request({
    url: '/audit_conn/delete',
    method: 'post',
    data,
  })
}

export function batchDelete (data) {
  return request({
    url: '/audit_conn/batchDelete',
    method: 'post',
    data,
  })
}

export function fileList (params) {
  return request({
    url: '/audit_file/list',
    params,
  })
}

export function fileRemove (data) {
  return request({
    url: '/audit_file/delete',
    method: 'post',
    data,
  })
}

export function fileBatchDelete (data) {
  return request({
    url: '/audit_file/batchDelete',
    method: 'post',
    data,
  })
}
