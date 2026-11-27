<script setup>
import PageHeader from '@/components/PageHeader.vue'
import PersonalContentList from '@/features/profile-admin/PersonalContentList.vue'
import DemoNotice from '@/features/profile-admin/DemoNotice.vue'
</script>

<template>
  <div class="ct-page pa-personal-page">
    <PageHeader
      :back="{ to: '/profile', label: '个人中心' }"
      title="我的接单任务"
      description="查看你接取的跑腿任务及其进度。"
    />

    <DemoNotice />
    <PersonalContentList kind="errands" participation="accepted" />
  </div>
</template>
