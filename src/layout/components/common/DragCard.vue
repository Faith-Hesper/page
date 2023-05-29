<template>
  <div v-drag:[draggable]="true" class="draggable">
    <div
      class="toggle-icon"
      @click="toggleDialog"
      :title="showContent ? '隐藏' : title"
    >
      <IconifyIconOnline
        icon="ant-design:cloud-filled"
        style="color: #000; width: 24px; height: 24px"
      ></IconifyIconOnline>
    </div>
    <div class="dialog-content" :class="{ hidden: !showContent }">
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
  data() {
    return {
      showContent: true
    };
  },
  methods: {
    toggleDialog() {
      this.showContent = !this.showContent;
    }
  },
  setup(props) {}
};
</script>

<style lang="scss" scoped>
.draggable {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;

  .toggle-icon {
    position: absolute;
    display: block;
    cursor: pointer;
    background: #fff;
    width: 32px;
    height: 32px;
    padding: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0 rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    z-index: 5;
  }

  .hidden {
    opacity: 0;
    display: none;
  }

  .dialog-content {
    position: fixed;
    border-radius: 4px;
    // box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    // border: 1px solid #e4e7ed;
    background-color: var(--el-bg-color);
    overflow: hidden;
    z-index: 5;
    opacity: 1;
    transition: opacity 0.8s ease-in-out;

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
