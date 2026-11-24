<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="placeholder-card">
    <el-tag type="info" effect="light">跑腿服务 · 成员 6（需登录）</el-tag>
    <h1 class="placeholder-title">发布跑腿</h1>
    <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
    <div class="placeholder-links">
      <router-link to="/errands"><el-button>返回任务大厅</el-button></router-link>
      <router-link to="/"><el-button plain>返回首页</el-button></router-link>
    </div>
  </section>
</template>

<style scoped>
.placeholder-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 28px;
  background: var(--ct-bg-surface);
  border: 1px solid var(--ct-border-color);
  border-radius: var(--ct-radius-lg);
  box-shadow: var(--ct-shadow-sm);
}
.placeholder-title {
  margin: 14px 0 8px;
  font-size: var(--ct-font-size-2xl);
}
.placeholder-meta {
  margin: 6px 0;
  color: var(--ct-text-regular);
}
.placeholder-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
</style>
