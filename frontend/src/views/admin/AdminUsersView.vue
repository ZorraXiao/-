<script setup>
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="ct-page">
    <PageHeader
      title="用户管理"
      description="查看平台注册用户，处理违规账号的封禁与解封。"
    />

    <div class="ct-panel admin-table-panel">
      <el-table :data="[]" style="width: 100%">
        <el-table-column label="用户" min-width="180" />
        <el-table-column label="手机号" width="140" />
        <el-table-column label="注册时间" width="170" />
        <el-table-column label="账号状态" width="120" />
        <el-table-column label="操作" width="140" align="right" />
        <template #empty>
          <EmptyState description="暂无用户数据" :image-size="100" />
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
