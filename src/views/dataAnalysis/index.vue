<script setup lang="ts">
import {
  onMounted,
  onBeforeMount,
  nextTick,
  reactive,
  ref,
  shallowReactive,
  watch
} from "vue";
import { message } from "@/utils/message";
import { earthquake } from "@/api/map";
import { ElMessage, ElLoading } from "element-plus";
// import initMap from "@/utils/echartsMap"
import HeatMap from "@/layout/components/MapContainer/HeatMap.vue";
import datasetQuery from "@/layout/components/MapContainer/datasetQuery.vue";
import MapContainer from "@/layout/components/MapContainer/MapContainer.vue";
import L from "leaflet";
import {
  getDatasourcesName,
  getDatasetsName,
  sqlQuery
} from "@/utils/mapAnalysis/analysis";
import pulsingLayer, { generateIcon } from "@/utils/mapAnalysis/pulsingLayer";
import { debounce } from "@/utils/tool";
import { HeatMapLayer } from "@supermap/iclient-leaflet";

defineOptions({
  name: "DataAnalysis"
});

const options = {
  zoom: 6,
  control: true,
  zoomControl: true,
  logoControl: false,
  attributionControl: false
};
const loading = ref(false);
const customMap = shallowReactive({
  map: null,
  features: null,
  heatLayers: null
});

function updateHeatMap(heatMapLayer) {
  if (!heatMapLayer) return;
  if (customMap.heatLayers) {
    console.log("hasLayer");
    customMap.map.removeLayer(customMap.heatLayers);
  }
  // heatMapLayer.removeAllFeatures();s
  heatMapLayer.addFeatures(customMap.features);
  customMap.heatLayers = heatMapLayer;
  customMap.map.addLayer(heatMapLayer);
  customMap.heatLayers.refresh();
  // customMap.map.addOverLayer("热力图", heatMapLayer);
  // console.log(heatMapLayer);
}

function initQuakePoint(dataset) {
  // console.log(dataset);
  customMap.features = dataset;
  // if (customMap.heatLayers) {
  //   customMap.heatLayers.removeAllFeatures();
  //   customMap.heatLayers.addFeatures(customMap.features);
  // }
  // const plusLayer = pulsingLayer(dataset.features, customMap.map);
}
onMounted(async () => {
  // const { data } = await earthquake();
  // const recentPoint = data?.map(item =>
  //   L.marker([item.EPI_LAT, item.EPI_LON], {
  //     icon: generateIcon(Number(item.M), 3, item.O_TIME)
  //   })
  // );
  // const rPoints = L.featureGroup(recentPoint).addTo(customMap.map);
});
// watch(
//   () => customMap.features,
//   newFeature => {
//     if (!newFeature || !customMap.map) return
//     console.log(newFeature)
//     initHeatMap(newFeature)
//   }
// )

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<template>
  <div
    style="margin: 0"
    v-loading.fullscreen="loading"
    element-loading-text="数据加载中"
  >
    <HeatMap
      :map="customMap.map"
      :features="customMap.features"
      @update:heat-map="updateHeatMap"
    />
    <datasetQuery @dataset="initQuakePoint" />
    <MapContainer
      style="height: 635px; overflow: hidden"
      @map-created="
        Map => {
          customMap.map = Map;
        }
      "
      :options="options"
    />
  </div>
</template>

<style lang="scss" scoped>
.form {
  padding: 0 5px;
}
</style>
