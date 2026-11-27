<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Plus } from 'lucide-vue-next'
import AppPagination from '@/components/AppPagination.vue'
import EditorialIllustration from '@/components/EditorialIllustration.vue'
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

const quickStatuses = [
  { label: '全部任务', value: '' },
  { label: '待接单', value: 'pending' },
  { label: '进行中', value: 'in_progress' },
]

function handleSearch() {
  page.value = 1
}

function selectStatus(value) {
  statusFilter.value = value
  handleSearch()
}
</script>

<template>
  <div class="ct-page">
    <PageHeader
      eyebrow="03 · 跑腿服务"
      title="任务大厅"
      description="取快递、带饭、代送文件，看看有没有顺路就能帮上的忙。"
    >
      <template #actions>
        <el-button type="primary" round class="hall-btn" @click="router.push('/errands/create')">
          <Plus :size="15" :stroke-width="1.5" />
          <span>发布跑腿</span>
        </el-button>
      </template>
    </PageHeader>

    <section class="hall-showcase" aria-label="任务状态导航">
      <div class="hall-showcase__thumb" aria-hidden="true">
        <img
          src="/illustrations/campus-errand-bike.jpg"
          alt=""
          class="hall-showcase__img is-cropped-lg"
        />
      </div>

      <div class="hall-showcase__body">
        <span class="hall-showcase__title">校内顺路委托</span>
        <p class="hall-showcase__desc">
          代取驿站快递、食堂带饭与纸质材料转交，明确起点终点与酬劳即可顺路接单。
        </p>
        <div class="hall-showcase__tabs" role="tablist" aria-label="任务状态快捷筛选">
          <button
            v-for="item in quickStatuses"
            :key="item.value"
            type="button"
            :class="['hall-chip', { 'is-active': statusFilter === item.value }]"
            @click="selectStatus(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <EditorialIllustration scene="stamp" :size="76" class="hall-showcase__stamp" />
    </section>

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
        <EmptyState scene="errands" description="当前没有待接单的跑腿任务">
          <el-button type="primary" round @click="router.push('/errands/create')">发布跑腿</el-button>
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

.hall-showcase {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-lg);
  overflow: hidden;
}

.hall-showcase__thumb {
  width: 160px;
  height: 108px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--ct-radius-md);
  border: 1px solid var(--ct-border);
  background-color: var(--ct-bg-canvas);
}

.hall-showcase__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hall-showcase__img.is-cropped-lg {
  transform: scale(1.11);
}

.hall-showcase__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hall-showcase__title {
  font-size: var(--ct-font-size-sm);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.hall-showcase__desc {
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
}

.hall-showcase__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.hall-chip {
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-round);
  background-color: var(--ct-bg-canvas);
  font-family: inherit;
  font-size: var(--ct-font-size-xs);
  font-weight: 500;
  color: var(--ct-text-secondary);
  cursor: pointer;
  transition: var(--ct-transition);
}

.hall-chip:hover {
  border-color: var(--ct-border-strong);
  background-color: var(--ct-bg-subtle);
  color: var(--ct-text-primary);
}

.hall-chip.is-active {
  background-color: var(--ct-accent);
  border-color: var(--ct-accent);
  color: var(--ct-bg-surface);
}

.hall-showcase__stamp {
  opacity: 0.28;
  transform: rotate(10deg);
  pointer-events: none;
}

.hall-example-link {
  padding: 0 8px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
}

@media (max-width: 720px) {
  .hall-showcase {
    flex-direction: column;
    align-items: flex-start;
  }

  .hall-showcase__thumb {
    width: 100%;
    height: 132px;
  }

  .hall-showcase__stamp {
    display: none;
  }
}
</style>
