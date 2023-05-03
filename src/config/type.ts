/*
 * @Author: Faith
 * @Date: 2023-02-05 10:03
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-11 09:23
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
