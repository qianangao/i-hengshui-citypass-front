import request from '@/utils/request'

export function appUserList(query) {
    return request({
      url: '/system/app/user/list',
      method: 'get',
      params: query
    })
}