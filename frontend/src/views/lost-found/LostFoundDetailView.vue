<script setup>
import { useRoute } from 'vue-router'
import { Image as ImageIcon } from 'lucide-vue-next'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
</script>

<template>
  <div class="ct-page detail-page">
    <PageHeader
      :back="{ to: '/lost-found', label: '信息大厅' }"
      title="失物 / 寻物详情"
      description="核对物品特征，确认后联系发布者认领或归还。"
    >
      <template #meta>
        <span class="ct-mono">编号 #{{ route.params.id }}</span>
      </template>
    </PageHeader>

    <section class="ct-panel ct-panel--dashed">
      <div class="ct-panel__body">
        <div class="detail-grid">
          <div class="detail-media" aria-hidden="true">
            <ImageIcon :size="24" :stroke-width="1.5" />
            <span>物品图片</span>
          </div>

          <div class="ct-kv">
            <div class="ct-kv__row">
              <span class="ct-kv__label">类型</span>
              <span class="ct-kv__value">--</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">状态</span>
              <span class="ct-kv__value">
                <StatusTag type="lost_found" status="searching" size="small" />
              </span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">地点</span>
              <span class="ct-kv__value">--</span>
            </div>
            <div class="ct-kv__row">
              <span class="ct-kv__label">时间</span>
              <span class="ct-kv__value ct-num">--</span>
            </div>
          </div>
        </div>
      </div>

      <div class="ct-panel__footer detail-actions">
        <router-link to="/lost-found">
          <el-button>返回信息大厅</el-button>
        </router-link>
        <router-link to="/lost-found/create">
          <el-button>发布失物 / 寻物</el-button>
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

.detail-media {
  aspect-ratio: 4 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--ct-bg-surface);
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-md);
  color: var(--ct-text-tertiary);
  font-size: var(--ct-font-size-sm);
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
