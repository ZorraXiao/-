<script>
export const STATUS_MAP = {
  product: {
    on_sale: { label: '在售', tagType: 'success' },
    off_shelf: { label: '已下架', tagType: 'info' },
  },
  lost_found: {
    searching: { label: '寻找中', tagType: 'warning' },
    unclaimed: { label: '待认领', tagType: 'primary' },
    resolved: { label: '已完结', tagType: 'info' },
  },
  errand: {
    pending: { label: '待接单', tagType: 'warning' },
    in_progress: { label: '进行中', tagType: 'primary' },
    pending_confirm: { label: '待确认', tagType: 'primary', customClass: 'is-pending-confirm' },
    completed: { label: '已完成', tagType: 'success' },
  },
  moderation: {
    normal: { label: '正常', tagType: 'success' },
    taken_down: { label: '违规下架', tagType: 'danger' },
  },
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (val) => ['product', 'lost_found', 'lost-found', 'errand', 'moderation'].includes(val),
  },
  status: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'default',
  },
  effect: {
    type: String,
    default: 'light',
  },
})

const normalizedCategory = computed(() =>
  props.type === 'lost-found' ? 'lost_found' : props.type
)

const resolvedMeta = computed(() => {
  const group = STATUS_MAP[normalizedCategory.value] || {}
  return (
    group[props.status] || {
      label: props.status || '未知状态',
      tagType: 'info',
    }
  )
})
</script>

<template>
  <el-tag
    :type="resolvedMeta.tagType"
    :size="size"
    :effect="effect"
    :class="['ct-status-tag', resolvedMeta.customClass]"
  >
    {{ resolvedMeta.label }}
  </el-tag>
</template>

<style scoped>
.ct-status-tag.is-pending-confirm {
  --el-tag-text-color: #7c3aed;
  --el-tag-bg-color: #f5f3ff;
  --el-tag-border-color: #ddd6fe;
}
</style>
