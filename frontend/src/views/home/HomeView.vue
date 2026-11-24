<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="placeholder-page">
    <div class="ct-container">
      <section class="placeholder-card">
        <el-tag type="primary" effect="light">公共与首页 · 成员 3</el-tag>
        <h1 class="placeholder-title">校园交易平台 · 首页</h1>
        <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
        <p class="placeholder-desc">以下为三大核心业务大厅及个人中心、登录页的路由跳转测试入口：</p>
        <div class="placeholder-links">
          <router-link to="/products"><el-button type="primary">二手交易大厅</el-button></router-link>
          <router-link to="/lost-found"><el-button type="primary" plain>失物招领大厅</el-button></router-link>
          <router-link to="/errands"><el-button type="primary" plain>跑腿服务大厅</el-button></router-link>
          <router-link to="/profile"><el-button>个人中心</el-button></router-link>
          <router-link to="/login"><el-button>登录 / 注册</el-button></router-link>
          <router-link to="/admin"><el-button type="warning" plain>后台管理</el-button></router-link>
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
.placeholder-meta,
.placeholder-desc {
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
