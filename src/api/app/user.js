import request from '@/utils/request'
import {Decrypt,Encrypt} from "@/utils/aes/security.js";
export function appUserList(query) {
    return request({
      url: '/system/app/user/list',
      method: 'get',
      params: {"param":Encrypt(JSON.stringify(query))}
    })
}