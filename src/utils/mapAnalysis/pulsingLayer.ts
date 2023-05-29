/*
 * @Author: Faith
 * @Date: 2022-08-08 21:28
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-16 15:41
 * @Description:
 */

import pulsingIcon, { type PulsingIconProps } from "./icon";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    h: "24 hour",
    d: "7 day",
    M: "1 month"
  }
});
dayjs.extend(relativeTime);
// interface IcustomIcon extends PulsingIconProps {
//   size: number;
//   rate: any;
// }

export function generateIcon(size: number, rate: any, time: any, ...args: any) {
  let icon;
  const date1 = dayjs(Date.now());
  const formNow = date1.diff(time, "d");
  // console.log(formNow);
  if (formNow <= 1) {
    icon = pulsingIcon({
      ...args,
      animate: true,
      size: size * rate,
      color: "#F60",
      fillColor: "#ff0000"
    });
  } else if (formNow > 1 && formNow <= 7) {
    icon = pulsingIcon({
      ...args,
      size: size * rate,
      color: "#F60",
      fillColor: "#eea42a"
    });
  } else if (formNow > 7 && formNow <= 31) {
    icon = pulsingIcon({
      ...args,
      size: size * rate,
      color: "#F60",
      fillColor: "#e8da2a"
    });
  } else {
    icon = pulsingIcon({
      ...args,
      size: size * rate,
      color: "#F60",
      fillColor: "#efcc00"
    });
  }
  return icon;
}

export default function pulsingLayer(resultLayer, map) {
  let sqlLayer = null;
  if (sqlLayer) {
    map.removeLayer(sqlLayer);
  }
  return (function () {
    sqlLayer = L.geoJSON(resultLayer, {
      pointToLayer: (geoJsonPoint, latlng) => {
        // console.log(geoJsonPoint)
        // 震级大于等于 6

        return L.marker(latlng, {
          title: geoJsonPoint.properties.LOCATION,
          icon: generateIcon(
            geoJsonPoint.properties.CLASS,
            2.5,
            geoJsonPoint.properties.QUAKEDATE
          )
        }).bindPopup(popupPanel(geoJsonPoint));
      }
    }).addTo(map);

    // layerEvent(sqlLayer, map).addTo(map);
    return sqlLayer;
  })();
}
export function popupPanel(obj) {
  return `
    <div class="popupPanel">
      <div class="content">
      <p>震源: ${obj.properties.LOCATION}</p>
      <p>震级: ${obj.properties.CLASS}</p>
      <p>深度: ${obj.properties.DEPTH} 千米</p>
      <p>发震时刻: ${obj.properties.QUAKEDATE}</p
      </div>
      <div class="detail"><button>详细信息</button></div>
    </div>
  `;
}

function layerEvent(layer, mapObject) {
  return layer
    .on("mousemove", e => {
      // e.layer.openPopup();
    })
    .on("click", e => {
      e.layer.openPopup();
      let { lat, lng } = e.latlng;
      const title = e.layer.options.title;
      const id = L.Util.stamp(e.layer).toString();
      const dom: HTMLDivElement = document.querySelector(".popupPanel .detail");
      // console.log(router);
      // dom.onclick = function () {
      //   router.push({
      //     path: `/dataAnalysis/surround`,
      //     query: { id, title, lat, lng }
      //   });
      // };
      // mapObject.flyTo(e.latlng, 8);
    });
  // .on("mouseout", e => e.layer.closePopup())
}
