<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="placeholder-page">
    <div class="ct-container">
      <section class="placeholder-card">
        <el-tag type="danger" effect="light">后台管理 · 成员 6（仅管理员）</el-tag>
        <h1 class="placeholder-title">后台管理控制台</h1>
        <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
        <nav class="placeholder-links">
          <router-link to="/admin/users"><el-button plain>用户管理</el-button></router-link>
          <router-link to="/admin/products"><el-button plain>商品管理</el-button></router-link>
          <router-link to="/admin/lost-found"><el-button plain>失物管理</el-button></router-link>
          <router-link to="/admin/errands"><el-button plain>跑腿管理</el-button></router-link>
          <router-link to="/"><el-button>返回前台首页</el-button></router-link>
        </nav>
        <div class="admin-child-slot">
          <router-view />
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
  max-width: 900px;
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
  margin: 18px 0 24px;
}
.admin-child-slot {
  padding-top: 20px;
  border-top: 1px solid var(--ct-border-color);
}
</style>
