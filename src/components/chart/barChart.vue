<template>
  <div class="chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { useAppStoreHook } from "@/store/modules/app";
import {
  ref,
  shallowRef,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
  watchEffect
} from "vue";
import type { PropType } from "vue";
const chartRef = ref<HTMLDivElement | null>(null);
const chart = shallowRef(null);
type EChartsOption = echarts.EChartsOption;
const props = defineProps({
  chartData: {
    type: Object as PropType<any>,
    default: () => ({
      category: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [120, 200, 150, 80, 70, 110, 130]
    })
    // required: true
  }
});

function initOption() {
  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    xAxis: {
      type: "category",
      data: props.chartData.category
    },
    yAxis: {
      type: "value"
    },
    legend: {},
    series: [
      {
        type: "bar",
        data: props.chartData.data
      }
    ]
  };
  return option;
}
function renderChart() {
  const chartDom = chartRef.value;
  if (!chartDom) return;
  // console.log(props.chartData);
  // console.log("chartRef", chartRef.value, chartDom);
  chart.value = echarts.init(chartDom);
  const option: EChartsOption = initOption();
  // console.log(option);
  chart.value.setOption(option);
  chart.value.resize();
}

onMounted(() => {
  nextTick(() => {
    renderChart();
  });
});

onBeforeUnmount(() => {
  const chartInstance = chart.value;
  if (chartInstance) chartInstance.dispose();
});
watch(
  () => props.chartData,
  () => {
    renderChart();
  }
);
watchEffect(() => {
  const sidebarStatus = useAppStoreHook().getSidebarStatus;
  if (!chart.value) return;
  // console.log(chart.value);

  chart.value.resize();
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 320px;
}
</style>
