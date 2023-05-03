<template>
  <div class="title">{{ props.title }}</div>
  <div class="detail">
    <p v-for="t in props.list">{{ t }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  list: []
});
</script>
