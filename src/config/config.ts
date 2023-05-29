/*
 * @Author: Faith
 * @Date: 2022-06-20 19:23
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-05 13:53
 * @Description:
 */
interface MapConfig {
  center: [number, number];
  preferCanvas: boolean;
  minZoom: number;
  maxZoom: number;
  zoom: number;
  zoomControl: boolean;
  map_crs: string;
  maxBounds: [[number, number], [number, number]];
  baseMapLayer: Array<{ name: string; isLabel: boolean; url: string }>;
}

interface BaseUrlConfig {
  mapUrl: string;
  dataUrl: string;
  spatialAnalystUrl: string;
  newworkServiceUrl: string;
  traffictransferanalystUrl: string;
}

interface BaseConfig {
  key: string;
  MAP: MapConfig;
  BASEURL: BaseUrlConfig;
  BASEMAPLAYER: Object;
}

const { VITE_PORT } = import.meta.env;

const keys = [
  "9ee2e9255a1179d3c78ce13483a1e161",
  "70c2475638a45e3fea8696df2f9917f8"
];
// "75f0434f240669f4a2df6359275146d2"

function random(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

const MAP_CONFIG: MapConfig = {
  center: [35.67, 114.07],
  preferCanvas: true,
  minZoom: 1.4,
  maxZoom: 18,
  zoom: 3,
  zoomControl: false,
  map_crs: "EPSG4326",
  maxBounds: [
    [90, 180],
    [-90, -180]
  ],
  baseMapLayer: [
    {
      name: "天地图底图",
      isLabel: false,
      url: `http://t${random(0, 7)}.tianditu.gov.cn/vec_c/wmts?`
    },
    {
      name: "天地图注记",
      isLabel: true,
      url: `http://t${random(0, 7)}.tianditu.gov.cn/cva_c/wmts?`
    }
  ]
};

const BASEURL_CONFIG: BaseUrlConfig = {
  mapUrl:
    "http://localhost:8090/iserver/services/map-china400/rest/maps/ChinaDark",
  dataUrl:
    "http://localhost:8090/iserver/services/data-earthquakePoints/rest/data",
  spatialAnalystUrl:
    "http://localhost:8090/iserver/services/spatialAnalysis-earthquakePoints/restjsr/spatialanalyst",
  newworkServiceUrl:
    "http://localhost:8090/iserver/services/transportationAnalyst-ChengduFresh/rest/networkanalyst/Network@ChengduFresh",
  traffictransferanalystUrl:
    "http://localhost:8090/iserver/services/traffictransferanalyst-sample/restjsr/traffictransferanalyst/Traffic-Changchun"
};

const BASELAYERS = {
  矢量底图: [
    {
      name: "矢量底图",
      isLabel: false,
      layerType: "vec",
      url: `http://t${random(0, 7)}.tianditu.gov.cn/vec_c/wmts?`
    },
    {
      name: "矢量注记",
      isLabel: true,
      layerType: "vec",
      url: `http://t${random(0, 7)}.tianditu.gov.cn/cva_c/wmts?`
    }
  ],
  影像底图: [
    {
      name: "影像底图",
      isLabel: false,
      layerType: "img",
      url: `http://t${random(0, 7)}.tianditu.gov.cn/img_c/wmts?`
    },
    {
      name: "影像注记",
      isLabel: true,
      layerType: "img",
      url: `http://t${random(0, 7)}.tianditu.gov.cn/cia_c/wmts?`
    }
  ],
  地形底图: [
    {
      name: "地形晕渲",
      isLabel: false,
      layerType: "ter",
      url: `http://t${random(0, 7)}.tianditu.gov.cn/ter_c/wmts?`
    },
    {
      name: "地形注记",
      isLabel: true,
      layerType: "ter",
      url: `http://t${random(0, 7)}.tianditu.gov.cn/cta_c/wmts?`
    }
  ]
};
const BASE_CONFIG: BaseConfig = {
  key: keys[random(0, keys.length - 1)],
  MAP: MAP_CONFIG,
  BASEMAPLAYER: BASELAYERS,
  BASEURL: BASEURL_CONFIG
};

window.BASE_CONFIG = BASE_CONFIG;
