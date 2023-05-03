<!--
 * @Author: Faith
 * @Date: 2023-03-31 09:32
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-26 09:52
 * @Description: 
-->
<template>
  <div class="control" :class="position">
    <div class="switch" @click="collapsed = !collapsed">
      <i></i>
    </div>
    <div class="layer-panel" :class="collapsed ? 'collapsed' : 'expand'">
      <div class="base-box">
        <div
          class="box"
          v-for="(item, index) in props.baseLayers"
          :key="item.key"
        >
          <input
            type="radio"
            :name="item.name"
            id=""
            :checked="item.checked"
            @click.stop="baseLayerChange($event, item)"
          />
          <span class="label">{{ item.name }}</span>
        </div>
      </div>
      <div class="base-box" v-if="overLayers.length !== 0">
        <div class="box" v-for="(item, index) in overLayers" :key="item.key">
          <input
            type="radio"
            :name="item.name"
            id=""
            :checked="item.checked"
            @click.stop="overLayerChange($event, item)"
          />
          <span class="label">{{ item.name }}</span>
        </div>
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
  defineComponent,
  toRef,
  watch
} from "vue";
import initLayer from "./TileLayer";
import { HeatMapLayer, TiandituTileLayer } from "@supermap/iclient-leaflet";
import type { PropType } from "vue";
import L, { map } from "leaflet";

type position = "topleft" | "topright" | "bottomright" | "bottomleft";

const collapsed = ref(true);
const props = defineProps({
  map: {
    type: L.Map,
    default: null
  },
  position: {
    type: String as PropType<position>,
    default: "topright"
  },
  baseLayers: {
    type: Array<{
      checked: boolean;
      key: number;
      name: string;
      layer: L.Layer;
    }>,
    default: () => []
  },
  overLayers: {
    type: Array<{
      checked: boolean;
      key: number;
      name: string;
      layer: L.Layer;
    }>,
    default: () => []
  }
});

const emit = defineEmits([
  "layerControl",
  "update:baseLayer",
  "update:overLayer"
]);

function baseLayerChange(e, item) {
  const k = item.name;
  emit("update:baseLayer", k);
  // baseLayers.value
}
function overLayerChange(e, item) {
  const k = item.name;
  emit("update:overLayer", item);
  // baseLayers.value
}

onMounted(() => {
  nextTick(() => {
    if (!props.map) return;
    const { BASEMAPLAYER } = window.BASE_CONFIG;
    // const l =
    //   props.baseLayers.length === 0
    //     ? initLayer(props.map, baseMapLayer)
    //     : initLayer(props.map, props.baseLayers);
    // const bLayers = initLayer(props.map, props.baseLayers);
    // baseLayer.value = Object.keys(bLayers).map(k => {
    //   // console.log(L.Util.stamp(bLayers[k]));
    //   return {
    //     checked: false,
    //     key: L.Util.stamp(bLayers[k]).toString(),
    //     name: k,
    //     layer: bLayers[k]
    //   };
    // });
    // console.log(bLayers);
    // props.map.addLayer(bLayers[Object.keys(bLayers)[1]]);
    // const baselayer = {
    //   中国地图: l
    // };
    // const layerControl = L.control.layers(
    //   bLayers,
    //   {},
    //   {
    //     collapsed: false
    //   }
    // );
    // // .addTo(props.map);
    // console.log(layerControl);
    // emit("layerControl", layerControl);
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
  position: absolute;
  color: black;
  z-index: 900;
  cursor: auto;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.switch {
  height: 32px;
  padding: 5px;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0 rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  background: #fff;
  i {
    display: block;
    width: 22px;
    height: 22px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1YmQ5ZjE2ZC0wYjUzLTQ0NDItOTk3YS1jMjRhZjEyNDcyYmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzQ2QTQxQTcxQTMxMTFFOUE4NkVDODg0M0E2MjU0OUIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ2QTQxQTYxQTMxMTFFOUE4NkVDODg0M0E2MjU0OUIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NWJkOWYxNmQtMGI1My00NDQyLTk5N2EtYzI0YWYxMjQ3MmJlIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjViZDlmMTZkLTBiNTMtNDQ0Mi05OTdhLWMyNGFmMTI0NzJiZSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po4h5mAAAAOGSURBVHjajFVLaFNREJ25SZUgWK2NGz8LF7b+qEVBUNGNImpJo/jBL6gbF4pVBFFbQbSGgogLwZUgtChqXaS1uhBFXAQURF2ItVg3KkjTtDUooknueOZ94mubtj4Iee/emXPnzJyZyzTGc/FhegbneLswbSShWcRS42wIvyWmryz0SMrkXuOmaKaUP49cePMhPenBB24AwmkmnkbjPEIyBIhEXZVcXVoV/TMmsBsldRHzCsdR6BUskszyQL+tmLVG7EdhXgjHQ1ia754gL6SMNgejLwJfSvbNtsQpZp7jRZPH5sGzsWhrqWgdZt18HpZ71EdEPhuSlWfqZ37R/bBv1NVN7R5oD35zkIYIIvsZBGvuSO/L2fDmEOWvd75HVIYG8zacCnN+gwtO7cBao2kx6uDkVOkLZSyZAw5t4uNSsBlNj35f6Mg0iPDBMlOIGaYWY/gZGLXge2exFsBw64PXk60DU6dPtZ+QlBk5G7oTX5Df39VDi9hKWmkpsORDVUx2NewnQw3H1HacimYGs2ZeeHp5oR74jqGejhPfNcYqL/h2Q5lQblq53eUVC+mRvC6zcKHkAVhDoLuNEG8LLPcImSfKwl8oL6fF+JuLfO8VomuIqA3ez6Hv21j/VTJoaD+MSKp9ClZoU1O8ojdoZLjwC5bVkFQC4NC2TMFyI+xXIbpI6XRIbRiymsmqOpbjTfXR3lE2VnVMjgRZ5L5yRfWfYScC8E4U7Ae8j6jmYbfMrSFXGh/AWk75CghqVY1GpZGlAn9PhrKhY6jHUWj4ZmN95XKk6pzXA7+hHO5zKcuCkX2veoT81sF0vyrmX+FpIaJ7enlfRdYpMA5wGZmXbv24D8Wjbi+Mu83J/n78DgfBm2IVKe2+slC+JSCptmBH+gcI2xrv4G5ELO3efsSRD9OVix39yebOdO0w+tB14OtbczJdV0LDO9zI6ZEZ/B5KulOq+ERQjJgtcDboo82i80AlNpQ1CcuhgWEDrDOzVYunWGiQW8alwYnhB9O5pnjlKIWQMQ0kZov6aIqKM0TZib3hsUnoPgcmVco/0Ygs8afURI+jpBy99obQq7pqWVkcQu6LjStVHSg6PpXaRKBOnougOjZt3B/4wwa9zmS0ePuIQX8Xun3sF08MRzHl1qNZtvp2Oughgm1BlmNdTadgfeI/r6YruJpaxr2axrtM/Xb1WEx4mf4VYAAHMsDQlBRAoQAAAABJRU5ErkJggg==);
  }
}
.collapsed {
  display: none;
}
.expand {
  display: block;
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
.layer-panel {
  margin: 0 10px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background-color: #fff;
  .base-box {
    padding: 5px;
    border-bottom: 1px solid #e1e1e1;

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
}
</style>
