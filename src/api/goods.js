import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function fetchGoods(id) {
  return request({
    url: '/goods/detail',
    method: 'get',
    params: { id }
  })
}

export function createGoods(data) {
  return request({
    url: '/goods/create',
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}
