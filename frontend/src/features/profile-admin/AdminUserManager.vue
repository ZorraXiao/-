<script setup>
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import AppPagination from '@/components/AppPagination.vue'
import DemoNotice from './DemoNotice.vue'
import { profileAdminApi } from './api'
import { useProfileAdminList, useProfileAdminAction } from './useProfileAdmin'
import { formatUtcToLocal } from '@/utils/format'
const { items, total, page, pageSize, keyword, active, loading, error, refresh } = useProfileAdminList(profileAdminApi.listUsers)
const { pending, perform } = useProfileAdminAction()
function toggle(row) {
  const banned = row.is_active
  perform({ id: row.id, label: banned ? '封禁' : '解封', reason: banned,
    description: banned ? `封禁后，${row.nickname}将无法执行登录及业务操作。请填写原因。` : `确认解除${row.nickname}的账号封禁？`,
    execute: payload => profileAdminApi.setBan(row.id, banned, payload), refresh })
}
</script>
<template>
  <div class="ct-page">
    <PageHeader title="用户管理" description="查询校园账号，管理封禁状态。" /><DemoNotice />
    <section class="ct-panel">
      <div class="ct-panel__header pa-filter">
        <el-input v-model="keyword" clearable maxlength="100" aria-label="搜索用户" placeholder="搜索昵称、用户名或手机号" class="pa-search" />
        <el-select v-model="active" clearable placeholder="全部账号状态" aria-label="筛选账号状态" class="pa-select"><el-option label="正常" value="true" /><el-option label="已封禁" value="false" /></el-select>
        <el-button :disabled="loading" @click="refresh">刷新</el-button><span class="pa-count">共 {{ total }} 位用户</span>
      </div>
      <div v-if="error" class="pa-error" role="alert"><p>{{ error }}</p><el-button @click="refresh">重新加载</el-button></div>
      <div v-else v-loading="loading" class="pa-table-scroll">
        <el-table :data="items" row-key="id" style="width: 100%">
          <el-table-column label="用户" min-width="190"><template #default="{ row }"><p class="pa-record__title">{{ row.nickname }}</p><p class="pa-muted">#{{ row.id }} · @{{ row.username }}</p></template></el-table-column>
          <el-table-column prop="phone" label="手机号" width="140" />
          <el-table-column label="角色" width="100"><template #default="{ row }">{{ row.role === 'admin' ? '管理员' : '普通用户' }}</template></el-table-column>
          <el-table-column label="注册时间" width="170"><template #default="{ row }"><span class="pa-time">{{ formatUtcToLocal(row.created_at) }}</span></template></el-table-column>
          <el-table-column label="账号状态" width="110"><template #default="{ row }"><el-tooltip :disabled="!row.banned_reason" :content="row.banned_reason || ''"><span :class="['pa-account-state', { 'is-banned': !row.is_active }]">{{ row.is_active ? '正常' : '已封禁' }}</span></el-tooltip></template></el-table-column>
          <el-table-column label="操作" width="110" align="right"><template #default="{ row }"><el-button link :type="row.is_active ? 'danger' : 'primary'" :disabled="row.role === 'admin' || Boolean(pending)" :loading="pending === row.id" @click="toggle(row)">{{ row.is_active ? '封禁' : '解封' }}</el-button></template></el-table-column>
          <template #empty><EmptyState description="没有匹配的用户" /></template>
        </el-table>
      </div>
      <div class="ct-panel__footer"><AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" /></div>
    </section>
  </div>
</template>
