<template>
  <div v-drag:[props.draggable]="true" class="draggable">
    <div class="dialog-content">
      <div class="header dialog-header">
        <div class="title">{{ props.title }}</div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    background-color: #fff;
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
  }
}
</style>
