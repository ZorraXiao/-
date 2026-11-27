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
const itemType = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const quickTypes = [
  { label: '全部启事', value: '' },
  { label: '寻物启事', value: 'lost' },
  { label: '拾物招领', value: 'found' },
]

function handleSearch() {
  page.value = 1
}

function selectType(value) {
  itemType.value = value
  handleSearch()
}
</script>

<template>
  <div class="ct-page">
    <PageHeader
      eyebrow="02 · 失物招领"
      title="信息大厅"
      description="汇总校园内的寻物启事与拾物招领，帮失物尽快回到主人手中。"
    >
      <template #actions>
        <el-button type="primary" round class="hall-btn" @click="router.push('/lost-found/create')">
          <Plus :size="15" :stroke-width="1.5" />
          <span>发布信息</span>
        </el-button>
      </template>
    </PageHeader>

    <section class="hall-showcase" aria-label="信息类型导航">
      <div class="hall-showcase__thumb" aria-hidden="true">
        <img
          src="/illustrations/campus-lost-keys.jpg"
          alt=""
          class="hall-showcase__img"
        />
      </div>

      <div class="hall-showcase__body">
        <span class="hall-showcase__title">寻物与招领索引</span>
        <p class="hall-showcase__desc">
          校园卡、钥匙、眼镜与笔记本遗失拾获，写明特征与地点尽快核对认领。
        </p>
        <div class="hall-showcase__tabs" role="tablist" aria-label="信息类型快捷筛选">
          <button
            v-for="item in quickTypes"
            :key="item.value"
            type="button"
            :class="['hall-chip', { 'is-active': itemType === item.value }]"
            @click="selectType(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <EditorialIllustration scene="stamp" :size="76" class="hall-showcase__stamp" />
    </section>

    <SearchBar
      v-model="keyword"
      placeholder="搜索失物或拾物名称、地点..."
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="itemType" clearable placeholder="全部类型" style="width: 140px">
          <el-option label="寻物启事" value="lost" />
          <el-option label="拾物招领" value="found" />
        </el-select>
      </template>
    </SearchBar>

    <section class="ct-panel">
      <div class="ct-panel__header">
        <span class="ct-panel__title">全部信息</span>
        <div class="ct-legend">
          <StatusTag type="lost_found" status="searching" size="small" />
          <StatusTag type="lost_found" status="unclaimed" size="small" />
          <StatusTag type="lost_found" status="resolved" size="small" />
        </div>
      </div>

      <div class="ct-panel__body">
        <EmptyState scene="lost-found" description="暂时没有新的失物或拾物信息">
          <el-button type="primary" round @click="router.push('/lost-found/create')">发布信息</el-button>
          <router-link to="/lost-found/201" class="ct-link hall-example-link">
            <span>查看示例信息详情</span>
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
