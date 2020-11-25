import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/chinaunicom";

// 查询文章列表
export function listArticle(query) {
    return request({
      url: '/system/sc/message/list',
      method: 'get',
      params: query
    })
  }

  // 查询文章详细
export function getArticle(id) {
    return request({
      url: '/system/sc/message/detail/'+id,
      method: 'get',
     
    })
  }
  
  // 新增文章
  export function addArticle(data) {
    return request({
      url: '/system/sc/message/insert',
      method: 'post',
      data: data
    })
  }
  
  // 修改用户
  export function updateArticle(data) {
    return request({
      url: '/system/user',
      method: 'put',
      data: data
    })
  }
  
  // 删除用户
  export function delArticle(userId) {
    return request({
      url: '/system/sc/message/{messageIds}' + userId,
      method: 'delete'
    })
  }
  

  
  
  // 查询文章单个信息
  // export function getUserProfile() {
  //   return request({
  //     url: '/system/user/profile',
  //     method: 'get'
  //   })
  // }
  
  // 修改文章信息
  export function updateArticleProfile(data) {
    return request({
      url: '/system/user/profile',
      method: 'put',
      data: data
    })
  }
  
  
  
//   // 用户头像上传
//   export function uploadAvatar(data) {
//     return request({
//       url: '/system/user/profile/avatar',
//       method: 'post',
//       data: data
//     })}