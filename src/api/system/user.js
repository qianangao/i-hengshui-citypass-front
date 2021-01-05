import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/chinaunicom";
import md5 from "md5";
import {Decrypt,Encrypt} from "@/utils/aes/security.js";
// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: {"param":Encrypt(JSON.stringify(query))}
  })
}

// 查询用户详细
export function getUser(deptId) {
  return request({
    url: '/system/role/optionselect/' + praseStrEmpty(deptId),
    method: 'get'
  })
}
// export function geetUser(userId) {
//   return request({
//     url: 'system/role/getSysRoleListByCurrentUser' + praseStrEmpty(userId),
//     method: 'get'
//   })
// }
// 修改详情用户
export function xgUser(userId) {
  return request({
    url: '/system/user/'+userId ,
    method: 'get',
    
  })
}
// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: Encrypt(JSON.stringify(data))
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: Encrypt(JSON.stringify(data))
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}
// 修改密码
export function userPasd(originalPassword, newPassword) {
  originalPassword = md5(originalPassword);
  newPassword = md5(newPassword);
  const data = { originalPassword, newPassword };
  return request({
    url: 'system/user/password',
    method: 'put',
    data: data
  })
}
// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}
