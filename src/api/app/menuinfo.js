import request from '@/utils/request'

// 查询生成菜单管理列表
export function listTable (query){
    return request({
        url:"/system/sc/menu/list",
        path:"get",
        pamarms:query
    })
}

// tree
export function listMenu(){
    return request({
        url:'/system/sc/menu/tree/list',
        path:'get'
    })
}

// 新增菜单
export function addMenu(data){
    return request({
        url:'/system/sc/menu',
        path:'post',
        data:data
    })
}