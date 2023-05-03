<template>
  <div class="search">
    <ElIcon class="searchIcon" @click="collopased = !collopased">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path
          d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
        ></path>
      </svg>
    </ElIcon>
    <ElAutocomplete
      :style="{ display: collopased ? 'none' : 'block' }"
      v-model="geoName"
      class="inline-input w-50 expand"
      highlight-first-item
      :fetch-suggestions="querySearchAsync"
      placeholder="Please input"
      @select="handleSelect"
    >
      <template #suffix>
        <ElIcon>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
          >
            <path
              d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
            ></path>
          </svg>
        </ElIcon>
      </template>
      <template #default="{ item }">
        <div class="value">{{ item.value }}</div>
        <span class="link">{{ item.link }}</span>
      </template>
    </ElAutocomplete>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { gaodeTip, gaodePoi, tiandiSearchGeo } from "@/api/map";

const geoName = ref("");
const collopased = ref(true);
interface LinkItem {
  value: string;
  link: string;
}

const geoTips = ref<LinkItem[]>([]);

const emit = defineEmits(["geoInfo"]);

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  tiandiSearchGeo({ keyWord: queryString })
    .then(res => {
      const { suggests } = res;
      console.log(res);
      const results = suggests.map(item => {
        return { value: item.name, data: item };
      });
      cb(results);
    })
    .catch(res => {
      cb([]);
    });
  // gaodeTip(queryString).then(res => {
  //   const { count, tips } = res;
  //   const results = tips.map(item => {
  //     return { value: item.name, data: item };
  //   });
  //   cb(results);
  // });
};

const handleSelect = async (item: LinkItem) => {
  const data = await tiandiSearchGeo({ keyWord: item.value, queryType: 7 });
  emit("geoInfo", data);
  // console.log(data);
};
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 2px solid rgba(0, 0, 0, 0.2);
  cursor: auto;
  margin: 10px;
  background: #fff;
  transition: all 1.3s ease;

  .searchIcon {
    width: 30px;
    height: 30px;
    color: black;
    cursor: pointer;
  }
  .expand {
    width: 0;
  }
}
</style>
