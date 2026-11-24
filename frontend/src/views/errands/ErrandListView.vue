<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Plus } from 'lucide-vue-next'
import AppPagination from '@/components/AppPagination.vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'

const router = useRouter()

const keyword = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

function handleSearch() {
  page.value = 1
}
</script>

<template>
  <div class="ct-page">
    <PageHeader
      eyebrow="跑腿服务"
      title="任务大厅"
      description="取快递、带饭、代送文件，看看有没有顺路就能帮上的忙。"
    >
      <template #actions>
        <el-button type="primary" class="hall-btn" @click="router.push('/errands/create')">
          <Plus :size="15" :stroke-width="1.5" />
          <span>发布跑腿</span>
        </el-button>
      </template>
    </PageHeader>

    <SearchBar
      v-model="keyword"
      placeholder="搜索起点、终点或物品说明..."
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="statusFilter" clearable placeholder="全部状态" style="width: 140px">
          <el-option label="待接单" value="pending" />
          <el-option label="进行中" value="in_progress" />
        </el-select>
      </template>
    </SearchBar>

    <section class="ct-panel">
      <div class="ct-panel__header">
        <span class="ct-panel__title">全部任务</span>
        <div class="ct-legend">
          <StatusTag type="errand" status="pending" size="small" />
          <StatusTag type="errand" status="in_progress" size="small" />
          <StatusTag type="errand" status="pending_confirm" size="small" />
          <StatusTag type="errand" status="completed" size="small" />
        </div>
      </div>

      <div class="ct-panel__body">
        <EmptyState description="当前没有待接单的跑腿任务">
          <el-button type="primary" @click="router.push('/errands/create')">发布跑腿</el-button>
          <router-link to="/errands/301" class="ct-link hall-example-link">
            <span>查看示例任务详情</span>
            <ArrowRight :size="14" :stroke-width="1.5" />
          </router-link>
        </EmptyState>
      </div>

      <div class="ct-panel__footer">
        <AppPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="total"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
:deep(.hall-btn > span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.hall-example-link {
  padding: 0 8px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
}
</style>
