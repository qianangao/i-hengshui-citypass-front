import request from '@/utils/request'

// 用户数 、实名认证用户数
export function hotMap() {
  return request({
    url: '/system/statistics/heatMap',
    method: 'get',
    // params: query
  })
}