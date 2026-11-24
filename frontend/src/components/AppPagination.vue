<script setup>
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  hideOnSinglePage: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:page', 'update:pageSize', 'change'])

function handlePageChange(nextPage) {
  emit('update:page', nextPage)
  emit('change', { page: nextPage, pageSize: props.pageSize })
}

function handleSizeChange(nextSize) {
  const maxPage = Math.max(1, Math.ceil(props.total / nextSize))
  const nextPage = props.page > maxPage ? 1 : props.page
  if (nextPage !== props.page) {
    emit('update:page', nextPage)
  }
  emit('update:pageSize', nextSize)
  emit('change', { page: nextPage, pageSize: nextSize })
}
</script>

<template>
  <div class="ct-pagination">
    <el-pagination
      background
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      :hide-on-single-page="hideOnSinglePage"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<style scoped>
.ct-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 4px;
}
</style>
