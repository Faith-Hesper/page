<template>
  <div style="margin: 0px; padding: 5px; background: rgb(1, 22, 53)">
    <div class="title">
      {{ sqlString.from }}到{{ sqlString.to }}年地震热力图
    </div>
    <!-- <MapContainer
      style="height: 635px; overflow: hidden; position: absolute;"
      @map-created="
        Map => {
          map = Map;
        }
      "
    /> -->
    <div class="chartContainer">
      <div class="linked-charts">
        <div ref="barChartRef" class="chart"></div>
        <div ref="lineChartRef" class="chart"></div>
      </div>
      <div class="linked-charts">
        <div class="mapView" ref="mapView"></div>
      </div>
      <div class="linked-charts">
        <div ref="pieChartRef" class="chart"></div>
        <div ref="scatterChartRef" class="chart"></div>
      </div>
    </div>
    <div ref="timelineRef" class="timeline"></div>
  </div>
</template>
/** *必须有根元素，不然路由出错 */
<script setup lang="ts">
import type { Ref, PropType } from "vue";
import {
  onMounted,
  onBeforeUnmount,
  ref,
  shallowRef,
  reactive,
  nextTick
} from "vue";
import * as echarts from "echarts";

import { statisticsTimes, allData } from "@/api/map";
import MapContainer from "@/layout/components/MapContainer/MapContainer.vue";

import {
  HeatMapLayer,
  TiledMapLayer,
  EchartsLayer
} from "@supermap/iclient-leaflet";

defineOptions({
  name: "visual"
});
// 创建一个时间轴实例
const timelineRef = ref<echarts.ECharts>();
// 创建一个柱状图实例
const barChartRef = ref<echarts.ECharts>();
// 创建一个折线图实例
const lineChartRef = ref<echarts.ECharts>();
// 创建一个饼图实例
const pieChartRef = ref<echarts.ECharts>();
const scatterChartRef = ref<echarts.ECharts>();

const map: Ref<L.Map> = ref(null);
const mapView = ref(null);

// 创建一个时间轴实例
const timeline = ref<echarts.ECharts>();
// 创建一个柱状图实例
const barChart = ref<echarts.ECharts>();
// 创建一个折线图实例
const lineChart = ref<echarts.ECharts>();
// 创建一个饼图实例
const pieChart = ref<echarts.ECharts>();
const scatterChart = shallowRef<echarts.ECharts>();
const heatChart = shallowRef();

