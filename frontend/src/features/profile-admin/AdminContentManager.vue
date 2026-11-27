<script setup>
import { computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import EmptyState from '@/components/EmptyState.vue'
import AppPagination from '@/components/AppPagination.vue'
import DemoNotice from './DemoNotice.vue'
import { profileAdminApi } from './api'
import { CONTENT, detailPath, titleOf } from './model'
import { useProfileAdminList, useProfileAdminAction } from './useProfileAdmin'
import { formatCentsToYuan, formatUtcToLocal } from '@/utils/format'
const props = defineProps({ kind: { type: String, required: true } })
const meta = computed(() => CONTENT[props.kind])
const { items, total, page, pageSize, keyword, status, moderation, loading, error, refresh } = useProfileAdminList(
  params => profileAdminApi.listAdmin(props.kind, params), () => props.kind,
)
const { pending, perform } = useProfileAdminAction()
function moderate(row, action) {
  const labels = { 'take-down': '违规下架', restore: '恢复下架内容', delete: '删除' }
  const descriptions = { 'take-down': '此内容将停止公开展示。请填写违规原因。',
    restore: '恢复此内容的正常展示资格。原有业务状态保持不变，卖家自行下架的商品仍为已下架。',
    delete: '删除后，这条内容将从相关列表移除，无法在界面恢复。请填写删除原因。' }
  perform({ id: row.id, label: labels[action], description: descriptions[action], reason: action !== 'restore',
    execute: payload => profileAdminApi.moderate(props.kind, row.id, action, payload), refresh })
}
</script>
<template>
  <div class="ct-page">
    <PageHeader :title="`${meta.title}管理`" description="巡查发布内容，处理违规信息，并保留操作记录。" />
    <DemoNotice />
    <section class="ct-panel">
      <div class="ct-panel__header pa-filter">
        <el-input v-model="keyword" clearable maxlength="100" aria-label="搜索内容" placeholder="搜索内容或发布者" class="pa-search" />
        <el-select v-model="status" clearable placeholder="业务状态" aria-label="筛选业务状态" class="pa-select"><el-option v-for="(label, key) in meta.statuses" :key="key" :value="key" :label="label" /></el-select>
        <el-select v-model="moderation" clearable placeholder="治理状态" aria-label="筛选治理状态" class="pa-select"><el-option value="normal" label="正常" /><el-option value="taken_down" label="违规下架" /></el-select>
        <el-button :disabled="loading" @click="refresh">刷新</el-button><span class="pa-count">共 {{ total }} 条</span>
      </div>
      <div v-if="error" class="pa-error" role="alert"><p>{{ error }}</p><el-button @click="refresh">重新加载</el-button></div>
      <div v-else v-loading="loading" class="pa-table-scroll">
        <el-table :data="items" row-key="id" style="width: 100%">
          <el-table-column :label="meta.title" min-width="240"><template #default="{ row }"><p class="pa-record__title">{{ titleOf(row) }}</p><p class="pa-muted">#{{ row.id }} · {{ formatUtcToLocal(row.created_at) }}</p></template></el-table-column>
          <el-table-column label="发布者" width="110"><template #default="{ row }">{{ row.publisher_nickname }}</template></el-table-column>
          <el-table-column v-if="kind !== 'lost-found'" :label="kind === 'products' ? '价格' : '酬劳'" width="100"><template #default="{ row }"><span class="ct-mono">¥ {{ formatCentsToYuan(row.price_cents ?? row.fee_cents) }}</span></template></el-table-column>
          <el-table-column label="业务状态" width="110"><template #default="{ row }"><StatusTag :type="meta.tag" :status="row.status" size="small" /></template></el-table-column>
          <el-table-column label="治理状态" width="115"><template #default="{ row }"><el-tooltip :disabled="!row.taken_down_reason" :content="row.taken_down_reason || ''"><StatusTag type="moderation" :status="row.moderation_status" size="small" /></el-tooltip></template></el-table-column>
          <el-table-column label="操作" width="245" align="right"><template #default="{ row }"><div class="pa-row-actions">
            <router-link :to="detailPath(kind, row.id, true)"><el-button link type="primary">查看</el-button></router-link>
            <el-button link type="primary" :disabled="Boolean(pending)" :loading="pending === row.id" @click="moderate(row, row.moderation_status === 'normal' ? 'take-down' : 'restore')">{{ row.moderation_status === 'normal' ? '违规下架' : '恢复' }}</el-button>
            <el-button link type="danger" :disabled="Boolean(pending)" @click="moderate(row, 'delete')">删除</el-button>
          </div></template></el-table-column>
          <template #empty><EmptyState :description="keyword || status || moderation ? '没有匹配的记录，试试其他筛选条件' : '暂无内容数据'" /></template>
        </el-table>
      </div>
      <div class="ct-panel__footer"><AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" /></div>
    </section>
  </div>
</template>
