<script setup>
import PageHeader from '@/components/PageHeader.vue'

const sections = [
  { label: '任务内容', hint: '需要代取或代送的物品' },
  { label: '取送地点', hint: '起点与终点' },
  { label: '期望时间', hint: '最晚完成时间' },
  { label: '酬劳', hint: '以元为单位填写，精确到分' },
]
</script>

<template>
  <div class="ct-page create-page">
    <PageHeader
      :back="{ to: '/errands', label: '任务大厅' }"
      title="发布跑腿"
      description="说明取送地点、时间与酬劳，顺路的同学会尽快接单。"
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
        <router-link to="/errands">
          <el-button>返回任务大厅</el-button>
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
