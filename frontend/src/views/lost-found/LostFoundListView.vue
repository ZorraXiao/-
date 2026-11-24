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
const itemType = ref('')
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
      placeholder="搜索失物或拾物名称、地点..."
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="itemType" clearable placeholder="全部类型" style="width: 140px">
          <el-option label="寻物启事" value="lost" />
          <el-option label="拾物招领" value="found" />
        </el-select>
      </template>

      <template #actions>
        <el-button type="primary" @click="router.push('/lost-found/create')">
          <el-icon><Plus /></el-icon>
          <span>发布信息</span>
        </el-button>
      </template>
    </SearchBar>

    <section class="placeholder-card">
      <div class="placeholder-header">
        <div>
          <el-tag type="warning" effect="light">失物招领 · 成员 5</el-tag>
          <h1 class="placeholder-title">失物招领信息大厅</h1>
          <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
        </div>
        <div class="placeholder-tags">
          <StatusTag type="lost_found" status="searching" />
          <StatusTag type="lost_found" status="unclaimed" />
          <StatusTag type="lost_found" status="resolved" />
        </div>
      </div>

      <EmptyState description="当前为失物招领大厅骨架页，第三阶段将接入失物/拾物列表">
        <router-link to="/lost-found/201">
          <el-button plain>查看示例信息详情 (#201)</el-button>
        </router-link>
      </EmptyState>

      <AppPagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="18"
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
