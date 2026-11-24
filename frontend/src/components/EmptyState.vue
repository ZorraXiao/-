<script setup>
import { computed } from 'vue'
import { Inbox } from 'lucide-vue-next'

const props = defineProps({
  description: {
    type: String,
    default: '暂无数据',
  },
  imageSize: {
    type: Number,
    default: 120,
  },
})

const boxSize = computed(() => Math.min(72, Math.max(40, Math.round(props.imageSize * 0.4))))
const iconSize = computed(() => Math.round(boxSize.value * 0.42))
</script>

<template>
  <div class="ct-empty-state">
    <div
      class="ct-empty-state__icon"
      :style="{ width: `${boxSize}px`, height: `${boxSize}px` }"
      aria-hidden="true"
    >
      <Inbox :size="iconSize" :stroke-width="1.5" />
    </div>
    <p class="ct-empty-state__desc">{{ description }}</p>
    <div v-if="$slots.default" class="ct-empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ct-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.ct-empty-state__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: 10px;
  color: var(--ct-text-tertiary);
}

.ct-empty-state__desc {
  margin-top: 16px;
  max-width: 360px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.ct-empty-state__actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
