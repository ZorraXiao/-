<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, MapPin, Plus } from 'lucide-vue-next'
import { fetchErrandList } from '@/api/errand'
import AppPagination from '@/components/AppPagination.vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatCentsToYuan, formatUtcToLocal } from '@/utils/format'

const router = useRouter()

const keyword = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const items = ref([])
const loading = ref(false)

async function fetchList() {
  loading.value = true
  try {
    const data = await fetchErrandList({
      keyword: keyword.value,
      status: statusFilter.value,
      page: page.value,
      page_size: pageSize.value,
    })
    items.value = data.items
    total.value = data.total
  } catch {
    items.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchList()
}

function handleStatusChange() {
  page.value = 1
  fetchList()
}

function handlePageChange() {
  fetchList()
}

onMounted(fetchList)
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
        <el-select
          v-model="statusFilter"
          clearable
          placeholder="全部状态"
          style="width: 140px"
          @change="handleStatusChange"
        >
          <el-option label="待接单" value="pending" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="待确认" value="pending_confirm" />
          <el-option label="已完成" value="completed" />
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

      <div v-loading="loading" class="ct-panel__body er-body">
        <div v-if="items.length" class="er-list">
          <router-link
            v-for="item in items"
            :key="item.id"
            :to="`/errands/${item.id}`"
            class="er-item"
          >
            <div class="er-item__head">
              <span class="er-item__fee ct-mono">¥{{ formatCentsToYuan(item.fee_cents) }}</span>
              <StatusTag type="errand" :status="item.status" size="small" />
            </div>

            <p class="er-item__desc">{{ item.item_desc }}</p>

            <div class="er-item__route">
              <span class="er-item__place">
                <MapPin :size="14" :stroke-width="1.5" />
                <span>{{ item.start_location }}</span>
              </span>
              <ArrowRight :size="14" :stroke-width="1.5" class="er-item__arrow" />
              <span class="er-item__place">
                <MapPin :size="14" :stroke-width="1.5" />
                <span>{{ item.end_location }}</span>
              </span>
            </div>

            <div class="er-item__foot">
              <span class="er-item__time ct-num">{{ formatUtcToLocal(item.created_at) }}</span>
              <span class="ct-link">
                <span>查看详情</span>
                <ArrowRight :size="14" :stroke-width="1.5" />
              </span>
            </div>
          </router-link>
        </div>

        <EmptyState v-else-if="!loading" description="没有找到符合条件的跑腿任务">
          <el-button type="primary" @click="router.push('/errands/create')">发布跑腿</el-button>
        </EmptyState>
      </div>

      <div class="ct-panel__footer">
        <AppPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="total"
          @change="handlePageChange"
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

.er-body {
  padding: 12px 20px;
}

.er-list {
  display: flex;
  flex-direction: column;
}

.er-item {
  display: block;
  padding: 16px 4px;
  border-bottom: 1px solid var(--ct-border);
  transition: var(--ct-transition);
}

.er-item:last-child {
  border-bottom: none;
}

.er-item:hover .er-item__desc {
  color: var(--ct-accent);
}

.er-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.er-item__fee {
  font-size: var(--ct-font-size-lg);
  font-weight: 600;
  color: var(--ct-accent);
}

.er-item__desc {
  margin-top: 8px;
  font-size: var(--ct-font-size-md);
  font-weight: 500;
  color: var(--ct-text-primary);
  transition: var(--ct-transition);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.er-item__route {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
}

.er-item__place {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.er-item__arrow {
  color: var(--ct-text-tertiary);
}

.er-item__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}

.er-item__time {
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

.er-item__foot .ct-link {
  font-size: var(--ct-font-size-sm);
}
</style>
