<script setup lang="ts">
import {
  onMounted,
  onBeforeMount,
  nextTick,
  reactive,
  computed,
  ref,
  shallowReactive,
  watch,
  watchEffect,
  type Ref
} from "vue";
import { message } from "@/utils/message";
import {
  earthquake,
  speedsearch,
  statisticsTimes,
  quickQuake
} from "@/api/map";

import { ElMessage, ElLoading } from "element-plus";
// import initMap from "@/utils/echartsMap"

import QuakeTable from "@/layout/components/common/QuakeTable.vue";
import MapContainer from "@/layout/components/MapContainer/MapContainer.vue";

// import L from "leaflet";

import {
  getDatasourcesName,
  getDatasetsName,
  sqlQuery
} from "@/utils/mapAnalysis/analysis";
import pulsingLayer, {
  generateIcon,
  popupPanel
} from "@/utils/mapAnalysis/pulsingLayer";
import { debounce } from "@/utils/tool";
import { useSocket } from "@/utils/socket";

import barChart from "@/components/chart/barChart.vue";

import { ellipse as ellipse } from "@/utils/mapAnalysis/L.ellipse.js";
import freshIcon from "@/assets/svg/fresh.svg?component";

import { useRouter, useRoute } from "vue-router";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);

defineOptions({
  name: "Welcome"
});

const freshStamp = ref(1681266154770);
const socket = reactive(useSocket(freshStamp));

const recentData = ref([
  {
    class: "1",
    date: "2023/3/21",
    lat: 0,
    lng: 0,
    depth: "1",
    location: "1"
  }
]);

const recentPoint = ref({
  data: []
});
const quakeInfoText = info => {
  // item.O_TIME, item.LOCATION_C, item.M
  const date1 = dayjs(info.O_TIME).format("YYYY年MM月DD日HH时mm分");
  const date2 = dayjs(info.O_TIME).format("MM-DD日");
  // const date = new Date(info.O_TIME)
  // const year = date.getFullYear()
  return `${date1}${info.LOCATION_C}发生${info.M}级地震`;
};
const yearData = ref({});
const options = {
  scale: true,
  zoomControl: true,
  logoControl: false,
  attributionControl: false
};
const loading = ref(false);
const customMap = shallowReactive({
  map: null,
  features: null
});

const router = useRouter();
const route = useRoute();

watchEffect(() => {});
watch(socket.result, () => {});
// const { setOptions, resize } = useECharts(barChartRef as Ref<HTMLDivElement>);

// 地震周报
async function initWeekData() {
  const { data } = await earthquake();
  recentData.value = data?.reverse().map(item => {
    return {
      class: item.M,
      date: item.O_TIME,
      lat: item.EPI_LAT,
      lng: item.EPI_LON,
      depth: item.EPI_DEPTH,
      location: item.LOCATION_C
    };
  });
}

// 统计
async function initYearData() {
  const { data: stData } = await statisticsTimes(2021, 2022, 6);
  // stData.map(item => {
  //   years.push(item.year.toString());
  //   yearDatas.push(item.count);
  // });
  yearData.value = {
    title: "过去1年内M>6的地震",
    category: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月"
    ],
    data: stData.result["2022"]
  };
}

function initFeatureLayer() {
  const recentPoints = recentData.value.map(item =>
    L.marker([item.lat, item.lng], {
      title: item.location,
      icon: generateIcon(Number(item.class), 3, item.date)
    }).bindPopup(layer => {
      return `
    <div class="popupPanel">
      <div class="content">
      <p>震源: ${item.location}</p>
      <p>震级: ${item.class}</p>
      <p>深度: ${item.depth} 千米</p>
      <p>发震时刻: ${item.date}</p
      </div>
      <div class="detail"><button>详细信息</button></div>
    </div>
  `;
    })
  );
  setTimeout(() => {
    // console.log(L);

    const al = ellipse([41, 112], [500, 250], 40);
    // al.addTo(customMap.map)
  }, 3000);
  const group = L.featureGroup(recentPoints)
    .on("click", e => {
      e.layer.openPopup();
      let { lat, lng } = e.latlng;
      const title = e.layer.options.title;
      const id = L.Util.stamp(e.layer).toString();
      console.log(e);
      const dom: HTMLDivElement = document.querySelector(".popupPanel .detail");
      dom.onclick = function () {
        console.log("object");
        router.push({
          path: `/dataAnalysis/surround`,
          query: { id, title, lat, lng }
        });
      };
    })
    .addTo(customMap.map);
  // console.log(group);
  customMap.map.addOverLayer("qu", group);
  // customMap.map.fitBounds(group.getBounds(), { padding: [50, 50] });
}

