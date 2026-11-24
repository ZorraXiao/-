<script setup>
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
</script>

<template>
  <div class="ct-page">
    <PageHeader
      title="跑腿管理"
      description="巡查跑腿任务，处理违规或异常订单。"
    >
      <template #actions>
        <div class="ct-legend">
          <StatusTag type="moderation" status="normal" size="small" />
          <StatusTag type="moderation" status="taken_down" size="small" />
        </div>
      </template>
    </PageHeader>

    <div class="ct-panel admin-table-panel">
      <el-table :data="[]" style="width: 100%">
        <el-table-column label="任务" min-width="200" />
        <el-table-column label="发布者" width="140" />
        <el-table-column label="酬劳" width="110" />
        <el-table-column label="状态" width="110" />
        <el-table-column label="治理状态" width="120" />
        <el-table-column label="操作" width="150" align="right" />
        <template #empty>
          <EmptyState description="暂无跑腿任务" :image-size="100" />
        </template>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.admin-table-panel {
  overflow: hidden;
}

:deep(.el-table__empty-text) {
  width: 100%;
  line-height: var(--ct-line-height-base);
}
</style>
