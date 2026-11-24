<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <main class="not-found">
    <p class="ct-mono not-found__code">404</p>
    <h1 class="not-found__title">页面不存在</h1>
    <p class="not-found__desc">
      你访问的地址 <code>{{ route.fullPath }}</code> 不存在或已被移除。
    </p>
    <div class="not-found__actions">
      <router-link to="/">
        <el-button type="primary">返回首页</el-button>
      </router-link>
      <el-button @click="router.back()">返回上一页</el-button>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: var(--ct-bg-canvas);
}

.not-found__code {
  font-size: 64px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: var(--ct-tracking-tight);
  color: var(--ct-border-strong);
}

.not-found__title {
  margin-top: 16px;
  font-size: var(--ct-font-size-2xl);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.not-found__desc {
  margin-top: 8px;
  max-width: 480px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.not-found__actions {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
</style>
