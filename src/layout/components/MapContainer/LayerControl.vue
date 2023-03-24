<template>
  <div class="control" :class="position">
    <div class="base-box">
      <div class="box" v-for="layer in baseLayers">
        <input type="radio" :name="layer.options.name" id="" />
        <span class="label">{{ layer.options.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  ref,
  shallowReactive,
  nextTick,
  toRef,
  watch
} from "vue";
import type { PropType } from "vue";

type position = "topleft" | "topright" | "bottomright" | "bottomleft";
const props = defineProps({
  map: null,
  position: {
    type: String as PropType<position>,
    default: "topright"
  },
  baseLayers: { type: Array, default: () => [] },
  overLayers: { type: Array, default: () => [] }
});

onMounted(() => {
  if (!props.map) return;
  const baselayer = {
    中国地图: L.featureGroup(props.baseLayers)
  };
  const layerControl = L.control
    .layers(
      baselayer,
      {},
      {
        collapsed: false
      }
    )
    .addTo(props.map);

  // 监听图层添加事件
  props.map.on("layeradd", function (e) {
    if (e.layer.options.overlay) {
      console.log("add", e.layer.options.name);
      const layerName = e.layer.options.name;
      layerControl.addBaseLayer(e.layer, layerName);
    }
  });

  // 监听图层移除事件
  props.map.on("layerremove", function (e) {
    if (e.layer.options.overlay) {
      layerControl.removeLayer(e.layer);
    }
  });
});

onBeforeUnmount(() => {
  if (props.map) {
    // console.log(map);
    // props.map.off();
  }
});
</script>

<style lang="scss" scoped>
.control {
  width: 120px;
  position: absolute;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  z-index: 900;
  background-color: #fff;
}
.topleft {
  top: 0%;
  left: 0%;
  margin-top: 10px;
  margin-left: 10px;
}
.topright {
  top: 0%;
  right: 0%;
  margin-top: 10px;
  margin-right: 10px;
}
.bottomright {
  bottom: 0%;
  right: 0%;
  margin-bottom: 10px;
  margin-right: 10px;
}
.bottomleft {
  bottom: 0%;
  left: 0%;
  margin-bottom: 10px;
  margin-left: 10px;
}
.base-box {
  padding: 5px;
  border-bottom: 1px solid #eee;
  .box {
    display: flex;
    flex-wrap: nowrap;
    padding: 0 10px;
    height: 16px;
    margin-bottom: 8px;
    align-items: center;
    border-radius: 4px;
    .label {
      height: 20px;
      line-height: 20px;
      flex: 1;
      margin-right: 10px;
      margin-left: 6px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
