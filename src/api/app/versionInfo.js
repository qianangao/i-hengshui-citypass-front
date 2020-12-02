import request from '@/utils/request'

// 查询生成版本列表
export function versionTable (query){
    return request({
        url:"/system/sys/app/version/record/listPage",
        method:"get",
        params: query
      
    })
}

// 新增菜单
export function addVersion(data){
    return request({
        url:'/system/sys/app/version/record/upload',
        // path:'post',
        method: 'post',
        data:data
    })
}


//   上传文件接口
export function uploadFile(data){
    return request({
        url:'/system/sys/app/version/record/insert',
        method: 'post',
        data: data
    })
}