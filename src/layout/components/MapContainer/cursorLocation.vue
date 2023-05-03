<template>
  <div class="cursorLocation">
    <div>{{ latlng }}</div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  nextTick,
  computed,
  ref,
  shallowReactive,
  watch
} from "vue";
import { throttle } from "@/utils/tool";
import L from "leaflet";

const props = defineProps({
  map: L.Map
  // position: {
  //   type: String as PropType<position>,
  //   default: "topright"
  // },
});

const latlng = ref("");

const handleMouse = throttle(function (e) {
  const location = e.latlng;
  latlng.value = formateLatLng(location);
}, 100);

function formateLatLng(latlng) {
  const lng = latlng.lng.toFixed(2);
  const lngD = lng > 0 ? "E" : "W";
  const lat = latlng.lat.toFixed(2);
  const latD = lat > 0 ? "N" : "S";
  // const text = `经度：${latlng.lng.toFixed(2)} 纬度： ${latlng.lat.toFixed(2)}`
  const text = `${Math.abs(lat)}°${latD}   ${Math.abs(lng)}°${lngD}`;
  return text;
}

onMounted(() => {
  nextTick(() => {
    if (!props.map) return;
    const location = props.map.getCenter();
    latlng.value = formateLatLng(location);
    props.map.on("mousemove", handleMouse);
  });
});

onUnmounted(() => {
  if (!props.map) return;
  props.map.off("mousemove");
});
</script>

<style lang="scss" scoped>
.cursorLocation {
  width: 120px;
  position: absolute;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  z-index: 1000;
  color: black;
  background-color: #fff;
  bottom: 0%;
  right: 0%;
  margin-bottom: 5px;
  margin-right: 10px;
  div {
    padding: 0 5px;
  }
}
.topleft {
  top: 20%;
  left: 0%;
  margin-top: 10px;
  margin-left: 10px;
}
</style>
