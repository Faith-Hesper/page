<template>
  <div>
    <div class="title">{{ route.query.title }}</div>
    <div class="main">
      <nearPanel :quake-m="3" />
      <nearPanel :quake-m="5" />
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
import nearPanel from "./nearPanel.vue";

import {
  earthquake,
  speedsearch,
  statisticsTimes,
  quickQuake,
  surrounding
} from "@/api/map";

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

onMounted(() => {
  nextTick(async () => {});
});

function defineOptions(arg0: { name: string }) {
  throw new Error("Function not implemented.");
}
</script>

<style lang="scss" scoped>
.title {
  display: block;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: var(--el-text-color-primary);
}
.main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  color: var(--el-text-color-primary);
  height: 100%;
}
</style>
