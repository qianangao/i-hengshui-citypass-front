import request from '@/utils/request'

// 用户数 、实名认证用户数
export function amountoFusers() {
  return request({
    url: '/system/statistics/userNum',
    method: 'get',
    // params: query
  })
}
// 访问人数访问次数
export function frequency() {
  return request({
    url: '/system/statistics/visitsNum',
    method: 'get',
    // params: query
  })
}
// 本周用户分布
export function distributionWeek() {
  return request({
    url: '/system/statistics/weekDistribution',
    method: 'get',
    // params: query
  })
}
// 办事生活
export function commonLight() {
  return request({
    url: '/system/statistics/commonLight',
    method: 'get',
    // params: query
  })
}
//用户分布
export function distribution() {
  return request({
    url: '/system/statistics/distribution',
    method: 'get',
    // params: query
  })
}