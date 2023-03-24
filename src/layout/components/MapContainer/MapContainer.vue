<template>
  <div id="map" ref="mapView" :v-loading="loading" style="width: 100%">
    <LayerControl
      v-if="control"
      :map="map"
      :position="position"
      :base-layers="baseLayer"
      :over-layers="overLayer"
    />
  </div>
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
import LayerControl from "./LayerControl.vue";
// import { useStore } from "vuex"
// import mapObject, { mapControl, pulsingIcon } from "@/utils/map"
// import { sqlQuery, buffer_Analysis } from "@/utils/analysis"
import { HeatMapLayer, TiandituTileLayer } from "@supermap/iclient-leaflet";
import type { PropType } from "vue";

const map = ref(null);
const baseLayer = ref([]);
const overLayer = ref([]);
const instance = getCurrentInstance();
type position = "topleft" | "topright" | "bottomright" | "bottomleft";
const props = defineProps({
  crs: { type: String, default: "EPSG4326" },
  control: { type: Boolean, default: true },
  position: {
    type: String as PropType<position>,
    default: "topright"
  },
  baseLayers: { type: Array, default: () => [] },
  overLayers: { type: Array, default: () => [] },
  options: { type: Object, default: null },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["map-created", "mapControl"]);

onMounted(() => {
  if (!instance) return;

  // map = instance.refs.mapView;
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

  const options = { layers, crs, ...option };

  baseLayer.value = layers;
  // 将传入的options 复制到 options中
  Object.assign(options, props.options);

  map.value = L.map("map", options);

  // map.value.on("layeradd", addLayer);
  // map.value.on("layerremove", rmLayer);
  // MyCustomMap.baselayers = baselayer;
  // MyCustomMap.map.addLayer(baselayer);
  nextTick(() => {
    emit("map-created", map.value);
  });
});

function addLayer(e) {
  console.log(e);
  if (e.layer.options.overlay) {
    console.log("add", e.layer.options.name);
    const layerName = e.layer.options.name;
    overLayer.value.push(e.layer);
  }
}

function rmLayer(e) {
  if (e.layer.options.overlay) {
    overLayer.value.filter(l => l.options.name !== e.layer.options.name);
  }
}
onBeforeUnmount(() => {
  if (map.value) {
    // console.log(map);
    map.value.off();
    map.value.remove();
  }
});
</script>

<style lang="scss" scoped>
#map {
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
  .control {
    position: absolute;
    border: 2px solid rgba(0, 0, 0, 0.2);
  }
  .topleft {
    top: 0%;
    left: 0%;
    margin-top: 10px;
    margin-left: 10px;
  }
  .topright {
    top: 0%;
    right: 0%;
    margin-top: 10px;
    margin-right: 10px;
  }
  .bottomright {
    bottom: 0%;
    right: 0%;
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .bottomleft {
    bottom: 0%;
    left: 0%;
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
</style>
