<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref('products')
</script>

<template>
  <section class="placeholder-card">
    <el-tag type="primary" effect="light">个人中心 · 成员 6（需登录）</el-tag>
    <h1 class="placeholder-title">我的发布</h1>
    <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>

    <el-tabs v-model="activeTab" class="placeholder-tabs">
      <el-tab-pane label="我的商品" name="products">
        <p class="placeholder-meta">预留“我的商品”列表与下架操作区。</p>
      </el-tab-pane>
      <el-tab-pane label="我的失物" name="lost-found">
        <p class="placeholder-meta">预留“我的失物”列表与完结操作区。</p>
      </el-tab-pane>
      <el-tab-pane label="我的跑腿" name="errands">
        <p class="placeholder-meta">预留“我的跑腿”列表与确认完成操作区。</p>
      </el-tab-pane>
    </el-tabs>

    <div class="placeholder-links">
      <router-link to="/profile"><el-button>返回个人中心</el-button></router-link>
      <router-link to="/"><el-button plain>返回首页</el-button></router-link>
    </div>
  </section>
</template>

<style scoped>
.placeholder-card {
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
.placeholder-tabs {
  margin-top: 16px;
}
.placeholder-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
</style>
