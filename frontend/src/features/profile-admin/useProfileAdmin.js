import { onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

export function useProfileAdminError() {
  const router = useRouter(), auth = useAuthStore()
  return error => {
    if ((error.status || error.response?.status) === 401) {
      auth.clearAuth()
      router.replace({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    }
    return error.response?.data?.message || error.message || '操作未完成，请稍后重试'
  }
}

export function useProfileAdminList(fetcher, scope = () => '') {
  const items = ref([]), total = ref(0), page = ref(1), pageSize = ref(20)
  const keyword = ref(''), status = ref(''), moderation = ref(''), active = ref('')
  const loading = ref(false), error = ref('')
  const report = useProfileAdminError()
  let sequence = 0
  async function refresh() {
    const ticket = ++sequence
    loading.value = true
    error.value = ''
    try {
      const data = await fetcher({ page: page.value, page_size: pageSize.value,
        ...(keyword.value.trim() ? { keyword: keyword.value.trim() } : {}),
        ...(status.value ? { status: status.value } : {}),
        ...(moderation.value ? { moderation_status: moderation.value } : {}),
        ...(active.value !== '' ? { is_active: active.value } : {}) })
      if (ticket !== sequence) return
      if (page.value > Math.max(1, Math.ceil(data.total / pageSize.value))) {
        page.value = Math.max(1, Math.ceil(data.total / pageSize.value))
        return
      }
      items.value = data.items
      total.value = data.total
    } catch (cause) {
      if (ticket !== sequence) return
      items.value = []; total.value = 0
      error.value = report(cause)
    } finally { if (ticket === sequence) loading.value = false }
  }
  watch([keyword, status, moderation, active, scope], () => { page.value = 1 })
  watch([page, pageSize, keyword, status, moderation, active, scope], refresh, { immediate: true })
  onBeforeUnmount(() => { sequence++ })
  return { items, total, page, pageSize, keyword, status, moderation, active, loading, error, refresh }
}

export function useProfileAdminAction() {
  const pending = ref(''), report = useProfileAdminError()
  async function perform({ id, label, description, reason = false, execute, refresh }) {
    if (pending.value) return
    pending.value = id
    try {
      const confirmButtonText = label.startsWith('确认') ? label : '确认' + label
      let payload
      if (reason) {
        const result = await ElMessageBox.prompt(description, label, {
          confirmButtonText, cancelButtonText: '取消', inputPlaceholder: '请输入操作原因（1–255 字）',
          inputType: 'textarea', inputValidator: value => {
            const length = (value || '').trim().length
            return length > 0 && length <= 255 ? true : '请输入 1–255 字的操作原因'
          }, closeOnClickModal: false,
        })
        payload = { reason: result.value.trim() }
      } else await ElMessageBox.confirm(description, label, {
        confirmButtonText, cancelButtonText: '取消', type: 'warning', closeOnClickModal: false,
      })
      await execute(payload)
      ElMessage.success(label + '成功')
      await refresh?.()
    } catch (cause) {
      if (!['cancel', 'close'].includes(cause)) ElMessage.error(report(cause))
    } finally { pending.value = '' }
  }
  return { pending, perform }
}
