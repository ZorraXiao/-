<script setup>
import { profileAdminMock } from './config'
</script>
<template>
  <div v-if="profileAdminMock" class="pa-demo-note" role="status">
    <span class="pa-demo-dot" />
    <span>本地演示 · 数据保存在当前浏览器</span>
  </div>
</template>
