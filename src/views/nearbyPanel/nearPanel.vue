<template>
  <div class="mapPanel">
    <MapContainer
      class="map"
      :options="options"
      @map-created="
        Map => {
          map = Map;
        }
      "
    />
    <p>
      震中周边（10°×10°）过去1年（从当前时间算起）{{
        props.quakeM
      }}.0级以上地震分布图
    </p>
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
  name: "NearPanel"
});

const map = ref(null);

const router = useRouter();
const route = useRoute();
const props = defineProps({
  quakeM: {
    default: 3
  }
});

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
    let { lat, lng } = e.latlng;
    const title = e.layer.options.title;
    const id = Util.stamp(e.layer).toString();
    console.log(e);
    const dom: HTMLDivElement = document.querySelector(".popupPanel .detail");
    dom.onclick = function () {
      console.log("object");
      router.push({
        path: `/dataAnalysis/surround/${title}`,
        query: { id, title, lat, lng }
      });
    };
  });
  return group;
}

onMounted(() => {
  nextTick(async () => {
    console.log(route.query);
    const { lat: lat1, lng: lng1 } = route.query;
    const { title } = route.query;
    const options = { color: "#ff7800", weight: 1 };
    const lat = Number(lat1);
    const lng = Number(lng1);
    const feature1 = (await initSurround(lat, lng, props.quakeM)).addTo(
      map.value
    );
    // feature1.addTo(map.value)
    L.marker([lat, lng])
      .bindPopup(
        `
    <div class="popupPanel">
      <div class="content">
      <p>震源: ${title}</p>
      </div>
    </div>
    `
      )
      .addTo(map.value);
    const recbounds = [
      [lat - 5, lng - 5],
      [lat + 5, lng + 5]
    ];
    // console.log(map.value, recbounds);
    rectangle(recbounds, options).addTo(map.value);
    map.value.fitBounds(recbounds, { padding: [50, 50] });
  });
});

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<style lang="scss" scoped>
.mapPanel {
  position: relative;
  width: 50%;
  margin: 0 10px;

  #map {
    position: relative;
    width: 100%;
    height: 500px;
  }

  p {
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
}
</style>
