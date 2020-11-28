import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/sys/app/dept/list',
    method: 'get',
    params: query
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/sys/app/dept/insert',
    method: 'post',
    data: data
  })
}

// 根据id查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/sys/app/dept/detail/' + deptId,
    method: 'get'
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/sys/app/dept/update',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/sys/app/dept/' + deptId,
    method: 'delete'
  })
}

// 获取部门select
export function getDeptSelect() {
  return request({
    url: '/system/sys/app/dept/deptList',
    method: 'get'
  })
}








// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}



// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}