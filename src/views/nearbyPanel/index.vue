<template>
  <div>
    <div class="title">{{ route.query.title }}</div>
    <div class="main">
      <div class="mapPanel">
        <MapContainer
          class="map"
          :options="options"
          @map-created="
            Map => {
              map1 = Map;
            }
          "
        />
        <p>震中周边（10°×10°）过去1年（从当前时间算起）3.0级以上地震分布图</p>
      </div>
      <div class="mapPanel">
        <MapContainer
          class="map"
          :options="options"
          @map-created="
            Map => {
              map2 = Map;
            }
          "
        />
        <p>震中周边（10°×10°）过去1年（从当前时间算起）5.0级以上地震分布图</p>
      </div>
    </div>
  </div>
</template>

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
import { useRouter, useRoute } from "vue-router";
import MapContainer from "@/layout/components/MapContainer/MapContainer.vue";

import {
  earthquake,
  speedsearch,
  statisticsTimes,
  quickQuake,
  surrounding
} from "@/api/map";

// import L from "leaflet";
import {
  FeatureGroup,
  Marker,
  marker,
  rectangle,
  featureGroup,
  Util,
  point,
  bounds,
  latLngBounds
} from "leaflet";
import { Feature, FeatureCollection, GeoJSON } from "geojson";

import pulsingLayer, {
  generateIcon,
  popupPanel
} from "@/utils/mapAnalysis/pulsingLayer";

defineOptions({
  name: "NearBy"
});

const map1 = ref(null);
const map2 = ref(null);

const router = useRouter();
const route = useRoute();
// const props = defineProps({
//   id: {
//     type: any
//   }
// });

const options = {
  scale: true,
  zoomControl: true,
  logoControl: false,
  attributionControl: false
};

function createMarker(latLng, markerOptions, popupContent, popupOptions) {
  const m = marker(latLng, markerOptions);
  if (popupContent) {
    const popup = popupPanel(popupContent, popupOptions);
    m.bindPopup(popup);
  }
  return m;
}

function generatePopupContent(location, magnitude, depth, quakedate) {
  return `
    <div class="content">
      <p>震源: ${location}</p>
      <p>震级: ${magnitude}</p>
      <p>深度: ${depth} 千米</p>
      <p>发震时刻: ${quakedate}</p
    </div>
    <div class="detail"><button>详细信息</button></div>
  `;
}

async function initSurround(lat, lng, M) {
  const { data } = await surrounding(lat, lng, M);
  if (data.length === 0) return;

  // let group:FeatureGroup = featureGroup()
  const markers = data.map(item => {
    return L.marker([item.lat, item.lng], {
      title: item.location,
      icon: generateIcon(Number(item.class), 3, item.quakedate)
    }).bindPopup(layer => {
      return `
    <div class="popupPanel">
      <div class="content">
      <p>震源: ${item.location}</p>
      <p>震级: ${item.class}</p>
      <p>深度: ${item.depth} 千米</p>
      <p>发震时刻: ${item.quakedate}</p
      </div>
      <div class="detail"><button>详细信息</button></div>
    </div>
  `;
    });
  });
  const group = L.featureGroup(markers).on("click", e => {
    e.layer.openPopup();
    let latlng = e.latlng.lat + "," + e.latlng.lng;
    const title = e.layer.options.title;
    const id = Util.stamp(e.layer).toString();
    console.log(e);
    const dom: HTMLDivElement = document.querySelector(".popupPanel .detail");
    dom.onclick = function () {
      console.log("object");
      router.push({
        path: `/dataAnalysis/surround/${title}`,
        query: { id, title, latlng }
      });
    };
  });
  return group;
}

onMounted(() => {
  nextTick(async () => {
    console.log(route.query);
    const latlng = route.query.latlng.split(",");
    const options = { color: "#ff7800", weight: 1 };
    const lat = Number(latlng[0]);
    const lng = Number(latlng[1]);
    const feature1 = (await initSurround(lat, lng, 3)).addTo(map1.value);
    // feature1.addTo(map1.value)
    const feature2 = (await initSurround(lat, lng, 5)).addTo(map2.value);
    // feature2.addTo(map2.value)
    L.marker([lat, lng]).addTo(map1.value);
    L.marker([lat, lng]).addTo(map2.value);
    const recbounds = [
      [lat - 5, lng - 5],
      [lat + 5, lng + 5]
    ];
    // console.log(map1.value, recbounds);
    rectangle(recbounds, options).addTo(map1.value);
    rectangle(recbounds, options).addTo(map2.value);
    map1.value.fitBounds(recbounds, 8);
    map2.value.fitBounds(recbounds, 8);
  });
});

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<style lang="scss" scoped>
.title {
  display: "block";
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}
.mapPanel {
  position: relative;
  width: 50%;
  margin: 0 10px;
  #map {
    position: relative;
    width: 100%;
    height: 300px;
  }
  p {
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
}
</style>
