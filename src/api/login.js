import request from '@/utils/request';

export function loginOptions() {
  return request({
    url: '/login-options',
    method: 'get',
  })
}

export function oidcAuth (data) {
  return request({
    url: '/oidc/auth',
    method: 'post',
    data,
  })
}

export function oidcQuery(params){
  return request({
    url: '/oidc/auth-query',
    method: 'get',
    params,
  })
}