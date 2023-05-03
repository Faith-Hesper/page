<template>
  <div v-drag:[draggable]="true" class="draggable">
    <div class="dialog-content">
      <div class="header dialog-header" v-if="title">
        <div class="title">{{ title }}</div>
      </div>
      <div class="dialog-header" v-else>
        <slot name="header"></slot>
      </div>
      <div class="detail">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
// import { ref } from "vue"

const props = defineProps({
  title: {
    type: String,
    default: "工具栏"
  },
  draggable: {
    type: Boolean,
    default: true
  }
});
</script> -->

<script lang="ts">
import { CSSProperties, computed } from "vue";
export default {
  name: "DragCard",
  props: {
    title: {
      type: String
    },
    draggable: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {}
};
</script>

<style lang="scss" scoped>
.draggable {
  width: 100%;
  height: 100%;
  .dialog-content {
    position: fixed;
    border-radius: 4px;
    // box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    // border: 1px solid #e4e7ed;
    background-color: var(--el-bg-color);
    overflow: hidden;
    z-index: 5;
    .header {
      width: 100%;
      height: 30px;
      background: #428bca;
      margin-bottom: 2px;
      .title {
        font-size: 16px;
        line-height: 30px;
        letter-spacing: 2px;
        color: white;
      }
    }
    .detail {
      padding: 5px;
    }
  }
}
</style>
