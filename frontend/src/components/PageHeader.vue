<script setup>
import { ArrowLeft } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  eyebrow: {
    type: String,
    default: '',
  },
  back: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <header class="ct-page-header">
    <div class="ct-page-header__main">
      <router-link v-if="back" :to="back.to" class="ct-page-header__back">
        <ArrowLeft :size="14" :stroke-width="1.5" />
        <span>{{ back.label }}</span>
      </router-link>
      <p v-else-if="eyebrow" class="ct-page-header__eyebrow">{{ eyebrow }}</p>

      <h1 class="ct-page-header__title">{{ title }}</h1>
      <p v-if="description" class="ct-page-header__desc">{{ description }}</p>

      <div v-if="$slots.meta" class="ct-page-header__meta">
        <slot name="meta" />
      </div>
    </div>

    <div v-if="$slots.actions" class="ct-page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.ct-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.ct-page-header__main {
  min-width: 0;
}

.ct-page-header__eyebrow {
  margin-bottom: 8px;
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
  color: var(--ct-text-tertiary);
}

.ct-page-header__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
  color: var(--ct-text-tertiary);
  transition: var(--ct-transition);
}

.ct-page-header__back:hover {
  color: var(--ct-text-primary);
}

.ct-page-header__title {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: var(--ct-tracking-tight);
  color: var(--ct-text-primary);
}

.ct-page-header__desc {
  margin-top: 6px;
  max-width: 600px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.ct-page-header__meta {
  margin-top: 10px;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.ct-page-header__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  flex-shrink: 0;
}
</style>
