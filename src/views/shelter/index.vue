<template>
  <div style="margin: 0">
    <div id="container" ref="mapView"></div>
    <div class="amap-control range">
      <button @click="draw">测距</button>
    </div>
    <div class="control search">
      <ElAutocomplete
        v-model="geoName"
        style="width: 300px"
        class="inline-input w-150 expand"
        fit-input-width
        popper-append-to-body
        highlight-first-item
        :trigger-on-focus="false"
        :fetch-suggestions="querySearchAsync"
        placeholder="Please input"
        @select="handleSelect"
      >
        <template #default="{ item }">
          <div class="value">
            <span>{{ item.value }}</span>
            <span style="font-size: 12px; padding: 0 4px; color: #999">{{
              item.data.district
            }}</span>
          </div>
        </template>
      </ElAutocomplete>
      <!-- <input type="text" ref="auto" /> -->
      <div class="cascader">
        <el-cascader
          style="width: 300px"
          :options="regionData"
          v-model="cityCode"
          @change="handleChange"
        />
      </div>
      <div ref="detail" class="detail"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { ref, shallowRef, onMounted, onUnmounted } from "vue";
import type { Ref, PropType } from "vue";

import { useRouter, useRoute } from "vue-router";

import {
  provinceAndCityDataPlus,
  provinceAndCityData,
  convertTextToCode,
  regionDataPlus,
  regionData,
  CodeToText
} from "@/utils/chinaArea";

import { earthquake, gaodePoi, gaodeTip, quickQuake } from "@/api/map";

defineOptions({
  name: "shelter"
});

const route = useRoute();

const mapView = ref(null);
const map = shallowRef(null);

const auto = ref();
const detail = ref();
const geoName = ref("");
const autocomplete = ref();
const placeSearch = ref();
const rangeBtn = ref();

const currentCity = ref("");
const cityCode = ref(["110000", "110100", "110105"]);

const handleChange = value => {
  console.log(value);
  placeSearch.value?.setCity(value[0]);
  placeSearch.value.search("", function (status: String, result) {
    console.log(status, result);
  });
};

function initMap() {
  AMapLoader.load({
    key: "4b524bbe7f92c1754511d8d19eb6387c", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.Geolocation",
      "AMap.ToolBar",
      "AMap.Scale",
      "AMap.RangingTool",
      "AMap.AutoComplete",
      "AMap.PlaceSearch",
      "AMap.Driving"
    ] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then(AMap => {
      map.value = new AMap.Map(mapView.value, {
        //设置地图容器id
        mapStyle: "amap://styles/c1e640f718bf91087cb3210bd0b9536c",
        viewMode: "3D", //是否为3D地图模式
        zoom: 5, //初始化地图级别
        center: [105.602725, 37.076636] //初始化地图中心点位置
      });
      var toolbar = new AMap.ToolBar();
      map.value.addControl(toolbar);

      var geolocation = new AMap.Geolocation({
        showButton: false,
        panToLocation: true,
        enableHighAccuracy: true,
        buttonOffset: new AMap.Pixel(20, 90),
        zoomToAccuracy: true
      });
      map.value.addControl(geolocation);

      var Scale = new AMap.Scale();
      map.value.addControl(Scale);

      rangeBtn.value = new AMap.RangingTool(map.value);
      rangeBtn.value.on("end", () => {
        rangeBtn.value.turnOff();
      });
      //   var driving = new AMap.Driving();//驾车路线规划
      console.log(
        map.value.getCity(info => {
          console.log(info);
        })
      );
      // driving.search(/*参数*/)
      var autoOptions = {
        city: cityCode.value[2], // 城市，默认全国
        // 使用联想输入的input的id
        type: "200400|220200",
        input: auto.value
      };
      // autocomplete.value = new AMap.AutoComplete(autoOptions)

      var placeOptions = {
        city: cityCode.value[0],
        pageSize: 15,
        type: "200400|220200|141200|地震|避难|应急",
        panel: detail.value,
        renderStyle: "newpc",
        autoFitView: true,
        map: map.value
      };
      placeSearch.value = new AMap.PlaceSearch(placeOptions);
      placeSearch.value.search("", function (status: String, result) {
        console.log(status, result);
      });
      // autocomplete.value.on('select', function (e) {
      //   console.log(e);
      //   //TODO 针对选中的poi实现自己的功能
      //   placeSearch.search(e.poi.name, function (status: String, result) {
      //     console.log(status, result);

      //   })
      // })
      quakeInfo(AMap);
    })
    .catch(e => {
      console.log(e);
    });
}

function quakeInfo(AMap) {
  if (route.query) {
    const { location, time, lat, lng, M } = route.query;
    var infoWindow = new AMap.InfoWindow({
      anchor: "top-left",
      content: `${location}${time}时发生${M}级地震`
    });
    //设置圆形位置
    var center = new AMap.LngLat(lng, lat);
    //设置圆的半径大小
    var radius = circleRaduis(M);
    // 创建圆形 Circle实例
    var circle = new AMap.Circle({
      center: center, //圆心
      radius: radius, //半径
      borderWeight: 3,
      strokeColor: "#FF33FF",
      strokeOpacity: 1,
      strokeWeight: 6,
      fillOpacity: 0.4,
      strokeStyle: "dashed",
      strokeDasharray: [10, 10],
      // 线样式还支持 'dashed'
      fillColor: "#1791fc",
      zIndex: 50
    });
    circle.on("click", () => {
      infoWindow.open(map.value, center);
    });
    //圆形 Circle 对象添加到 Map
    map.value.add(circle);
    // 缩放地图到合适的视野级别
    setTimeout(() => {
      map.value.setFitView([circle]);
    }, 3000);
  }
}
function circleRaduis(M) {
  // (M/v)*L
  return (M / 4.5) * 50.0 * 1000;
}
function draw() {
  rangeBtn.value.turnOn();
}

function querySearchAsync(queryString: string, cb: (arg: any) => void) {
  // console.log(queryString);
  // autocomplete.value?.search(queryString, (status: String, result) => {
  //   console.log(status, result);
  // })
  gaodeTip(queryString, cityCode.value[2])
    .then(res => {
      const { tips } = res;
      console.log(res);
      const results = tips.map(item => {
        return { value: item.name, data: item };
      });
      cb(results);
    })
    .catch(res => {
      cb([]);
    });
}

async function handleSelect(item) {
  console.log(item);
  placeSearch.value.search(item.value, function (status: String, result) {
    console.log(status, result);
  });
}

onMounted(() => {
  // const latlng = route.query.latlng.split(",");
  console.log(route.query);
  initMap();
  AMapLoader.load({
    key: "4b524bbe7f92c1754511d8d19eb6387c",
    version: "2.0",
    plugins: ["AMap.MapType"]
  })
    .then(AMap => {
      map.value.addControl(new AMap.MapType());
      // AMap.plugin([ 'AMap.MouseTool'], function () {//异步同时加载多个插件
      //   var ruler = new AMap.RangingTool(map.value);

      // });
    })
    .catch(e => {
      console.error(e);
    });
});

onUnmounted(() => {
  map.value.destroy();
});

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<style lang="scss" scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 630px;
}

.control {
  position: absolute;
}

.range {
  bottom: 90px;
  right: 15px;
}

.search {
  top: 20px;
  left: 20px;
  z-index: 800;
  width: 300px;

  .cascader {
    margin-top: 40px;
  }

  .cascader {
    width: 300px;
    margin: 1em 0;
  }

  .detail {
    margin-top: 40px;
    max-height: 400px;
    overflow: auto;
    border-radius: 3px;
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.2);
  }
}
</style>
