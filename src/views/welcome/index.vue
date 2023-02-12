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
import MapContainer from "@/layout/components/MapContainer/MapContainer.vue";
import { message } from "@/utils/message";

import { ElMessage, ElLoading } from "element-plus";
// import initMap from "@/utils/echartsMap"
import {
  getDatasourcesName,
  getDatasetsName,
  sqlQuery
} from "@/utils/mapAnalysis/analysis";
import { debounce } from "@/utils/mapAnalysis/tool";
import { HeatMapLayer } from "@supermap/iclient-leaflet";

defineOptions({
  name: "Welcome"
});

const customMap = shallowReactive({
  map: null,
  features: null
});
// const heatMapLayer = shallowReactive(
//   new HeatMapLayer("heatMap", ["blue", "cyan", "lime", "yellow", "red"], {
//     id: "heatmap",
//     map: customMap.map,
//     radius: 80,
//     featureWeight: "CLASS"
//   })
// );

const datasources = ref<Array<string> | undefined>([]);
const datasets = ref<Array<string> | undefined>([]);
const date = ref([]);
const loading = ref(false);
const form = reactive({
  datasourceName: "points",
  datasetName: "quake",
  date: "2021/03/15 00:00:00"
});

// 查询数据
const datasetsPrint = async () => {
  const filter = `QUAKEDATE > '${form.date}'`;
  const datasetNames = [form.datasourceName + ":" + form.datasetName];
  console.log(datasetNames);
  const { features } = await sqlQuery({
    datasetNames: datasetNames,
    queryParameter: {
      name: "quake",
      attributeFilter: filter,
      fields: ["*"]
    },
    // filter: filter,
    toIndex: 199
  });
  console.log(features);
  initHeatMap(features);
  // heatMapLayer.removeAllFeatures();
  // heatMapLayer.addFeatures(features);
  // heatMapLayer.update();
};

const getDatasetNames = async () => {
  // 获取数据源名称集合
  datasources.value = await getDatasourcesName();
  form.datasourceName = datasources.value[0];

  // 获取数据集名称集合
  datasets.value = await getDatasetsName(datasources.value[0]);
  form.datasetName = datasets.value[0];
  // console.log(sources)
  getDates(form.datasourceName, form.datasetName);
  // console.log(formDate)
  return Promise.resolve("");
};

// 获取时间集合
async function getDates(datasourceName: string, datasetName: string) {
  try {
    loading.value = true;
    // 获取时间
    const {
      features: { features },
      total
    } = await sqlQuery({
      queryParameter: {
        fields: ["Date_User"],
        groupBy: "Date_User",
        orderBy: "id"
      },
      datasourceName: datasourceName,
      datasetName: datasetName,
      toIndex: 999
    });
    // console.log(features)
    const getfeature = features.map(feature => {
      return feature.properties.Date_User;
    });
    date.value = await Promise.all(getfeature);
    form.date = date.value[0];
    // loading.value = false
    message(
      `<P>一共${total}条信息</P><p>当前一共为您找到${features.length}条信息</p>`,
      { type: "success", dangerouslyUseHTMLString: true }
    );
    return await Promise.resolve("");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

// 数据集切换获取时间集合
function datasetChange() {
  getDates(form.datasourceName, form.datasetName);
}
// sqlQuery({ filter: "2021-11-28" }).then(res => {
//   customMap.features = res
// })

onMounted(() => {
  getDatasetNames();
  nextTick(() => {
    console.log(customMap.map);
    sqlQuery({ filter: "QUAKEDATE >= 2022-02-20" }).then(({ features }) => {
      initHeatMap(features);
    });
  });
});
// watch(
//   () => customMap.features,
//   newFeature => {
//     if (!newFeature || !customMap.map) return
//     console.log(newFeature)
//     initHeatMap(newFeature)
//   }
// )

// 添加热力图
function initHeatMap(
  features,
  name = "heatMap",
  colors = ["blue", "cyan", "lime", "yellow", "red"]
) {
  console.log(features);
  const options = {
    id: "heatmap",
    map: customMap.map,
    radius: 80,
    featureWeight: "CLASS"
  };
  const heatMapLayer = new HeatMapLayer(name, colors, options);
  heatMapLayer.addFeatures(features);
  console.log(customMap.map);
  heatMapLayer.addTo(customMap.map);
}
</script>

<template>
  <div
    class="heatmap"
    v-loading.fullscreen="loading"
    element-loading-text="数据加载中"
  >
    <div class="toolbar">
      <DragCard title="缓冲区">
        <el-form
          class="form"
          :model="form"
          label-position="left"
          label-width="auto"
        >
          <el-form-item label="数据源">
            <el-select v-model="form.datasourceName">
              <el-option
                v-for="(item, index) in datasources"
                :label="item"
                :value="item"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="数据集">
            <el-select v-model="form.datasetName" @change="datasetChange">
              <el-option
                v-for="(item, index) in datasets"
                :label="item"
                :value="item"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-select v-model="form.date" filterable>
              <el-option
                v-for="(item, index) in date"
                :label="item"
                :value="item"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="datasetsPrint">查询</el-button>
          </el-form-item>
        </el-form>
      </DragCard>
    </div>
    <MapContainer
      @map-created="
        Map => {
          customMap.map = Map;
        }
      "
      :loading="loading"
    />
  </div>
</template>

<style scoped>
.heatmap {
}

.toolbar {
  position: absolute;
  top: 100px;
  right: 10px;
  width: 300px;
  text-align: center;
  z-index: 2;
  border-radius: 4px;
}

.form {
  padding: 0 5px;
}
</style>
