import request from '@/utils/request'

// 查询生成意见反馈列表
export function listMenu (query){
    return request({
        url:"/system/sc/feedback/list",
        method:"get",
        params: query
    })
}