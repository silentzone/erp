import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/customs/list',
    method: 'get',
    params: query
  })
}

export function fetchCustom(id) {
  return request({
    url: '/customs/detail',
    method: 'get',
    params: { id }
  })
}

export function createCustom(data) {
  return request({
    url: '/customs/create',
    method: 'post',
    data
  })
}

export function updateCustom(data) {
  return request({
    url: '/customs/update',
    method: 'post',
    data
  })
}
