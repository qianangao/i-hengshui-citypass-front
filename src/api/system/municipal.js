import request from '@/utils/request'
// 保存
export function save (data) {
    return request({
      url: '/system/app/engineer/insert',
      method:"post",
      data: data

    })
  }
// 列表接口
export function munlist (query) {
    return request({
      url: '/system/app/engineer/list',
      method:"get",
      params: query

    })
  }
//   详情
// 列表接口
export function munxq (id) {
    return request({
      url: `/system/app/engineer/detail/${id}`,
      method:"get",
    })
  }
  // 数据清空
  export function Empty () {
    return request({
      url: '/system/app/wism/point/handleMysqlTableDate',
      method:"post",
     
    })
  }