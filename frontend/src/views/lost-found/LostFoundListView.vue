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
const itemType = ref('')
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
        <EmptyState description="暂时没有新的失物或拾物信息">
          <el-button type="primary" @click="router.push('/lost-found/create')">发布信息</el-button>
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

.hall-example-link {
  padding: 0 8px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
}
</style>
