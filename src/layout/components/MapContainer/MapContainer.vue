<template>
  <div id="map" ref="mapView" :v-loading="loading">
    <!-- <Home /> -->
    <!-- <Draw
      :map="map"
      :drawBtns="drawBtns"
      style="position: absolute; top: 30%; width: 40px"
    /> -->
    <searchControl @geo-info="displayGeo" />
    <LayerControl
      :map="map"
      :position="position"
      :base-layers="baseLayer"
      :over-layers="overLayer"
      @update:base-layer="baseLayerChange"
      @update:over-layer="overLayerChange"
    />
    <cursorLocation :map="map" />
    <slot />
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
import type { Ref, PropType } from "vue";
// import "./leaflet-geoman.d";
// import L from "leaflet";
// import Draw from "@/layout/components/common/Draw.vue";
import searchControl from "./searchControl.vue";
import LayerControl from "./layerControl.vue";
import CustomControl from "./customControl";
import HomeControl from "./Home";
import cursorLocation from "./cursorLocation.vue";
import initLayer from "./TileLayer";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

// import DrawControl from "./control";
// import "./control.js"
import "@/utils/L.draw-local";

// import { useStore } from "vuex"
// import mapObject, { mapControl, pulsingIcon } from "@/utils/map"
// import { sqlQuery, buffer_Analysis } from "@/utils/analysis"
import { HeatMapLayer, TiandituTileLayer } from "@supermap/iclient-leaflet";

const map: Ref<L.Map> = ref(null);
const mapView = ref(null);
const loading = ref(false);
const control = ref(null);
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
  if (!mapView.value) return;
  loading.value = true;
  // map = instance.refs.mapView;
  const {
    MAP: { BASEMAPLAYER, map_crs, ...option }
  } = window.BASE_CONFIG;
  const crs = typeof props.crs === "string" ? L.CRS[props.crs] : L.CRS[map_crs];
  if (crs === undefined) throw new Error(`不支持坐标系 ${props.crs}`);

  const options = { crs, ...option };

  // 将传入的options 复制到 options中
  Object.assign(options, props.options);

  map.value = L.map(mapView.value, options);
  // L.PM.setOptIn(true);
  map.value.pm.setLang("zh");
  const bLayers = initLayer(map.value, BASEMAPLAYER);
  // console.log(bLayers);
  baseLayer.value = Object.keys(bLayers).map((k, index) => {
    // console.log(L.Util.stamp(bLayers[k]));
    if (index === 1) {
      map.value.addLayer(bLayers[Object.keys(bLayers)[1]]);
      return {
        checked: true,
        key: L.Util.stamp(bLayers[k]).toString(),
        name: k,
        layer: bLayers[k]
      };
    }
    return {
      checked: false,
      key: L.Util.stamp(bLayers[k]).toString(),
      name: k,
      layer: bLayers[k]
    };
  });

  map.value.addBaseLayer = function (name, layer) {
    map.value.addLayer(layer);
    baseLayer.value.push({
      checked: true,
      key: L.Util.stamp(layer).toString(),
      name: name,
      layer: layer
    });
    console.log("object");
  };
  map.value.addOverLayer = function (name, layer) {
    map.value.addLayer(layer);
    overLayer.value.push({
      checked: true,
      key: L.Util.stamp(layer).toString(),
      name: name,
      layer: layer
    });
  };
  // map.value.on("layeradd", addLayer);
  // map.value.on("layerremove", rmLayer);

  // console.log(map.value);
  // map.value.proptype.addOverLayer = () => control.value;
  new HomeControl({ position: "topleft" }).addTo(map.value);

  if (props.options?.scale)
    L.control.scale({ imperial: false }).addTo(map.value);

  nextTick(async () => {
    if (props.options?.control) {
      map.value.pm?.addControls({
        position: "topleft",
        drawCircle: true,
        drawCircleMarker: false,
        drawMarker: false,
        drawPolygon: true,
        drawPolyline: true,
        drawRectangle: true,
        editMode: true,
        dragMode: true,
        cutPolygon: false,
        removalMode: true
      });
    }

    loading.value = false;
    emit("map-created", map.value);
  });
});

function addLayer(e) {
  console.log("addLayer", e);
  if (e.layer.options.overlay) {
    console.log("add", e.layer.options.name);
    const layerName = e.layer.options.name;
    overLayer.value.push({
      checked: map.value.hasLayer(e.layer),
      key: L.Util.stamp(e.layer).toString(),
      name: layerName,
      layer: e.layer
    });
  }
}

function rmLayer(e) {
  console.log("rmLayer", e);
  if (e.layer.options.overlay) {
    overLayer.value.filter(l => l.options.name !== e.layer.options.name);
  }
}

function displayGeo(geoInfo) {
  if (geoInfo && map.value) {
    console.log(geoInfo);
    const { pois } = geoInfo;
    const lonlat = pois[0].lonlat.split(" ");
    L.marker([lonlat[1], lonlat[0]]).bindPopup("sandan").addTo(map.value);
  }
}

function baseLayerChange(activeName) {
  console.log("baseLayerChangeobject");
  baseLayer.value.forEach(l => {
    if (l.name === activeName) {
      l.checked = true;
      map.value.addLayer(l.layer);
    } else {
      l.checked = false;
      if (map.value.hasLayer(l.layer)) {
        map.value.removeLayer(l.layer);
      }
    }
  });
  // const activeLayer = baseLayer.value.find((layer)=>layer.name===l)
  // map.value.addLayer(activeLayer);
  // console.log(l);
}
function overLayerChange(item) {
  const change = overLayer.value.findIndex(l => l.name === item.name);
  if (item.checked) {
    overLayer.value[change].checked = false;
    map.value.removeLayer(item.layer);
  } else {
    overLayer.value[change].checked = true;
    map.value.addLayer(item.layer);
  }
}
onBeforeUnmount(() => {
  if (map.value) {
    // console.log(map);
    map.value.off("layeradd");
    map.value.off("layerremove");
    map.value.off();
    map.value.remove();
    // map.value.pm.removeControls();
    emit("map-created", map.value);
  }
});
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
  .search {
    position: absolute;
    top: 40%;
    left: 0;
    z-index: 800;
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
