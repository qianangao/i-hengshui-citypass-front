import request from '@/utils/request'

// 查询生成意见反馈列表
export function listMenu (query){
    return request({
        url:"/system/sc/propose/list",
        method:"get",
        params: query
    })
}
// 点击查看调取详情按钮
export function getFrom (id){
    return request({
        url:"/system/sc/propose/detail/" + id,
        method:"get"
    })
}

// 回复接口
export function replyMenu(id, replyContent) {
    const data = {
      id,
      replyContent
    }
    return request({
        url:"/system/sc/propose/reply" ,
        method: 'put',
        data: data
    })
  }