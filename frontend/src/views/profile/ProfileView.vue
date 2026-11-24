<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="placeholder-card">
    <el-tag type="primary" effect="light">个人中心 · 成员 6（需登录）</el-tag>
    <h1 class="placeholder-title">个人中心</h1>
    <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
    <div class="placeholder-links">
      <el-button type="primary" plain disabled>编辑资料（预留弹窗触发位）</el-button>
      <router-link to="/profile/posts"><el-button>我的发布</el-button></router-link>
      <router-link to="/profile/errands"><el-button>我的接单任务</el-button></router-link>
      <el-button type="danger" plain disabled>退出登录（预留入口）</el-button>
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
