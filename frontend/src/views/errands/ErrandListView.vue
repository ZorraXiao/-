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
const statusFilter = ref('')
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
      placeholder="搜索起点、终点或物品说明..."
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="statusFilter" clearable placeholder="全部状态" style="width: 140px">
          <el-option label="待接单" value="pending" />
          <el-option label="进行中" value="in_progress" />
        </el-select>
      </template>

      <template #actions>
        <el-button type="primary" @click="router.push('/errands/create')">
          <el-icon><Plus /></el-icon>
          <span>发布跑腿</span>
        </el-button>
      </template>
    </SearchBar>

    <section class="placeholder-card">
      <div class="placeholder-header">
        <div>
          <el-tag type="info" effect="light">跑腿服务 · 成员 6</el-tag>
          <h1 class="placeholder-title">跑腿任务大厅</h1>
          <p class="placeholder-meta">当前路径：<code>{{ route.fullPath }}</code></p>
        </div>
        <div class="placeholder-tags">
          <StatusTag type="errand" status="pending" />
          <StatusTag type="errand" status="in_progress" />
          <StatusTag type="errand" status="pending_confirm" />
          <StatusTag type="errand" status="completed" />
        </div>
      </div>

      <EmptyState description="当前为跑腿任务大厅骨架页，第三阶段将接入任务列表与并发接单">
        <router-link to="/errands/301">
          <el-button plain>查看示例任务详情 (#301)</el-button>
        </router-link>
      </EmptyState>

      <AppPagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="25"
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
  flex-wrap: wrap;
  gap: 8px;
}
</style>
