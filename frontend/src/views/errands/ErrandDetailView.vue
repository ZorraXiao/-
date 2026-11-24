<script setup>
import { useRoute } from 'vue-router'
import { MapPin } from 'lucide-vue-next'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
</script>

<template>
  <div class="ct-page detail-page">
    <PageHeader
      :back="{ to: '/errands', label: '任务大厅' }"
      title="跑腿任务详情"
      description="确认取送地点与酬劳后即可接单。"
    >
      <template #meta>
        <span class="ct-mono">编号 #{{ route.params.id }}</span>
      </template>
    </PageHeader>

    <section class="ct-panel ct-panel--dashed">
      <div class="ct-panel__body">
        <div class="detail-grid">
          <div class="detail-route">
            <div class="detail-route__head">
              <MapPin :size="15" :stroke-width="1.5" />
              <span>起点 → 终点</span>
            </div>
            <div class="ct-kv">
              <div class="ct-kv__row">
                <span class="ct-kv__label">取件起点</span>
                <span class="ct-kv__value">--</span>
              </div>
              <div class="ct-kv__row">
                <span class="ct-kv__label">送达终点</span>
                <span class="ct-kv__value">--</span>
              </div>
            </div>
          </div>

          <div class="ct-kv">
            <div class="ct-kv__row">
              <span class="ct-kv__label">跑腿酬劳</span>
              <span class="ct-kv__value ct-mono">¥ --.--</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">物品说明</span>
              <span class="ct-kv__value">--</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">联系方式</span>
              <span class="ct-kv__value">--</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">状态</span>
              <span class="ct-kv__value">
                <StatusTag type="errand" status="pending" size="small" />
              </span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">发布时间</span>
              <span class="ct-kv__value ct-num">--</span>
            </div>
          </div>
        </div>
      </div>

      <div class="ct-panel__footer detail-actions">
        <router-link to="/errands">
          <el-button>返回任务大厅</el-button>
        </router-link>
        <router-link to="/errands/create">
          <el-button>发布跑腿</el-button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 760px;
  margin: 0 auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.detail-route {
  padding: 20px;
  background-color: var(--ct-bg-surface);
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-md);
}

.detail-route__head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
  color: var(--ct-text-tertiary);
}

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
