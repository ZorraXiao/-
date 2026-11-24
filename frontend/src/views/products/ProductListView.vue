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
const selectedCategory = ref('')
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
      eyebrow="二手交易"
      title="商品大厅"
      description="浏览同校师生发布的闲置物品，按分类与关键词快速筛选。"
    >
      <template #actions>
        <el-button type="primary" class="hall-btn" @click="router.push('/products/create')">
          <Plus :size="15" :stroke-width="1.5" />
          <span>发布商品</span>
        </el-button>
      </template>
    </PageHeader>

    <SearchBar
      v-model="keyword"
      placeholder="搜索商品标题或描述（最多 100 字）"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="selectedCategory" clearable placeholder="全部分类" style="width: 140px">
          <el-option label="书籍教材" value="books" />
          <el-option label="数码电子" value="electronics" />
          <el-option label="生活用品" value="daily" />
        </el-select>
      </template>
    </SearchBar>

    <section class="ct-panel">
      <div class="ct-panel__header">
        <span class="ct-panel__title">全部商品</span>
        <div class="ct-legend">
          <StatusTag type="product" status="on_sale" size="small" />
          <StatusTag type="product" status="off_shelf" size="small" />
        </div>
      </div>

      <div class="ct-panel__body">
        <EmptyState description="还没有在售的闲置，成为第一个发布的同学吧">
          <el-button type="primary" @click="router.push('/products/create')">发布商品</el-button>
          <router-link to="/products/101" class="ct-link hall-example-link">
            <span>查看示例商品详情</span>
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
