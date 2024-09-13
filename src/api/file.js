import request from '@/utils/request'

export function ossToken () {
  return request({
    url: '/file/oss_token',
  })
}
