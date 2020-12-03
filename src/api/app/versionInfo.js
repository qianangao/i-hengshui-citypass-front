import request from '@/utils/request'

// 查询生成版本列表
export function versionTable (query){
    return request({
        url:"/system/sys/app/version/record/listPage",
        method:"get",
        params: query
    })
}

//新增
export function addVersion(data){
    return request({
        url:'/system/sys/app/version/record/insert',
        method: 'post',
        data:data
    })
}


//   上传文件接口
export function uploadFile(data){
    return request({
        url:'/system/sys/app/version/record/upload',
        method: 'post',
        data: data
    })
}

// 删除接口
export function delVersion(id) {
    return request({
      url: '/system/sys/app/version/record/remove/' + id,
      method: 'delete'
    })
  }


//   查看接口
export function getFrom (id){
    return request({
        url:"/system/sys/app/version/record/info/" + id,
        method:"get"
    })
}

