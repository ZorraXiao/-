<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import AppPagination from '@/components/AppPagination.vue'
import EmptyState from '@/components/EmptyState.vue'
import SearchBar from '@/components/SearchBar.vue'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const selectedCategory = ref('')
const page = ref(1)
const pageSize = ref(20)

function handleSearch() {
  page.value = 1
}
</script>

<template>
  <div class="hall-placeholder">
    <SearchBar
      v-model="keyword"
      placeholder="搜索商品标题或描述（最多 100 字）"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="selectedCategory" clearable placeholder="全部分类" style="width: 150px">
          <el-option label="书籍教材" value="books" />
          <el-option label="数码电子" value="electronics" />
          <el-option label="生活用品" value="daily" />
        </el-select>
      </template>

      <template #actions>
        <el-button type="primary" @click="router.push('/products/create')">
          <el-icon><Plus /></el-icon>
          <span>发布商品</span>
        </el-button>
      </template>
    </SearchBar>

    <section class="placeholder-card">
      <div class="placeholder-header">
        <div>
          <el-tag type="success" effect="light">二手交易 · 成员 4</el-tag>
          <h1 class="placeholder-title">商品大厅</h1>
          <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
        </div>
        <div class="placeholder-tags">
          <StatusTag type="product" status="on_sale" />
          <StatusTag type="product" status="off_shelf" />
        </div>
      </div>

      <EmptyState description="当前为商品大厅骨架页，第三阶段将接入商品分页列表">
        <router-link to="/products/101">
          <el-button plain>查看示例商品详情 (#101)</el-button>
        </router-link>
      </EmptyState>

      <AppPagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="42"
      />
    </section>
  </div>
</template>

<style scoped>
.hall-placeholder {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.placeholder-card {
  padding: 24px;
  background: var(--ct-bg-surface);
  border: 1px solid var(--ct-border-color);
  border-radius: var(--ct-radius-lg);
  box-shadow: var(--ct-shadow-sm);
}

.placeholder-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.placeholder-title {
  margin: 10px 0 4px;
  font-size: var(--ct-font-size-2xl);
}

.placeholder-meta {
  margin: 0;
  color: var(--ct-text-regular);
}

.placeholder-tags {
  display: flex;
  gap: 8px;
}
</style>
