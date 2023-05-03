<script setup lang="ts">
import {
  onMounted,
  nextTick,
  reactive,
  ref,
  shallowReactive,
  watch
} from "vue";
import type { PropType } from "vue";

import L from "leaflet";
import { Feature, FeatureCollection, GeoJSON } from "geojson";

import { HeatMapLayer } from "@supermap/iclient-leaflet";

defineOptions({
  name: "HeatMap"
});

const props = defineProps({
  map: {
    type: L.Map,
    default: null
  },
  features: {
    type: Object as PropType<FeatureCollection>,
    default: null
  }
});
const heatMapLayer = ref(null);
const formData = reactive({
  radius: 50,
  blur: 25,
  opacity: 1
});

const emit = defineEmits(["update:heatMap"]);

function initHeatMap(
  name = "heatMap",
  colors = ["blue", "cyan", "lime", "yellow", "red"]
) {
  if (props.map) {
    heatMapLayer.value = new HeatMapLayer(name, {
      map: props.map,
      radius: formData.radius,
      blur: formData.blur,
      opacity: formData.opacity,
      featureWeight: "CLASS"
    });
    // heatMapLayer.value.addFeatures(props.features);
    // console.log(props.map);
    // heatMapLayer.value.addTo(props.map);
    emit("update:heatMap", heatMapLayer.value);
  }
}

onMounted(async () => {});

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<template>
  <div class="toolbar">
    <DragCard title="热力图分析">
      <el-form
        class="form"
        :model="formData"
        label-position="top"
        label-width="300px"
      >
        <el-form-item label="热力图点半径">
          <el-slider
            v-model="formData.radius"
            show-input
            size="small"
            input-size="small"
            :min="0"
            @input="initHeatMap"
          />
        </el-form-item>
        <el-form-item label="热力图模糊半径">
          <el-slider
            v-model="formData.blur"
            show-input
            size="small"
            input-size="small"
            :min="0"
            @input="initHeatMap"
          />
        </el-form-item>
        <el-form-item label="热力图透明度">
          <el-slider
            v-model="formData.opacity"
            show-input
            size="small"
            input-size="small"
            :min="0"
            :max="1"
            :step="0.1"
            @input="initHeatMap"
          />
        </el-form-item>
      </el-form>
    </DragCard>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  position: absolute;
  top: 350px;
  right: 10px;
  width: 300px;
  text-align: center;
  z-index: 2;
  border-radius: 4px;
}
.el-slider {
  width: 300px;
}
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.form {
  padding: 0 5px;
}
</style>
