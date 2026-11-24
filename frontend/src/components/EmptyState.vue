<script setup>
defineProps({
  description: {
    type: String,
    default: '暂无数据',
  },
  imageSize: {
    type: Number,
    default: 120,
  },
})
</script>

<template>
  <div class="ct-empty-state">
    <el-empty :description="description" :image-size="imageSize">
      <slot />
    </el-empty>
  </div>
</template>

<style scoped>
.ct-empty-state {
  padding: 24px 0;
}
</style>