onMounted(async () => {
  try {
    initWeekData().then((res: any) => {
      initFeatureLayer();
    });
  } catch (error) {}

  initYearData();

  // const { data: searchRes } = await speedsearch(1, 1);

  // console.log(searchRes);
});

function weekToInfo(data) {
  // console.log(data);
  const { location, time, lat, lng, M } = data;
  router.push({
    path: `/dataAnalysis/surround`,
    query: { location, time, lat, lng, M }
  });
}

function toRoute(data) {
  console.log(data.EPI_LAT, data.EPI_LON);
  let location = data.LOCATION_C;
  let time = data.O_TIME;
  let lat: string = data.EPI_LAT;
  let lng: string = data.EPI_LON;
  let M = data.M;
  router.push({
    path: `/shelter`,
    query: { location, time, lat, lng, M }
  });
}

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<template>
  <div>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card shadow="never" style="height: 347px">
          <template #header>
            <div class="header">
              <div>地震速报</div>
              <el-icon
                style="cursor: pointer"
                @click="
                  () => {
                    freshStamp = Date.now();
                  }
                "
              >
                <freshIcon />
              </el-icon>
            </div>
          </template>
          <el-skeleton animated :loading="loading">
            <template #default>
              <div v-if="typeof socket.result.data === 'string'">
                无地震信息
              </div>
              <div
                v-else
                v-for="item in socket.result.data"
                class="info"
                :title="quakeInfoText(item)"
              >
                <div
                  class="info-box"
                  :class="[dayjs(item.O_TIME).isToday() ? 'hot' : '']"
                  @click="toRoute(item)"
                >
                  <i></i>
                  <span class="text">{{ quakeInfoText(item) }}</span>
                  <span>{{ dayjs(item.O_TIME).format("MM-DD") }}</span>
                </div>
              </div>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card shadow="never" style="height: 347px">
          <template #header>
            <div class="header">
              <div>地震周报</div>
              <el-icon style="cursor: pointer" @click="initWeekData">
                <freshIcon />
              </el-icon>
            </div>
          </template>
          <el-skeleton animated :loading="loading">
            <template #default>
              <QuakeTable :table-data="recentData" :row-fn="weekToInfo" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card shadow="never" :body-style="{ padding: '0px' }">
          <template #header>
            <div class="header">
              <div>地震年报</div>
              <el-icon style="cursor: pointer" @click="initYearData">
                <freshIcon />
              </el-icon>
            </div>
          </template>
          <el-skeleton animated :loading="loading">
            <template #default>
              <barChart :chart-data="yearData" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card shadow="never" :body-style="{ padding: '0px' }">
          <template #header>
            <div>地震视图</div>
          </template>
          <el-skeleton animated :loading="loading">
            <template #default>
              <div style="position: relative; widows: 100%; height: 300px">
                <MapContainer
                  :options="options"
                  @map-created="
                    Map => {
                      customMap.map = Map;
                    }
                  "
                />
              </div>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
    <el-row> </el-row>
  </div>
</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.header {
  display: flex;
  justify-content: space-between;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info {
  cursor: default;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .info-box {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .text {
      flex: 1;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 5px;
    }

    .text::before {
      display: inline-block;
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background: #666;
      margin: 0 5px;
    }

    &.hot {
      color: #ff3e3e;

      .text::before {
        background: #ff3e3e;
      }
    }
  }
}
</style>
