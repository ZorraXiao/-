<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="placeholder-page">
    <div class="ct-container">
      <section class="placeholder-card">
        <el-tag type="primary" effect="light">个人中心 · 成员 6（需登录）</el-tag>
        <h1 class="placeholder-title">我的接单任务</h1>
        <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
        <!-- 预留后续按 R6 兼容调整为“我的跑腿”（含“我发布的”与“我接取的”两个视角） -->
        <el-empty description="当前尚未接取跑腿任务" />
        <div class="placeholder-links">
          <router-link to="/profile"><el-button>返回个人中心</el-button></router-link>
          <router-link to="/errands"><el-button type="primary" plain>去任务大厅看看</el-button></router-link>
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
  max-width: 760px;
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
