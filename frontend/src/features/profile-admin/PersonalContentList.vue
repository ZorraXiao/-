<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppPagination from '@/components/AppPagination.vue'
import EmptyState from '@/components/EmptyState.vue'
import StatusTag from '@/components/StatusTag.vue'
import { profileAdminApi } from './api'
import { CONTENT, availableAction, detailPath, titleOf } from './model'
import { useProfileAdminAction, useProfileAdminList } from './useProfileAdmin'
import { formatCentsToYuan, formatUtcToLocal } from '@/utils/format'
const props = defineProps({ kind: { type: String, required: true }, participation: { type: String, default: 'published' } })
const auth = useAuthStore(), meta = computed(() => CONTENT[props.kind])
const { items, total, page, pageSize, keyword, status, loading, error, refresh } = useProfileAdminList(
  params => profileAdminApi.listMine(props.kind, { ...params, ...(props.kind === 'errands' ? { participation: props.participation } : {}) }),
  () => `${props.kind}:${props.participation}:${auth.userInfo?.id}`,
)
const { pending, perform } = useProfileAdminAction()
const actionFor = row => availableAction(props.kind, row, auth.userInfo?.id)
function act(row) {
  const action = actionFor(row)
  if (action) perform({ id: row.id, label: action.label, description: action.confirm,
    execute: () => profileAdminApi.act(props.kind, row.id, action.key), refresh })
}
</script>
<template>
  <section class="ct-panel pa-list-panel">
    <div class="ct-panel__header pa-filter">
      <el-input v-model="keyword" :aria-label="`搜索我的${meta.title}`" clearable maxlength="100" placeholder="输入关键词搜索" class="pa-search" />
      <el-select v-model="status" aria-label="筛选状态" clearable placeholder="全部状态" class="pa-select">
        <el-option v-for="(label, value) in meta.statuses" :key="value" :label="label" :value="value" />
      </el-select>
      <el-button :disabled="loading" @click="refresh">刷新</el-button><span class="pa-count">共 {{ total }} 条</span>
    </div>
    <div v-if="error" class="pa-error" role="alert"><p>{{ error }}</p><el-button @click="refresh">重新加载</el-button></div>
    <div v-else v-loading="loading" class="pa-table-scroll">
      <el-table :data="items" row-key="id" style="width: 100%" aria-label="我的记录">
        <el-table-column :label="meta.title" min-width="280"><template #default="{ row }">
          <div class="pa-record">
            <img v-if="kind === 'products'" class="pa-thumb" :src="row.cover_url || '/illustrations/campus-desk-books.jpg'" alt="" />
            <div class="pa-record__body"><p class="pa-record__title">{{ titleOf(row) }}</p>
              <p class="pa-muted">{{ kind === 'lost-found' ? `${row.item_type === 'lost' ? '寻物启事' : '拾物招领'} · ${row.location}` : kind === 'errands' ? row.item_desc : row.category_name || '闲置物品' }}</p>
            </div>
          </div>
        </template></el-table-column>
        <el-table-column v-if="kind !== 'lost-found'" :label="kind === 'products' ? '价格' : '跑腿费'" width="110"><template #default="{ row }">
          <span class="ct-mono">¥ {{ formatCentsToYuan(row.price_cents ?? row.fee_cents) }}</span>
        </template></el-table-column>
        <el-table-column label="状态" width="130"><template #default="{ row }">
          <StatusTag :type="meta.tag" :status="row.status" size="small" />
          <p v-if="row.moderation_status === 'taken_down'" class="pa-state-note"><el-tooltip :content="row.taken_down_reason || '请联系管理员'"><span>已违规下架</span></el-tooltip></p>
        </template></el-table-column>
        <el-table-column :label="participation === 'accepted' ? '接单时间' : '发布时间'" width="170"><template #default="{ row }">
          <span class="pa-time">{{ formatUtcToLocal(participation === 'accepted' ? row.accepted_at : row.created_at) }}</span>
          <p v-if="participation === 'accepted'" class="pa-muted">发布人：{{ row.publisher_nickname }}</p>
        </template></el-table-column>
        <el-table-column label="操作" width="180" align="right"><template #default="{ row }">
          <div class="pa-row-actions">
            <router-link :to="{ path: detailPath(kind, row.id), query: { from: participation } }"><el-button link type="primary">查看</el-button></router-link>
            <el-button v-if="actionFor(row)" link type="primary" :loading="pending === row.id" :disabled="Boolean(pending)" @click="act(row)">{{ actionFor(row).label }}</el-button>
          </div>
        </template></el-table-column>
        <template #empty><EmptyState :description="keyword || status ? '没有匹配的记录，试试其他筛选条件' : participation === 'accepted' ? '当前尚未接取跑腿任务' : `你还没有发布${meta.title}`">
          <router-link :to="participation === 'accepted' ? '/errands' : meta.create"><el-button>{{ participation === 'accepted' ? '去任务大厅看看' : '去发布' }}</el-button></router-link>
        </EmptyState></template>
      </el-table>
    </div>
    <div class="ct-panel__footer"><AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" /></div>
  </section>
</template>
