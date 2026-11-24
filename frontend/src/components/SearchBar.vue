<script setup>
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入关键词搜索...',
  },
  maxlength: {
    type: Number,
    default: 100,
  },
  searchText: {
    type: String,
    default: '搜索',
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

function handleInput(val) {
  emit('update:modelValue', val)
}

function triggerSearch() {
  const keyword = (props.modelValue || '').trim()
  if (keyword !== props.modelValue) {
    emit('update:modelValue', keyword)
  }
  emit('search', keyword)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '')
}
</script>

<template>
  <section class="ct-search-bar">
    <div class="ct-search-bar__left">
      <div v-if="$slots.filters" class="ct-search-bar__filters">
        <slot name="filters" />
      </div>
      <div class="ct-search-bar__keyword">
        <el-input
          :model-value="modelValue"
          :placeholder="placeholder"
          :maxlength="maxlength"
          clearable
          class="ct-search-bar__input"
          @update:model-value="handleInput"
          @keyup.enter="triggerSearch"
          @clear="handleClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="triggerSearch">
          {{ searchText }}
        </el-button>
      </div>
    </div>

    <div v-if="$slots.actions" class="ct-search-bar__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.ct-search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border-color);
  border-radius: var(--ct-radius-md);
  box-shadow: var(--ct-shadow-sm);
}

.ct-search-bar__left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  flex: 1 1 320px;
}

.ct-search-bar__filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.ct-search-bar__keyword {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 260px;
  max-width: 420px;
}

.ct-search-bar__input {
  flex: 1;
}

.ct-search-bar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
