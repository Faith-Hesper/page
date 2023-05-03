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
import {
  getDatasourcesName,
  getDatasetsName,
  sqlQuery
} from "@/utils/mapAnalysis/analysis";
import pulsingLayer, { generateIcon } from "@/utils/mapAnalysis/pulsingLayer";
import { debounce } from "@/utils/mapAnalysis/tool";

defineOptions({
  name: "Query"
});

// const customMap = shallowReactive({
//   map: null,
//   features: null
// });

const datasources = ref<Array<string> | undefined>([]);
const datasets = ref<Array<string> | undefined>([]);
const date = ref([]);
const loading = ref(false);
const form = reactive({
  datasourceName: "points",
  datasetName: "quake",
  date: "2021/08/15 00:00:00"
});

const emit = defineEmits(["dataset"]);
// 查询数据
const datasetsPrint = async () => {
  const filter = `QUAKEDATE > '${form.date}'`;
  const datasetNames = [form.datasourceName + ":" + form.datasetName];
  // console.log(datasetNames);
  const { features: FeatureCollection } = await sqlQuery({
    datasetNames: datasetNames,
    queryParameter: {
      name: "quake",
      attributeFilter: filter
      // fields: ["*"]
    },
    // filter: filter,
    toIndex: 199
  });
  message(`<p>当前一共为您找到${FeatureCollection.features.length}条信息</p>`, {
    type: "success",
    dangerouslyUseHTMLString: true
  });
  emit("dataset", FeatureCollection.features);
  // console.log(features);
  // initHeatMap(features);
  // heatMapLayer.removeAllFeatures();
  // heatMapLayer.addFeatures(features);
  // heatMapLayer.update();
};

const getDatasetNames = async datasourceName => {
  // 获取数据集名称集合
  datasets.value = await getDatasetsName(datasourceName);
  form.datasetName = datasets.value[0];

  date.value = await getDates(form.datasourceName, form.datasetName);
  form.date = date.value[0];
  Promise.resolve("");
  // console.log(formDate)
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
      datasourceName: datasourceName,
      datasetName: datasetName,
      toIndex: 999,
      queryParameter: {
        fields: ["Date_User"],
        groupBy: "Date_User",
        orderBy: "id"
      }
    });
    // console.log(features)
    const getfeature = features.map(feature => {
      return feature.properties.Date_User;
    });
    const dates = await Promise.all(getfeature);
    // form.date = date.value[0];
    // loading.value = false

    return await Promise.resolve(dates);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

function datasourceChange() {
  getDatasetNames(form.datasourceName);
}

// 数据集切换获取时间集合
async function datasetChange() {
  date.value = await getDates(form.datasourceName, form.datasetName);
  form.date = date.value[0];
}

onMounted(async () => {
  // 获取数据源名称集合
  datasources.value = await getDatasourcesName();
  form.datasourceName = datasources.value[0];
  getDatasetNames(form.datasourceName);
  datasetsPrint();
  // const { result } = await earthquake();
  // const recentPoint = result.map(item =>
  //   L.marker([item.EPI_LAT, item.EPI_LON], {
  //     icon: generateIcon(Number(item.M), 3)
  //   })
  // );
  // const rPoints = L.featureGroup(recentPoint);
  // console.log(result);
  // nextTick(() => {
  //   console.log(customMap.map);
  //   sqlQuery({ filter: "QUAKEDATE >= 2022-02-20" }).then(({ features }) => {
  //     const plusLayer = pulsingLayer(features, customMap.map);

  //     // initHeatMap(features);
  //   });
  // });
});

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<template>
  <div class="toolbar">
    <DragCard title="数据查询">
      <el-form
        class="form"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="数据源">
          <el-select v-model="form.datasourceName" @change="datasourceChange">
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
</template>

<style scoped>
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
  width: 310px;
  padding: 0 5px;
}
</style>
