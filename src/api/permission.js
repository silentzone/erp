import request from '@/utils/request'

export function getRoute(token) {
  return request({
    url: '/permission/route',
    method: 'get',
    params: { token }
  })
}

