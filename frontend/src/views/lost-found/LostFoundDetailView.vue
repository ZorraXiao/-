<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="placeholder-page">
    <div class="ct-container">
      <section class="placeholder-card">
        <el-tag type="warning" effect="light">失物招领 · 成员 5</el-tag>
        <h1 class="placeholder-title">失物 / 寻物信息详情</h1>
        <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
        <p class="placeholder-meta">信息 ID：<code>{{ route.params.id }}</code></p>
        <div class="placeholder-links">
          <router-link to="/lost-found"><el-button>返回信息大厅</el-button></router-link>
          <router-link to="/lost-found/create"><el-button type="primary" plain>发布失物 / 寻物</el-button></router-link>
          <router-link to="/"><el-button plain>返回首页</el-button></router-link>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.placeholder-page {
  min-height: 100vh;
  padding: 48px 0;
}
.placeholder-card {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px;
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
