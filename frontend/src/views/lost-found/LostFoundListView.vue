<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, MapPin, Plus } from 'lucide-vue-next'
import { fetchLostFoundList, ITEM_TYPE_LABEL } from '@/api/lostFound'
import AppPagination from '@/components/AppPagination.vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatUtcToLocal } from '@/utils/format'

const router = useRouter()

const keyword = ref('')
const itemType = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const items = ref([])
const loading = ref(false)

async function fetchList() {
  loading.value = true
  try {
    const data = await fetchLostFoundList({
      keyword: keyword.value,
      item_type: itemType.value,
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

function handleTypeChange() {
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
      eyebrow="失物招领"
      title="信息大厅"
      description="汇总校园内的寻物启事与拾物招领，帮失物尽快回到主人手中。"
    >
      <template #actions>
        <el-button type="primary" class="hall-btn" @click="router.push('/lost-found/create')">
          <Plus :size="15" :stroke-width="1.5" />
          <span>发布信息</span>
        </el-button>
      </template>
    </PageHeader>

    <SearchBar
      v-model="keyword"
      placeholder="搜索失物或拾物名称、地点..."
      @search="handleSearch"
    >
      <template #filters>
        <el-select
          v-model="itemType"
          clearable
          placeholder="全部类型"
          style="width: 140px"
          @change="handleTypeChange"
        >
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

      <div v-loading="loading" class="ct-panel__body lf-body">
        <div v-if="items.length" class="lf-list">
          <router-link
            v-for="item in items"
            :key="item.id"
            :to="`/lost-found/${item.id}`"
            class="lf-item"
          >
            <div class="lf-item__head">
              <span
                :class="['lf-type', item.item_type === 'lost' ? 'lf-type--lost' : 'lf-type--found']"
              >
                {{ ITEM_TYPE_LABEL[item.item_type] }}
              </span>
              <StatusTag type="lost_found" :status="item.status" size="small" />
            </div>

            <h3 class="lf-item__name">{{ item.item_name }}</h3>

            <div class="lf-item__meta">
              <span class="lf-item__loc">
                <MapPin :size="14" :stroke-width="1.5" />
                <span>{{ item.location }}</span>
              </span>
              <span class="lf-item__time ct-num">{{ formatUtcToLocal(item.created_at) }}</span>
            </div>

            <p class="lf-item__desc">{{ item.description }}</p>

            <span class="lf-item__foot ct-link">
              <span>查看详情</span>
              <ArrowRight :size="14" :stroke-width="1.5" />
            </span>
          </router-link>
        </div>

        <EmptyState v-else-if="!loading" description="没有找到符合条件的失物或拾物信息">
          <el-button type="primary" @click="router.push('/lost-found/create')">发布信息</el-button>
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

.lf-body {
  padding: 12px 20px;
}

.lf-list {
  display: flex;
  flex-direction: column;
}

.lf-item {
  display: block;
  padding: 16px 4px;
  border-bottom: 1px solid var(--ct-border);
  transition: var(--ct-transition);
}

.lf-item:last-child {
  border-bottom: none;
}

.lf-item:hover .lf-item__name {
  color: var(--ct-accent);
}

.lf-item__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.lf-type {
  padding: 2px 8px;
  font-size: var(--ct-font-size-xs);
  font-weight: 500;
  line-height: 1.6;
  border-radius: var(--ct-radius-sm);
  border: 1px solid transparent;
}

.lf-type--lost {
  color: var(--ct-accent);
  background-color: var(--ct-accent-soft);
}

.lf-type--found {
  color: var(--ct-success);
  background-color: var(--ct-bg-subtle);
}

.lf-item__name {
  margin-top: 10px;
  font-size: var(--ct-font-size-md);
  font-weight: 600;
  color: var(--ct-text-primary);
  transition: var(--ct-transition);
}

.lf-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 16px;
  margin-top: 6px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

.lf-item__loc {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.lf-item__time {
  color: var(--ct-text-tertiary);
}

.lf-item__desc {
  margin-top: 8px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lf-item__foot {
  margin-top: 10px;
  font-size: var(--ct-font-size-sm);
}
</style>
