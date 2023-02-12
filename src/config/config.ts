/*
 * @Author: Faith
 * @Date: 2022-06-20 19:23
 * @LastAuthor: Faith
 * @LastEditTime: 2023-02-05 10:13
 * @Description:
 */

window.BASE_CONFIG = {
  key: "70c2475638a45e3fea8696df2f9917f8",
  MAP: {
    center: [35.67, 114.07],
    minZoom: 1.5,
    maxZoom: 18,
    zoom: 8,
    zoomControl: false,
    map_crs: "EPSG4326",
    maxBounds: [
      [90, 180],
      [-90, -180]
    ],
    baseMapLayer: [
      {
        name: "天地图底图",
        key: "70c2475638a45e3fea8696df2f9917f8",
        isLabel: false,
        url: "http://t0.tianditu.gov.cn/vec_c/wmts?"
      },
      {
        name: "天地图注记",
        key: "70c2475638a45e3fea8696df2f9917f8",
        isLabel: true,
        url: "http://t0.tianditu.gov.cn/cva_c/wmts?"
      }
    ]
  },
  BASEURL: {
    mapUrl:
      "http://localhost:8090/iserver/services/map-ChengduFresh/rest/maps/ChengduMap",
    dataUrl:
      "http://localhost:8090/iserver/services/data-earthquakePoints/rest/data",
    spatialAnalystUrl:
      "http://localhost:8090/iserver/services/spatialAnalysis-earthquakePoints/restjsr/spatialanalyst",
    newworkServiceUrl:
      "http://localhost:8090/iserver/services/transportationAnalyst-ChengduFresh/rest/networkanalyst/Network@ChengduFresh",
    traffictransferanalystUrl:
      "http://localhost:8090/iserver/services/traffictransferanalyst-sample/restjsr/traffictransferanalyst/Traffic-Changchun"
  }
} as BASE_CONFIG;
