/*
 * @Author: Faith
 * @Date: 2023-03-26 14:43
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-01 20:20
 * @Description:
 */
import {
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  ref,
  shallowReactive,
  nextTick,
  toRef,
  watch
} from "vue";
import L from "leaflet";
import { HeatMapLayer, TiandituTileLayer } from "@supermap/iclient-leaflet";

export default function initLayer(map: any, baseMapLayer) {
  if (!map) return;
  return createTiandituLayer(baseMapLayer, map);
}
export function createTiandituLayer(baseMapLayer, map) {
  const { BASEMAPLAYER, key } = window.BASE_CONFIG;
  let layers = {};
  Object.keys(BASEMAPLAYER).map((keys, index) => {
    layers[keys] = L.layerGroup(
      BASEMAPLAYER[keys].map(l => {
        return new TiandituTileLayer({
          key,
          ...l
        });
      })
    );
    // return layers
  });
  return layers;
}
