/*
 * @Author: Faith
 * @Date: 2022-08-08 21:28
 * @LastAuthor: Faith
 * @LastEditTime: 2022-08-08 21:37
 * @Description:
 */
import { pulsingIcon } from "@/utils/icon.js"

let sqlLayer = null
export default function pulsingLayer(resultLayer, map) {
  if (sqlLayer) {
    map.removeLayer(sqlLayer)
  }
  sqlLayer = L.geoJSON(resultLayer, {
    pointToLayer: (geoJsonPoint, latlng) => {
      // console.log(geoJsonPoint)
      // 震级大于等于 6
      if (geoJsonPoint.properties.CLASS >= 6) {
        return L.marker(latlng, {
          icon: pulsingIcon(geoJsonPoint.properties.CLASS * 2.5, "#F60", "#ff0000"),
        }).bindPopup(
          `<p>震源: ${geoJsonPoint.properties.LOCATION}</p><p>震级: ${geoJsonPoint.properties.CLASS}</p><p>深度: ${geoJsonPoint.properties.DEPTH} 千米</p><p>发震时刻: ${geoJsonPoint.properties.QUAKEDATE}</p`
        )
      }
      return L.marker(latlng, {
        icon: pulsingIcon(geoJsonPoint.properties.CLASS * 2.5, "#F60", "#efcc00", false),
      }).bindPopup(
        `<p>震源: ${geoJsonPoint.properties.LOCATION}</p><p>震级: ${geoJsonPoint.properties.CLASS}</p><p>深度: ${geoJsonPoint.properties.DEPTH} 千米</p><p>发震时刻: ${geoJsonPoint.properties.QUAKEDATE}</p`
      )
    },
  })
  sqlLayer
    .on("mousemove", e => e.layer.openPopup())
    .on("mouseout", e => e.layer.closePopup())
    .on("click", e => map.flyTo(e.latlng, 8))
    .addTo(map)
  return sqlLayer
}
