<script setup>
import { ref } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'

const activeTab = ref('products')
</script>

<template>
  <div class="ct-page profile-page">
    <PageHeader
      :back="{ to: '/profile', label: '个人中心' }"
      title="我的发布"
      description="集中管理你发布过的商品、失物与跑腿信息。"
    />

    <section class="ct-panel">
      <div class="ct-panel__body">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="我的商品" name="products">
            <EmptyState description="你还没有发布过闲置商品">
              <router-link to="/products/create">
                <el-button type="primary">发布商品</el-button>
              </router-link>
            </EmptyState>
          </el-tab-pane>

          <el-tab-pane label="我的失物" name="lost-found">
            <EmptyState description="你还没有发布失物或寻物信息">
              <router-link to="/lost-found/create">
                <el-button type="primary">发布信息</el-button>
              </router-link>
            </EmptyState>
          </el-tab-pane>

          <el-tab-pane label="我的跑腿" name="errands">
            <EmptyState description="你还没有发布跑腿任务">
              <router-link to="/errands/create">
                <el-button type="primary">发布跑腿</el-button>
              </router-link>
            </EmptyState>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 760px;
  margin: 0 auto;
}
</style>
