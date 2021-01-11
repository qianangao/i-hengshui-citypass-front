import request from '@/utils/request'
// 列表接口
export function Violationlist (query) {
    return request({
      url: '/system/app/wism/point/findWebList',
      method:"get",
      params: query

    })
  }
  // 数据清空
  export function Empty () {
    return request({
      url: '/system/app/wism/point/handleMysqlTableDate',
      method:"post",
     
    })
  }