<script setup>
import { useRoute } from 'vue-router'
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
        <div class="ct-kv">
          <div class="ct-kv__row">
            <span class="ct-kv__label">信息类型</span>
            <span class="ct-kv__value">--</span>
          </div>
          <div class="ct-kv__row">
            <span class="ct-kv__label">物品名称</span>
            <span class="ct-kv__value">--</span>
          </div>
          <div class="ct-kv__row">
            <span class="ct-kv__label">状态</span>
            <span class="ct-kv__value">
              <StatusTag type="lost_found" status="searching" size="small" />
            </span>
          </div>
          <div class="ct-kv__row">
            <span class="ct-kv__label">丢失 / 拾取地点</span>
            <span class="ct-kv__value">--</span>
          </div>
          <div class="ct-kv__row">
            <span class="ct-kv__label">详细描述</span>
            <span class="ct-kv__value">--</span>
          </div>
          <div class="ct-kv__row">
            <span class="ct-kv__label">联系方式</span>
            <span class="ct-kv__value">--</span>
          </div>
          <div class="ct-kv__row">
            <span class="ct-kv__label">发布时间</span>
            <span class="ct-kv__value ct-num">--</span>
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

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