const sqlString = reactive({
  from: 2012,
  to: 2022,
  M: 1
});
const data = ref({
  year: Array.from({ length: sqlString.to - sqlString.from + 1 }, (_, index) =>
    (sqlString.from + index).toString()
  ),
  month: [
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
  result: {
    "2012": [38, 50, 62, 58, 52, 85, 65, 77, 54, 55, 59, 55]
  }
});
const scatterData = shallowRef({
  "2012": [[20, 20, 2]]
});

// 创建时间轴选项
const timelineOptions = {
  baseOption: {
    timeline: {
      type: "slider",
      show: true,
      axisType: "category",
      // orient: 'vertical',
      data: data.value.year,
      symbol: "none",
      autoPlay: true,
      // inverse: true,
      playInterval: 8000,
      // right: 30,
      // left: 20,
      // bottom: 40,
      // width: 55,
      // height: null,
      // lineStyle: { color: '#fff' },
      // checkpointStyle: { color: '#bbb', borderColor: '#777', borderWidth: 2 },
      controlStyle: {
        showNextBtn: false,
        showPrevBtn: false
        // normal: { color: '#666', borderColor: '#666' },
        // emphasis: { color: '#aaa', borderColor: '#aaa' }
      },
      label: {
        position: "bottom"
        // normal: { textStyle: { color: '#ddd' } },
        // emphasis: { textStyle: { color: '#fff' } }
      },
      realtime: true
    }
  }
};
// 创建柱状图选项
const barChartOptions = {
  color: ["#15d1f2"],
  title: {
    left: "center",
    text: "2012年1-12月地震次数"
  },
  toolbox: {
    show: true,
    feature: {
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  xAxis: {
    type: "category",
    name: "月份",
    data: data.value.month
  },
  yAxis: {
    type: "value",
    name: "单位：次数"
  },
  tooltip: {
    trigger: "item",
    textStyle: {
      fontSize: 12
    },
    formatter: "{b0}:{c0}"
  },
  series: [
    {
      type: "bar",
      name: "柱状图",
      barWidth: "50%",
      itemStyle: {
        normal: {
          color: "#2f89cf",
          opacity: 1,
          barBorderRadius: 5
        }
      },
      label: { show: true, position: "top", color: "#fff" },
      data: data.value.result[data.value.year[0]]
    }
  ]
};

// 创建折线图选项
const lineChartOptions = {
  title: {
    left: "center",
    text: "2012年1-12月地震次数"
  },
  toolbox: {
    show: true,
    feature: {
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  xAxis: {
    type: "category",
    name: "月份",
    data: data.value.month
  },
  yAxis: {
    type: "value",
    name: "单位：次数"
  },
  tooltip: {
    trigger: "item",
    textStyle: {
      fontSize: 12
    },
    formatter: "{b0}:{c0}"
  },
  series: [
    {
      type: "line",
      name: "折线图",
      smooth: true,
      // symbol: 'none',
      data: data.value.result[data.value.year[0]],
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(255, 158, 68)"
          },
          {
            offset: 0.8,
            color: "rgb(255, 70, 131)"
          }
        ])
      }
    }
  ]
};
// 创建饼图选项
const pieChartOptions = {
  color: ["#3fb1e3", "#6be6c1", "#626c91", "#a0a7e6", "#c4ebad"],
  title: {
    left: "center",
    text: "20121-12月地震次数"
  },
  toolbox: {
    show: true,
    feature: {
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  tooltip: {
    trigger: "item",
    textStyle: {
      fontSize: 12
    },
    formatter: "{b0}:{c0}"
  },
  legend: {
    show: false,
    orient: "horizontal",
    bottom: 0,
    data: ["一季度", "二季度", "三季度", "四季度"]
  },
  series: [
    {
      name: "饼图",
      type: "pie",
      radius: ["40%", "70%"],
      // center: ["50%", "60%"],
      // roseType: "area",
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      data: [
        { value: 335, name: "一季度" },
        { value: 310, name: "二季度" },
        { value: 234, name: "三季度" },
        { value: 234, name: "四季度" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};
// 创建散点图选项
const scatterChartOptions = {
  color: ["#15d1f2"],
  title: {
    left: "center",
    text: "2012年"
  },
  // toolbox: {
  //   show: true,
  //   feature: {
  //     restore: { show: true },
  //     saveAsImage: { show: true }
  //   }
  // },
  xAxis: {
    scale: true,
    min: -90,
    max: 90,
    splitLine: {
      lineStyle: { type: "solid", color: "#ccc", opacity: 1, width: 0.3 },
      show: true
    }
  },
  yAxis: {
    scale: true,
    min: -190,
    max: 190,
    // splitNumber: 6,
    splitLine: {
      lineStyle: { type: "solid", color: "#ccc", opacity: 1, width: 0.3 },
      show: true
    }
  },
  grid: {
    right: 20,
    bottom: 20,
    containLabel: false
  },
  series: [
    {
      type: "scatter",
      name: "散点图",
      symbolSize: val => val[2] * 1.2,
      data: scatterData.value[data.value.year[0]]
    }
  ]
};

let heatChartOptions = {
  visualMap: {
    show: false,
    top: "top",
    min: 0,
    max: 5,
    seriesIndex: 0,
    calculable: true,
    inRange: {
      color: ["blue", "blue", "green", "yellow", "red"]
    }
  },
  series: [
    //heatmap
    {
      type: "heatmap",
      coordinateSystem: "leaflet",
      data: scatterData.value[data.value.year[0]],
      pointSize: 10,
      blurSize: 15
    }
  ]
};

// 创建时间轴点击事件处理函数
const onTimelineClick = ({ dataIndex }: { dataIndex: number }) => {
  // console.log(dataIndex);
  const y = data.value.year[dataIndex];
  const result = data.value.result[y];
  barChart.value?.setOption({
    title: {
      left: "center",
      text: y + "年1-12月地震次数"
    },
    series: [
      {
        data: result
      }
    ]
  });

  lineChart.value?.setOption({
    title: {
      left: "center",
      text: y + "年1-12月地震次数"
    },
    series: [
      {
        data: result
      }
    ]
  });

  pieChart.value?.setOption({
    title: {
      left: "center",
      text: y + "年1-12月地震次数"
    },
    series: [
      {
        data: [
          { value: result[0] + result[1] + result[2], name: "一季度" },
          { value: result[3] + result[4] + result[5], name: "二季度" },
          { value: result[6] + result[7] + result[8], name: "三季度" },
          { value: result[9] + result[10] + result[11], name: "四季度" }
        ]
      }
    ]
  });

  scatterChart.value?.setOption({
    title: {
      left: "center",
      text: y + "年"
    },
    series: [
      {
        symbolSize: val => val[2] * 1.2,
        data: scatterData.value[y]
      }
    ]
  });

  heatChart.value?.removeAllFeatures();
  heatChart.value?.addFeatures(geoFeature(dataIndex));
  // heatChart.value?.setOption({
  //   series: [
  //     {
  //       data: scatterData.value[y]
  //     }
  //   ]
  // })
};

function timelineChanged(params) {
  onTimelineClick({ dataIndex: params.currentIndex });
}

function initChart() {
  // document.getElementById("timeline")
  timeline.value = echarts.init(timelineRef.value, "macarons");
  barChart.value = echarts.init(barChartRef.value, "vintage");
  lineChart.value = echarts.init(lineChartRef.value, "macarons");
  pieChart.value = echarts.init(pieChartRef.value, "macarons");
  scatterChart.value = echarts.init(scatterChartRef.value, "macarons");

  timeline.value.setOption(timelineOptions);
  barChart.value.setOption(barChartOptions);
  lineChart.value.setOption(lineChartOptions);
  pieChart.value.setOption(pieChartOptions);
  scatterChart.value.setOption(scatterChartOptions);
  // heatChart.value.setOption(heatChartOptions);
  heatChart.value.addTo(map.value);
  timeline.value.on("timelineChanged", timelineChanged);
  timeline.value.on("click", onTimelineClick);
}

function geoFeature(index) {
  let geojson = {
    type: "FeatureCollection",
    features: []
  };
  scatterData.value[data.value.year[index]].map(item => {
    let feature = {
      type: "feature",
      geometry: {
        type: "Point",
        coordinates: []
      },
      properties: {
        value: parseFloat(item[2])
      }
    };
    feature.geometry.coordinates = [parseFloat(item[1]), parseFloat(item[0])];

    geojson.features.push(feature);
  });
  return geojson;
}

function handleResize() {
  setTimeout(() => {
    timeline.value?.resize();
    barChart.value?.resize();
    lineChart.value?.resize();
    pieChart.value?.resize();
    scatterChart.value?.resize();
  }, 500);
}
// 在组件挂载时创建图表实例
onMounted(async () => {
  const {
    BASEURL: { mapUrl }
  } = window.BASE_CONFIG;
  map.value = L.map(mapView.value, {
    center: [32.67, 109.06],
    maxZoom: 18,
    minZoom: 3,
    zoom: 4,
    zoomControl: false,
    attributionControl: false
  });
  new TiledMapLayer(mapUrl).addTo(map.value);

  const { data: stData } = await statisticsTimes(
    sqlString.from,
    sqlString.to,
    sqlString.M
  );
  const { data: scatter } = await allData(
    sqlString.from,
    sqlString.to,
    sqlString.M
  );
  data.value.year = stData.year;
  data.value.result = stData.result;
  scatterData.value = scatter;
  // EchartsLayer

  nextTick(() => {
    heatChart.value = new HeatMapLayer("heatMap", {
      map: map.value,
      radius: 20,
      featureWeight: "value"
    });
    // heatChart.value = new EchartsLayer(heatChartOptions, {
    //   attribution: false
    // });
    // setTimeout(() => {
    initChart();
    window.addEventListener("resize", handleResize);
    // }, 3000);
  });
});

// 在组件卸载时销毁图表实例
onBeforeUnmount(() => {
  // console.log("卸载");
  window.removeEventListener("resize", handleResize);
  timeline.value.off("click", onTimelineClick);
  timeline.value.off("timelineChanged", timelineChanged);
  timeline.value?.dispose();
  barChart.value?.dispose();
  lineChart.value?.dispose();
  pieChart.value?.dispose();
  scatterChart.value?.dispose();
  timeline.value = null;
  barChart.value = null;
  lineChart.value = null;
  pieChart.value = null;
});

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<style scoped lang="scss">
.title {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 22px;
  background-image: url("https://iclient.supermap.io/web/data/background/image1.png");
  background-size: cover;
}

.mapView {
  // position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  z-index: 0;
}

.chartContainer {
  width: 100%;
  height: 520px;
  display: flex;
  // flex-direction: column;
  justify-content: space-around;
  flex-wrap: nowrap;

  .linked-charts {
    // width: 90%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-start;
  }

  .linked-charts:nth-child(2) {
    flex: 1;
  }

  .chart {
    width: 300px;
    height: 100%;
    border-width: 12px;
    border-image: url("data:image/png;base64,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artXAgQIECCwWOBzEeFzVy3+pTQkQIAAAQIEahIQLGp6td0rAQIECBDYWUCw2BlY9wQIECBAoCYBwaKmV9u9EiBAgACBnQUEi52BdU+AAAECBGoSECxqerXdKwECBAgQ2FlAsNgZWPcECBAgQKAmAcGiplfbvRIgQIAAgYcEhviPx+YXwWLex1kCBAgQIEBghYBgsQJLUwIECBAgQGBeQLCY93GWAAECBAgQWCEgWKzA0pQAAQIECBCYFxAs5n2cJUCAAAECBFYICBYrsDQlQIAAAQIE5gUEi3kfZwkQIECAAIElAtMHUQWLJVjaECBAgAABAosEBItFTBoRIECAAAECSwQEiyVK2hAgQIAAAQKLBASLRUwaESBAgAABAksEBIslStoQIECAAAEC1wWG48X/HyJYXGdylAABAgQIEPiEgGDxCTSXECBAgAABAtcFBIvrLo4SIECAAAECnxAQLD6B5hICBAgQIEDguoBgcd3FUQIECBAgQOATAoLFJ9BcQoAAAQIE6hJYHheWt6xL0N0SIECAAAECnxAQLD6B5hICBAgQIEDguoBgcd3FUQIECBAgUJ1Av8EdCxYbIOqCAAECBAjUIzAfHebP1qPkTgkQIECAAIENBASLDRB1QYAAAQIE6hbo3v+/EMGi7neCuydAgAABApsKCBabcuqMAAECBAjULSBY1P36u3sCBAgQILCpgGCxKafOCBAgQIBA3QKCRd2vv7snQIAAAQKbCggWm3LqjAABAgQI1C0gWNT9+rt7AgQIECCwqYBgsSmnzggQIECAwBcWWJAaFjT5wkBujQABAgQIENhUQLDYlFNnBAgQIECgbgHBou7X390TIECAAIFNBQSLTTl1RoAAAQIE6hYQLOp+/d09AQIECBDYVECw2JRTZwQIECBAoG4BwaLu19/dEyBAgACBTQUEi005dUaAAAECBOoWECzqfv3dPQECBAgQ2FRAsNiUU2cECBAgQKBuAcGi7tff3RMgQIAAgU0FBItNOXVGgAABAgTqFhAs6n793T0BAgQIENhUQLDYlFNnBAgQIECgVoExUggWtb7+7psAAQIECOwgIFjsgKpLAgQIECBQq4BgUesr774JECBAgMAOAoLFDqi6JECAAAECtQoIFrW+8u6bAAECBAjsICBY7ICqSwIECBAgUIXAlRRx5VAVFG6SAAECBAgQ2EFA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")
      12 fill / 1 / 0 stretch;
    margin: 5px;
  }

  .chart:nth-child(2) {
    // grid-row: 1 / span 2;
  }
}

.timeline {
  width: 100%;
  height: 50px;
  margin-top: 5px;
}
</style>
