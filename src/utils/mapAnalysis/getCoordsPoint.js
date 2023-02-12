import { gaode } from '@/api/base'
import GPS from '@/utils/coordTransform'

/**
 * WGS-84：是国际标准，GPS坐标（Google Earth使用、或者GPS模块）
 * GCJ-02：中国坐标偏移标准，Google Map、高德、腾讯使用
 * BD-09：百度坐标偏移标准，Baidu Map使用
 */

// 避难所
async function getCoordinate(page,city="唐山市") {
  let pointData = []
  // 获取高德地图Api中的数据
  const { data: { pois }, } = await gaode(page,city).catch(err => console.log(err))
  // console.log(pois)
  pois.forEach((item) => {
    // 将api中字符串类型的坐标转换成latlng形式: 纬度、经度
    let loactionString = item.location.split(',')
    let gps = GPS.gcj_decrypt_exact(parseFloat(loactionString[1]), parseFloat(loactionString[0]))
    console.log(gps);
    let point = L.latLng(gps)

    let datas = {
      id: item.id,
      type: item.type,
      typecode: item.typecode,
      address: item.address,
      adname: item.adname,
      cityname: item.cityname,
      name: item.name,
      pname: item.pname,
      location: point,
    }
    pointData.push(datas)
  })

  return pointData
}

export default getCoordinate
