<template>
  <div id="map" ref="mapView" :v-loading="loading" style="width: 100%"></div>
</template>

<script setup lang="ts">
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
// import { useStore } from "vuex"
// import mapObject, { mapControl, pulsingIcon } from "@/utils/map"
// import { sqlQuery, buffer_Analysis } from "@/utils/analysis"
import { HeatMapLayer, TiandituTileLayer } from "@supermap/iclient-leaflet";

let map;
const instance = getCurrentInstance();

const props = defineProps({
  crs: { type: String, default: "EPSG4326" },
  control: { type: Boolean, default: true },
  baseLayers: { type: Array, default: () => [] },
  options: { type: Object, default: null },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["map-created", "mapControl"]);

onMounted(() => {
  if (!instance) return;

  map = instance.refs.mapView;

  const {
    MAP: { baseMapLayer, map_crs, ...option }
  } = BASE_CONFIG;
  const crs = typeof props.crs === "string" ? L.CRS[props.crs] : L.CRS[map_crs];
  if (crs === undefined) throw new Error(`不支持坐标系 ${props.crs}`);
  let layers = [];
  if (props.baseLayers.length > 1) {
    layers = props.baseLayers;
  } else {
    layers = baseMapLayer.map(layer => new TiandituTileLayer(layer));
  }

  let baselayer = {
    中国地图: L.featureGroup(layers)
  };

  const options = { layers, crs, ...option };

  // 将传入的options 复制到 options中
  Object.assign(options, props.options);

  map = L.map("map", options);
  // MyCustomMap.baselayers = baselayer;
  // MyCustomMap.map.addLayer(baselayer);
  nextTick(() => {
    emit("map-created", map);
  });
});

onBeforeUnmount(() => {
  if (map) {
    // console.log(map);
    map.off();
    map.remove();
  }
});
</script>

<style scoped>
#map {
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}
</style>
