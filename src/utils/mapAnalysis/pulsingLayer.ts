/*
 * @Author: Faith
 * @Date: 2022-08-08 21:28
 * @LastAuthor: Faith
 * @LastEditTime: 2023-03-24 16:58
 * @Description:
 */
import pulsingIcon from "./icon";

export function generateIcon(size, rate) {
  let icon;
  if (size >= 6) {
    icon = pulsingIcon({
      size: size * rate,
      color: "#F60",
      fillColor: "#ff0000"
    });
  } else if (size >= 4 && size < 6) {
    icon = pulsingIcon({
      size: size * rate,
      color: "#F60",
      fillColor: "#ff0000"
    });
  } else {
    icon = pulsingIcon({
      size: size * rate,
      color: "#F60",
      fillColor: "#efcc00"
    });
  }
  return icon;
}

let sqlLayer = null;
export default function pulsingLayer(resultLayer, map) {
  if (sqlLayer) {
    map.removeLayer(sqlLayer);
  }
  sqlLayer = L.geoJSON(resultLayer, {
    pointToLayer: (geoJsonPoint, latlng) => {
      // console.log(geoJsonPoint)
      // 震级大于等于 6

      return L.marker(latlng, {
        icon: generateIcon(geoJsonPoint.properties.CLASS, 2.5)
      }).bindPopup(
        `<p>震源: ${geoJsonPoint.properties.LOCATION}</p><p>震级: ${geoJsonPoint.properties.CLASS}</p><p>深度: ${geoJsonPoint.properties.DEPTH} 千米</p><p>发震时刻: ${geoJsonPoint.properties.QUAKEDATE}</p`
      );
    }
  });
  sqlLayer
    .on("mousemove", e => e.layer.openPopup())
    .on("mouseout", e => e.layer.closePopup())
    .on("click", e => map.flyTo(e.latlng, 8))
    .addTo(map);
  return sqlLayer;
}
