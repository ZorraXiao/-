<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PersonalContentList from '@/features/profile-admin/PersonalContentList.vue'
import DemoNotice from '@/features/profile-admin/DemoNotice.vue'

const route = useRoute(), router = useRouter()
const tabs = { products: '我的商品', 'lost-found': '我的失物', errands: '我的跑腿' }
const activeTab = ref('products')
watch(() => route.query.tab, tab => { activeTab.value = Object.hasOwn(tabs, tab) ? tab : 'products' }, { immediate: true })
function changeTab(tab) { router.replace({ query: { ...route.query, tab } }) }
</script>

<template>
  <div class="ct-page pa-personal-page">
    <PageHeader
      :back="{ to: '/profile', label: '个人中心' }"
      title="我的发布"
      description="集中管理你发布过的商品、失物与跑腿信息。"
    />

    <DemoNotice />
    <el-tabs v-model="activeTab" class="pa-tabs" @tab-change="changeTab">
      <el-tab-pane v-for="(label, key) in tabs" :key="key" :name="key" :label="label" />
    </el-tabs>
    <PersonalContentList :key="activeTab" :kind="activeTab" />
  </div>
</template>
