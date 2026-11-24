<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="admin-subpage">
    <h2>用户管理</h2>
    <p>所属模块：后台管理 · 成员 6（预留用户列表与封禁/解封操作）</p>
    <p>当前路径：<code>{{ route.fullPath }}</code></p>
  </section>
</template>

<style scoped>
.admin-subpage h2 {
  margin: 0 0 8px;
  font-size: var(--ct-font-size-xl);
}
.admin-subpage p {
  margin: 4px 0;
  color: var(--ct-text-regular);
}
</style>
