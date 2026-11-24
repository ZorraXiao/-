<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back, FolderOpened, Setting, SwitchButton, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const pageTitle = computed(() => route.meta?.title || '后台管理')
const adminName = computed(
  () => authStore.userInfo?.nickname || authStore.userInfo?.username || '管理员'
)

function handleLogout() {
  authStore.clearAuth()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <div class="ct-admin-layout">
    <aside class="ct-admin-sidebar">
      <div class="ct-admin-sidebar__brand">
        <el-icon><Setting /></el-icon>
        <span>后台管理控制台</span>
      </div>

      <el-menu
        router
        :default-active="route.path"
        :default-openeds="['content']"
        class="ct-admin-menu"
      >
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>

        <el-sub-menu index="content">
          <template #title>
            <el-icon><FolderOpened /></el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/admin/products">商品管理</el-menu-item>
          <el-menu-item index="/admin/lost-found">失物管理</el-menu-item>
          <el-menu-item index="/admin/errands">跑腿管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <div class="ct-admin-main">
      <header class="ct-admin-header">
        <div class="ct-admin-header__left">
          <h1 class="ct-admin-header__title">{{ pageTitle }}</h1>
        </div>

        <div class="ct-admin-header__right">
          <span class="ct-admin-header__user">管理员：{{ adminName }}</span>
          <router-link to="/">
            <el-button plain size="small">
              <el-icon><Back /></el-icon>
              <span>返回前台</span>
            </el-button>
          </router-link>
          <el-button type="danger" plain size="small" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-button>
        </div>
      </header>

      <main class="ct-admin-content">
        <div class="ct-admin-card">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.ct-admin-layout {
  min-height: 100vh;
  display: flex;
  background-color: var(--ct-bg-page);
}

.ct-admin-sidebar {
  width: 224px;
  flex-shrink: 0;
  background-color: var(--ct-bg-surface);
  border-right: 1px solid var(--ct-border-color);
  display: flex;
  flex-direction: column;
}

.ct-admin-sidebar__brand {
  height: var(--ct-header-height);
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--ct-font-size-lg);
  font-weight: 700;
  color: var(--ct-color-primary);
  border-bottom: 1px solid var(--ct-border-color);
}

.ct-admin-menu {
  border-right: none;
  padding-top: 8px;
}

.ct-admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.ct-admin-header {
  height: var(--ct-header-height);
  padding: 0 24px;
  background-color: var(--ct-bg-surface);
  border-bottom: 1px solid var(--ct-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ct-admin-header__title {
  margin: 0;
  font-size: var(--ct-font-size-lg);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.ct-admin-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ct-admin-header__user {
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-regular);
}

.ct-admin-content {
  flex: 1;
  padding: 24px;
}

.ct-admin-card {
  padding: 24px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border-color);
  border-radius: var(--ct-radius-md);
  box-shadow: var(--ct-shadow-sm);
}
</style>
