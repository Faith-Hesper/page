<script setup lang="ts">
import {
  onMounted,
  onBeforeMount,
  nextTick,
  shallowRef,
  ref,
  reactive,
  shallowReactive,
  watch
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { message } from "@/utils/message";
import { earthquake } from "@/api/map";
import { ElMessage, ElLoading } from "element-plus";
// import initMap from "@/utils/echartsMap"

import QuakeQuery from "@/layout/components/common/QuakeQuery.vue";
import QuakeTable from "@/layout/components/common/QuakeTable.vue";
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

const router = useRouter();

const sqlFilter = ref("");
const options = {
  zoom: 6,
  control: true,
  zoomControl: true,
  logoControl: false,
  attributionControl: false
};
const btnStatus = ref(false);
const loading = ref(false);
const sqlQueryResult = shallowRef();
const customMap = shallowReactive({
  map: null,
  features: null,
  heatLayers: null,
  quakePoints: null
});

const pagination = reactive({
  total: 200,
  currentPage: 1,
  pageSizes: [20, 100, 200, 300, 400, "all"],
  pageSize: 20
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
  customMap.map.addOverLayer("热力图", heatMapLayer);
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

function searchData(filter: string) {
  sqlFilter.value = filter;
  search(filter);
}

function handleSizeChange(val) {
  if (val === "all") {
    pagination.pageSize = pagination.total;
  } else {
    pagination.pageSize = val;
  }
  search(sqlFilter.value);
}

function handlePageChange(val) {
  console.log(val);
  pagination.currentPage = val;
  search(sqlFilter.value);
}

async function search(sqlFilter: string) {
  if (customMap.quakePoints) {
    customMap.map.removeLayer(customMap.quakePoints);
    customMap.map.rmOverLayer("地震点", customMap.quakePoints);
    // customMap.map.addOverLayer(`${pagination.currentPage}地震点`, pulsLayers);
  }
  const fromIndex = (pagination.currentPage - 1) * pagination.pageSize;
  const toIndex = pagination.currentPage * pagination.pageSize - 1;
  const { features: FeatureCollection, total } = await sqlQuery({
    filter: sqlFilter,
    fromIndex,
    toIndex
  });

  pagination.total = total;
  btnStatus.value = true;
  customMap.features = FeatureCollection;

  const pulsLayers = pulsingLayer(FeatureCollection, customMap.map).on(
    "click",
    e => {
      e.layer.openPopup();
      let { lat, lng } = e.latlng;
      const title = e.layer.options.title;
      const id = L.Util.stamp(e.layer).toString();
      const dom: HTMLDivElement = document.querySelector(".popupPanel .detail");
      // console.log(router);
      dom.onclick = function () {
        router.push({
          path: `/dataAnalysis/surround`,
          query: { id, title, lat, lng }
        });
      };
      // mapObject.flyTo(e.latlng, 8);
    }
  );

  customMap.quakePoints = pulsLayers;
  customMap.map.fitBounds(pulsLayers.getBounds(), { padding: [50, 50] });

  customMap.map.addOverLayer(`地震点`, customMap.quakePoints);

  let sqlData = FeatureCollection.features.map(item => {
    let temp = {
      class: item.properties.CLASS,
      date: item.properties.QUAKEDATE,
      lat: item.properties.LAT,
      lng: item.properties.LNG,
      depth: item.properties.DEPTH,
      location: item.properties.LOCATION
    };
    return temp;
  });
  sqlQueryResult.value = await Promise.all(sqlData);
  // console.log(FeatureCollection);
}

function mapFly(data) {
  // console.log(data);
  const { location, time, lat, lng, M } = data;
  // router.push({
  //   path: `/dataAnalysis/surround`,
  //   query: { location, time, lat, lng, M }
  // })
  customMap.map.flyTo([lat, lng]);
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
    class="analysis"
    style="margin: 0"
    v-loading.fullscreen="loading"
    element-loading-text="数据加载中"
  >
    <HeatMap
      :map="customMap.map"
      :features="customMap.features"
      @update:heat-map="updateHeatMap"
    />
    <QuakeQuery @search="searchData" />
    <!-- <datasetQuery @dataset="initQuakePoint" /> -->
    <MapContainer
      :style="{
        height: btnStatus ? '420px' : '635px',
        overflow: 'hidden',
        position: 'relative'
      }"
      :options="options"
      @map-created="
        Map => {
          customMap.map = Map;
        }
      "
    />
    <div class="footer" v-show="btnStatus">
      <QuakeTable
        :table-data="sqlQueryResult"
        :row-fn="mapFly"
        :max-height="200"
      />
      <div class="pagination">
        <el-pagination
          :page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :total="pagination.total"
          :current-page.sync="pagination.currentPage"
          hide-on-single-page
          layout="total,sizes,prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.analysis {
  height: auto;
  position: relative;
}

.pagination {
  display: flex;
  justify-content: center;
  height: 30px;
}

.form {
  padding: 0 5px;
}
</style>
