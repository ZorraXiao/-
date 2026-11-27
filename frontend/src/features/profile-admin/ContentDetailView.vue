<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PageHeader from '@/components/PageHeader.vue'
import StatusTag from '@/components/StatusTag.vue'
import DemoNotice from './DemoNotice.vue'
import { profileAdminApi } from './api'
import { CONTENT, titleOf, availableAction } from './model'
import { useProfileAdminAction, useProfileAdminError } from './useProfileAdmin'
import { formatCentsToYuan, formatUtcToLocal } from '@/utils/format'
const route = useRoute(), auth = useAuthStore(), report = useProfileAdminError()
const kind = computed(() => route.params.kind), admin = computed(() => Boolean(route.meta.adminContentDetail))
const meta = computed(() => CONTENT[kind.value]), item = ref(null), loading = ref(false), error = ref('')
const { pending, perform } = useProfileAdminAction()
const action = computed(() => !admin.value && availableAction(kind.value, item.value, auth.userInfo?.id))
const contactVisible = computed(() => item.value?.moderation_status === 'normal' &&
  !({ products: ['off_shelf'], 'lost-found': ['resolved'], errands: ['completed'] }[kind.value] || []).includes(item.value?.status))
const back = computed(() => admin.value ? { to: `/admin/${kind.value}`, label: '返回管理列表' } :
  route.query.from === 'accepted' ? { to: '/profile/errands', label: '我的接单任务' } : { to: `/profile/posts?tab=${kind.value}`, label: '我的发布' })
let sequence = 0
async function load() {
  const ticket = ++sequence
  item.value = null; error.value = ''; loading.value = true
  try {
    if (!meta.value || !/^\d+$/.test(route.params.id)) throw new Error('内容不存在')
    const result = await profileAdminApi.detail(kind.value, route.params.id, admin.value)
    if (ticket === sequence) item.value = result
  } catch (cause) { if (ticket === sequence) error.value = report(cause) }
  finally { if (ticket === sequence) loading.value = false }
}
function act() {
  if (action.value) perform({ id: item.value.id, label: action.value.label, description: action.value.confirm,
    execute: () => profileAdminApi.act(kind.value, item.value.id, action.value.key), refresh: load })
}
watch(() => [route.params.kind, route.params.id, route.meta.adminContentDetail], load, { immediate: true })
onBeforeUnmount(() => { sequence++ })
const steps = [ ['pending', '待接单', 'created_at'], ['in_progress', '进行中', 'accepted_at'],
  ['pending_confirm', '待确认', 'delivered_at'], ['completed', '已完成', 'completed_at'] ]
</script>
<template>
  <div class="ct-page pa-detail-page">
    <PageHeader :back="back" :title="`${meta?.title || '内容'}详情`" description="查看记录、状态和进度。" />
    <DemoNotice />
    <div v-if="error" class="pa-error" role="alert"><p>{{ error }}</p><el-button @click="load">重新加载</el-button></div>
    <section v-else v-loading="loading" class="ct-panel pa-detail-panel">
      <template v-if="item">
        <div class="ct-panel__header pa-detail-heading"><div><p class="ct-eyebrow">记录 #{{ item.id }}</p><h2>{{ titleOf(item) }}</h2></div><StatusTag :type="meta.tag" :status="item.status" /></div>
        <div class="ct-panel__body">
          <el-alert v-if="item.moderation_status === 'taken_down'" type="warning" :closable="false" :title="`此内容已违规下架：${item.taken_down_reason || '请联系管理员'}`" class="pa-alert" />
          <div class="pa-detail-grid">
            <img v-if="kind === 'products'" class="pa-product-image" :src="item.cover_url || '/illustrations/campus-desk-books.jpg'" alt="商品展示图" />
            <dl class="pa-facts">
              <template v-if="kind !== 'lost-found'"><dt>{{ kind === 'products' ? '价格' : '跑腿费' }}</dt><dd class="ct-mono pa-price">¥ {{ formatCentsToYuan(item.price_cents ?? item.fee_cents) }}</dd></template>
              <template v-if="kind === 'products'"><dt>分类</dt><dd>{{ item.category_name || '闲置物品' }}</dd></template>
              <template v-if="kind === 'lost-found'"><dt>类型</dt><dd>{{ item.item_type === 'lost' ? '寻物启事' : '拾物招领' }}</dd><dt>地点</dt><dd>{{ item.location }}</dd></template>
              <template v-if="kind === 'errands'"><dt>取件起点</dt><dd>{{ item.start_location }}</dd><dt>送达终点</dt><dd>{{ item.end_location }}</dd><dt>接单人</dt><dd>{{ item.accepter_nickname || '等待接单' }}</dd></template>
              <dt>发布者</dt><dd>{{ item.publisher_nickname }}</dd>
              <dt>联系方式</dt><dd data-testid="contact-info">{{ contactVisible && item.contact_info ? item.contact_info : '已隐藏，当前状态不再公开联系方式' }}</dd>
              <dt>发布时间</dt><dd>{{ formatUtcToLocal(item.created_at) }}</dd>
            </dl>
          </div>
          <h3 class="pa-section-title">{{ kind === 'errands' ? '任务说明' : '详细描述' }}</h3><p class="pa-description">{{ item.description || item.item_desc }}</p>
          <template v-if="kind === 'errands'">
            <h3 class="pa-section-title">任务进度</h3>
            <el-steps direction="vertical" :active="item.status === 'completed' ? 4 : steps.findIndex(step => step[0] === item.status)" finish-status="success">
              <el-step v-for="step in steps" :key="step[0]" :title="step[1]" :description="item[step[2]] ? formatUtcToLocal(item[step[2]]) : '尚未发生'" />
            </el-steps>
          </template>
        </div>
        <div class="ct-panel__footer pa-actions"><router-link :to="back.to"><el-button>返回列表</el-button></router-link>
          <el-button v-if="action" type="primary" :loading="Boolean(pending)" @click="act">{{ action.label }}</el-button>
        </div>
      </template>
    </section>
  </div>
</template>
