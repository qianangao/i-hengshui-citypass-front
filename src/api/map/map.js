import request from '@/utils/request'

// 查询地图多边
export function mapList (){
    return request({
        url:"https://a.amap.com/Loca/static/mock/bj_district_wkt.json",
        method:"get",
    })
}