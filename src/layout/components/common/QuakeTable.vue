<template>
  <el-table
    :data="props.tableData"
    :max-height="props.maxHeight"
    :header-cell-style="{
      // textAlign: 'center',
      // background: '#E4EEF6',
      height: '21px'
    }"
  >
    <el-table-column
      prop="class"
      label="震级"
      sortable
      :filter-method="(value, row) => row.class >= value"
      :filters="[
        { text: '≥4', value: 4 },
        { text: '≥6', value: 6 },
        { text: '≥8', value: 8 }
      ]"
    ></el-table-column>
    <el-table-column prop="date" label="地震时间" sortable></el-table-column>
    <el-table-column prop="lat" label="纬度"></el-table-column>
    <el-table-column prop="lng" label="经度"></el-table-column>
    <el-table-column prop="depth" label="深度/km" sortable></el-table-column>
    <el-table-column label="参考位置">
      <template #default="scope">
        <el-tag
          class="location-cell"
          type="success"
          @click="props.rowFn(scope.row)"
          >{{ scope.row.location }}</el-tag
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount, ref, type Ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const props = defineProps({
  maxHeight: {
    default: 400
  },
  tableData: {
    default: [
      {
        class: "1",
        date: "2023/3/21",
        lat: 0,
        lng: 0,
        depth: "1",
        location: "1"
      }
    ]
  },
  rowFn: {
    type: Function,
    default: () => {}
  }
});
</script>

<style scoped>
.location-cell:hover {
  cursor: pointer;
  color: #5e94fa;
}
</style>
