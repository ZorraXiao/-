<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChevronRight, ClipboardList, FileText, LogOut, PenLine } from 'lucide-vue-next'
import EditorialIllustration from '@/components/EditorialIllustration.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useAuthStore } from '@/stores/auth'
import DemoNotice from '@/features/profile-admin/DemoNotice.vue'
import { profileAdminApi } from '@/features/profile-admin/api'
import { useProfileAdminError } from '@/features/profile-admin/useProfileAdmin'

const router = useRouter()
const authStore = useAuthStore()
const report = useProfileAdminError()
const loading = ref(true), loadError = ref(''), editing = ref(false), saving = ref(false)
const formRef = ref(null), form = reactive({ nickname: '', phone: '' })
const rules = {
  nickname: [{ validator: (_, value, done) => {
    const length = [...String(value || '').trim()].length
    done(length > 0 && length <= 20 ? undefined : new Error('请输入 1–20 字的昵称'))
  }, trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, required: true, message: '请输入有效的 11 位手机号', trigger: 'blur' }],
}
async function loadUser() {
  loading.value = true; loadError.value = ''
  try { authStore.updateUserInfo(await profileAdminApi.me()) }
  catch (error) { loadError.value = report(error) }
  finally { loading.value = false }
}
function edit() {
  Object.assign(form, { nickname: authStore.userInfo?.nickname || '', phone: authStore.userInfo?.phone || '' })
  editing.value = true
}
async function save() {
  if (saving.value) return
  saving.value = true
  try {
    if (!(await formRef.value?.validate().catch(() => false))) return
    const user = await profileAdminApi.updateMe({ nickname: form.nickname.trim(), phone: form.phone.trim() })
    authStore.updateUserInfo(user)
    editing.value = false
    ElMessage.success('资料已更新')
  } catch (error) { ElMessage.error(report(error)) }
  finally { saving.value = false }
}
onMounted(loadUser)

const displayName = computed(
  () => authStore.userInfo?.nickname || authStore.userInfo?.username || '校园用户'
)

const username = computed(() => authStore.userInfo?.username || '--')

const phone = computed(() => authStore.userInfo?.phone || '未设置')

const initial = computed(() => displayName.value.slice(0, 1).toUpperCase())

const entries = [
  {
    to: '/profile/posts',
    title: '我的发布',
    desc: '管理你发布的商品、失物与跑腿信息',
    icon: FileText,
  },
  {
    to: '/profile/errands',
    title: '我的接单任务',
    desc: '查看你接取的跑腿任务进度',
    icon: ClipboardList,
  },
]

function handleLogout() {
  authStore.clearAuth()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <div class="ct-page profile-page">
    <PageHeader
      eyebrow="个人中心"
      title="我的账号"
      description="管理你的资料，查看发布与接单记录。"
    />

    <DemoNotice />
    <div v-if="loadError" class="pa-error" role="alert">
      <p>{{ loadError }}</p><el-button @click="loadUser">重新加载</el-button>
    </div>
    <section v-loading="loading" class="ct-panel profile-panel">
      <EditorialIllustration scene="stamp" :size="88" class="profile-panel__stamp" />
      <div class="ct-panel__body profile-card">
        <div class="profile-card__user">
          <el-avatar
            :size="48"
            :src="authStore.userInfo?.avatar_url || undefined"
            class="profile-avatar"
          >
            {{ initial }}
          </el-avatar>
          <div class="profile-card__meta">
            <p class="profile-card__name">{{ displayName }}</p>
            <p class="profile-card__username ct-mono">@{{ username }}</p>
          </div>
        </div>

        <el-button :disabled="loading || Boolean(loadError)" class="profile-edit-btn" @click="edit">
          <PenLine :size="14" :stroke-width="1.5" />
          <span>编辑资料</span>
        </el-button>
      </div>

      <div class="ct-panel__footer profile-details">
        <div class="ct-kv">
          <div class="ct-kv__row">
            <span class="ct-kv__label">手机号</span>
            <span class="ct-kv__value ct-num">{{ phone }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ct-panel profile-nav-panel">
      <router-link
        v-for="item in entries"
        :key="item.to"
        :to="item.to"
        class="profile-nav-row"
      >
        <div class="profile-nav-row__left">
          <span class="profile-nav-row__icon" aria-hidden="true">
            <component :is="item.icon" :size="16" :stroke-width="1.5" />
          </span>
          <div>
            <p class="profile-nav-row__title">{{ item.title }}</p>
            <p class="profile-nav-row__desc">{{ item.desc }}</p>
          </div>
        </div>
        <ChevronRight :size="16" :stroke-width="1.5" class="profile-nav-row__arrow" />
      </router-link>
    </section>

    <el-dialog v-model="editing" title="编辑资料" width="min(460px, 92vw)" destroy-on-close
      :close-on-click-modal="false" :close-on-press-escape="!saving" :show-close="!saving">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="save">
        <el-form-item label="昵称" prop="nickname"><el-input v-model="form.nickname" maxlength="20" show-word-limit /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" maxlength="11" inputmode="tel" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="saving" @click="editing = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存修改</el-button>
      </template>
    </el-dialog>
    <div class="profile-logout">
      <el-button class="profile-logout-btn" @click="handleLogout">
        <LogOut :size="14" :stroke-width="1.5" />
        <span>退出登录</span>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 760px;
  margin: 0 auto;
}

.profile-panel {
  position: relative;
  overflow: hidden;
}

.profile-panel__stamp {
  position: absolute;
  top: -14px;
  right: 120px;
  opacity: 0.16;
  pointer-events: none;
  transform: rotate(-10deg);
}

.profile-card {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.profile-card__user {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-avatar {
  background-color: var(--ct-bg-elevated);
  border: 1px solid var(--ct-border);
  color: var(--ct-accent);
  font-size: var(--ct-font-size-lg);
  font-weight: 600;
}

.profile-card__name {
  font-family: var(--ct-font-serif);
  font-size: var(--ct-font-size-lg);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.profile-card__username {
  margin-top: 2px;
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-tertiary);
}

:deep(.profile-edit-btn > span),
:deep(.profile-logout-btn > span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.profile-details {
  padding-top: 4px;
  padding-bottom: 4px;
  border-top: 1px dashed var(--ct-border-dashed);
}

.profile-nav-panel {
  overflow: hidden;
}

.profile-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ct-border);
  transition: var(--ct-transition);
}

.profile-nav-row:last-child {
  border-bottom: none;
}

.profile-nav-row:hover {
  background-color: var(--ct-bg-canvas);
}

.profile-nav-row__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-nav-row__icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-md);
  background-color: var(--ct-bg-canvas);
  color: var(--ct-text-secondary);
}

.profile-nav-row__title {
  font-size: var(--ct-font-size-base);
  font-weight: 500;
  color: var(--ct-text-primary);
}

.profile-nav-row__desc {
  margin-top: 2px;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.profile-nav-row__arrow {
  color: var(--ct-text-tertiary);
  transition: var(--ct-transition);
}

.profile-nav-row:hover .profile-nav-row__arrow {
  color: var(--ct-text-primary);
  transform: translateX(2px);
}

.profile-logout {
  display: flex;
  justify-content: flex-start;
}

.profile-logout-btn:hover {
  color: var(--ct-danger);
  border-color: var(--ct-danger);
}
</style>
