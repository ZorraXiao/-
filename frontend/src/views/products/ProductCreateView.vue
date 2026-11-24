<script setup>
import PageHeader from '@/components/PageHeader.vue'

const sections = [
  { label: '基本信息', hint: '标题、分类与成色说明' },
  { label: '价格', hint: '以元为单位填写，精确到分' },
  { label: '商品图片', hint: '建议上传清晰的实拍图' },
  { label: '交易方式', hint: '校内面交地点与联系方式' },
]
</script>

<template>
  <div class="ct-page create-page">
    <PageHeader
      :back="{ to: '/products', label: '商品大厅' }"
      title="发布商品"
      description="描述清楚成色、价格与交易方式，方便同学快速做决定。"
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
        <router-link to="/products">
          <el-button>返回商品大厅</el-button>
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
