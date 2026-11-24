<script setup>
import { Shop } from '@element-plus/icons-vue'
</script>

<template>
  <main class="init-page">
    <div class="ct-container">
      <section class="init-card">
        <div class="init-badge">
          <el-icon><Shop /></el-icon>
          <span>环境初始化完成</span>
        </div>
        <h1 class="init-title">校园交易平台 · 前端基础工程</h1>
        <p class="init-desc">
          Vue 3 + Vite（JavaScript）脚手架、主题 CSS 变量体系与开发代理已就绪，后续将按阶段接入路由、请求封装与业务页面。
        </p>
        <div class="init-actions">
          <el-tag type="primary" effect="light">Campus Blue 主题已启用</el-tag>
          <el-button type="primary" plain disabled>等待接入业务路由</el-button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.init-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 48px 0;
}

.init-card {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border-color);
  border-radius: var(--ct-radius-lg);
  box-shadow: var(--ct-shadow-sm);
}

.init-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  margin-bottom: 16px;
  font-size: var(--ct-font-size-xs);
  font-weight: 600;
  color: var(--ct-color-primary);
  background-color: var(--ct-color-primary-lighter);
  border-radius: var(--ct-radius-round);
}

.init-title {
  margin: 0 0 12px;
  font-size: var(--ct-font-size-2xl);
  color: var(--ct-text-primary);
}

.init-desc {
  margin: 0 0 24px;
  color: var(--ct-text-regular);
}

.init-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
