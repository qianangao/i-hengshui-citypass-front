import request from '@/utils/request'

// 查询生成菜单管理列表
export function listTable (query){
    return request({
        url:"/system/sc/menu/list",
        method:"get",
        pamarms:query
    })
}

// tree
export function listMenu(query){
    return request({
        url:'/system/sc/menu/tree/list',
        method:'get',
        params:query
    })
}

// 新增菜单
export function addMenu(data){
    return request({
        url:'/system/sc/menu',
        // path:'post',
        method: 'post',
        data:data
    })
}

// 查询菜单详细
export function getMenu(id) {
    return request({
      url: '/system/sc/menu/' + id,
      method: 'get'
    })
  }

// 修改菜单
export function updataMenu(data){
    return request({
        url:'/system/sc/menu',
        method:'put',
        data: data
    })
}

// 状态修改
export function changeMenuStatus(id, status) {
    const data = {
      id,
      status
    }
    return request({
      url:'/system/sc/menu/updateStatus',
      method: 'put',
      data: data
    })
  }

//   上传图标接口
export function uploadImg(data){
    return request({
        url:'/file/ftpUpload',
        method: 'post',
        data: data
    })
}