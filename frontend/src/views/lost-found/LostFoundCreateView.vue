<script setup>
import PageHeader from '@/components/PageHeader.vue'

const sections = [
  { label: '信息类型', hint: '寻物启事或拾物招领' },
  { label: '物品描述', hint: '名称、颜色与显著特征' },
  { label: '时间地点', hint: '丢失或拾到的大致时间与位置' },
  { label: '联系方式', hint: '便于失主或拾主联系' },
]
</script>

<template>
  <div class="ct-page create-page">
    <PageHeader
      :back="{ to: '/lost-found', label: '信息大厅' }"
      title="发布失物 / 寻物"
      description="登记丢失或拾到的物品，写清时间与地点，提高找回效率。"
    />

    <section class="ct-panel ct-panel--dashed">
      <div class="ct-panel__header">
        <span class="ct-panel__title">表单结构</span>
      </div>

      <div class="ct-panel__body">
        <div class="ct-kv">
          <div v-for="item in sections" :key="item.label" class="ct-kv__row">
            <span class="ct-kv__label">{{ item.label }}</span>
            <span class="ct-kv__hint">{{ item.hint }}</span>
          </div>
        </div>
      </div>

      <div class="ct-panel__footer">
        <router-link to="/lost-found">
          <el-button>返回信息大厅</el-button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.create-page {
  max-width: 760px;
  margin: 0 auto;
}
</style>
