<template>
  <div id="mapId" style="position: relative; width: 100%; height: 100%"></div>
</template>

<script setup>
  import { computed, onMounted, onUpdated, ref, shallowReactive } from "vue"
  import mapObject, { mapControl } from "@/utils/map"
  import { sqlQuery, buffer_Analysis } from "@/utils/analysis"

  onMounted(async () => {
    // console.log(props.mapId);
    // map(props.mapId)
    let maps = await mapObject("mapId")
    await mapControl(maps)
  })

  onUpdated(() => {
    // L.geoJSON(props.sqlResultLayer).addTo(maps.map)
  })
  computed(() => {})
</script>

<style scoped>
  .el-main {
    padding: 0;
    border-right: none;
  }
</style>
