<template>
  <div class="query-form">
    <DragCard title="地震查询">
      <el-form :model="form" label-position="left" label-width="auto">
        <el-form-item label="时间">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="纬度" inline="true">
          <el-row justify="space-between">
            <el-col :span="3">
              <span>大于</span>
            </el-col>
            <el-col :span="4">
              <el-input v-model="form.lat_gt"></el-input>
            </el-col>
            <el-col :span="3">
              <span>小于</span>
            </el-col>
            <el-col :span="4">
              <el-input v-model="form.lat_lt"></el-input>
            </el-col>
            <el-col :span="10">
              <span style="color: #999999; font-size: 0.6rem"
                >单位：度 范围:-90至90</span
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="经度" inline="true">
          <el-row justify="space-between">
            <el-col :span="3">
              <span>大于</span>
            </el-col>
            <el-col :span="4">
              <el-input v-model="form.lng_gt"></el-input>
            </el-col>
            <el-col :span="3">
              <span>小于</span>
            </el-col>
            <el-col :span="4">
              <el-input v-model="form.lng_lt"></el-input>
            </el-col>
            <el-col :span="10">
              <span style="color: #999999; font-size: 0.6rem"
                >单位：度 范围:-180至180</span
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="深度">
          <el-row justify="space-between">
            <el-col :span="3">
              <span>大于</span>
            </el-col>
            <el-col :span="6">
              <el-input v-model="form.depth_gt"></el-input>
            </el-col>
            <el-col :span="3">
              <span>小于</span>
            </el-col>
            <el-col :span="6">
              <el-input v-model="form.depth_lt"></el-input>
            </el-col>
            <el-col :span="5">
              <span style="color: #999999; font-size: 0.6rem">单位：千米</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="震级">
          <el-row justify="space-between">
            <el-col :span="3">
              <span>大于</span>
            </el-col>
            <el-col :span="6">
              <el-input v-model="form.class_gt"></el-input>
            </el-col>
            <el-col :span="3">
              <span>小于</span>
            </el-col>
            <el-col :span="6">
              <el-input v-model="form.class_lt"></el-input>
            </el-col>
            <el-col :span="5">
              <span style="color: #999999; font-size: 0.6rem">单位：级</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
        <!-- <el-button type="primary" @click="footerHide">{{ btnStatus }}</el-button> -->
      </el-form>
    </DragCard>
  </div>
</template>

<script setup>
import { getFieldsName } from "@/utils/mapAnalysis/analysis";
import { reactive, ref, onBeforeMount, computed } from "vue";
// import { useStore } from "vuex"
// const store = useStore()

const btnStatus = ref("显示");
// const status = computed(() => store.state.btn.formStatus)
const fields = ref([]);
const form = reactive({
  date: [],
  lng_gt: "",
  lng_lt: "",
  lat_gt: "",
  lat_lt: "",
  depth_gt: "",
  depth_lt: "",
  class_gt: "",
  class_lt: ""
});

const emit = defineEmits(["footer", "search"]);

// 获取字段名集合
getFieldsName().then(res => (fields.value = res));

// 格式化SQL查询参数
const sqlFilterParams = () => {
  let temp = "";
  if (form.date.length !== 0 || !form.date) {
    temp += `QUAKEDATE >= "${form.date[0]}  00:00:00" and `;
    temp += `QUAKEDATE < "${form.date[1]}  00:00:00" and `;
  }
  // if (form.date[1] !== null) {
  // }
  if (form.lng_gt !== "") {
    temp += `LNG >= "${form.lng_gt}" and `;
  }
  if (form.lng_lt !== "") {
    temp += `LNG < "${form.lng_lt}" and `;
  }
  if (form.lat_gt !== "") {
    temp += `LAT >= "${form.lat_gt}" and `;
  }
  if (form.lat_lt !== "") {
    temp += `LAT < "${form.lat_lt}" and `;
  }
  if (form.depth_gt !== "") {
    temp += `DEPTH >= "${form.depth_gt}" and `;
  }
  if (form.depth_lt !== "") {
    temp += `DEPTH < "${form.depth_lt}" and `;
  }
  if (form.class_gt !== "") {
    temp += `CLASS >= "${form.class_gt}" and `;
  }
  if (form.class_lt !== "") {
    temp += `CLASS < "${form.class_lt}" and `;
  }
  return (temp = temp.slice(0, -5));
};

const searchBtn = async () => {
  // sqlFilterParams
  emit("search", sqlFilterParams());
};

// const changeStatus = () => store.dispatch("btn/formStatusChange")
// 控制页脚显示与隐藏
const footerHide = () => {
  // changeStatus()
  // btnStatus.value = status.value == true ? "隐藏" : "显示"
  emit("footer", status.value);
};
</script>

<style scoped>
.query-form {
  position: absolute;
  top: 100px;
  right: 10px;
  text-align: center;
  z-index: 2;
  border-radius: 4px;
}
</style>
