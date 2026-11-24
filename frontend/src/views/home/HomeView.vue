<script setup>
import { useRoute } from 'vue-router'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
</script>

<template>
  <div class="home-placeholder">
    <section class="placeholder-card">
      <el-tag type="primary" effect="light">公共与首页 · 成员 3</el-tag>
      <h1 class="placeholder-title">校园交易平台 · 首页</h1>
      <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
      <p class="placeholder-desc">
        平台集成二手交易、失物招领与校园跑腿三大核心服务，以下为快速入口与公共状态标签组件演示：
      </p>

      <div class="placeholder-links">
        <router-link to="/products"><el-button type="primary">二手交易大厅</el-button></router-link>
        <router-link to="/lost-found"><el-button type="primary" plain>失物招领大厅</el-button></router-link>
        <router-link to="/errands"><el-button type="primary" plain>跑腿服务大厅</el-button></router-link>
        <router-link to="/profile"><el-button>个人中心</el-button></router-link>
        <router-link to="/login"><el-button>登录 / 注册</el-button></router-link>
        <router-link to="/admin"><el-button type="warning" plain>后台管理</el-button></router-link>
      </div>

      <div class="status-demo">
        <span class="status-demo__label">公共组件 StatusTag 预览：</span>
        <StatusTag type="product" status="on_sale" />
        <StatusTag type="lost_found" status="searching" />
        <StatusTag type="lost_found" status="unclaimed" />
        <StatusTag type="errand" status="pending" />
        <StatusTag type="errand" status="in_progress" />
        <StatusTag type="errand" status="pending_confirm" />
        <StatusTag type="errand" status="completed" />
        <StatusTag type="moderation" status="taken_down" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.placeholder-card {
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

.status-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--ct-border-color-light);
}

.status-demo__label {
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
}
</style>
