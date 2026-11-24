<script setup>
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="ct-page profile-page">
    <PageHeader
      :back="{ to: '/profile', label: '个人中心' }"
      title="我的接单任务"
      description="查看你接取的跑腿任务及其进度。"
    />

    <!-- 预留后续按 R6 兼容调整为“我的跑腿”（含“我发布的”与“我接取的”两个视角） -->
    <section class="ct-panel">
      <div class="ct-panel__body">
        <EmptyState description="你还没有接取跑腿任务">
          <router-link to="/errands">
            <el-button type="primary">去任务大厅看看</el-button>
          </router-link>
        </EmptyState>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 760px;
  margin: 0 auto;
}
</style>
