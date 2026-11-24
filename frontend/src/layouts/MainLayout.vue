<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Shop, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { label: '二手交易', path: '/products' },
  { label: '失物招领', path: '/lost-found' },
  { label: '跑腿服务', path: '/errands' },
]

const displayName = computed(
  () => authStore.userInfo?.nickname || authStore.userInfo?.username || '已登录用户'
)

const avatarInitial = computed(() => displayName.value.slice(0, 1).toUpperCase())

function isNavActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function handleLogout() {
  authStore.clearAuth()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <div class="ct-main-layout">
    <header class="ct-header">
      <div class="ct-container ct-header__inner">
        <router-link to="/" class="ct-header__brand">
          <span class="ct-header__logo">
            <el-icon><Shop /></el-icon>
          </span>
          <span class="ct-header__brand-name">校园交易平台</span>
        </router-link>

        <nav class="ct-header__nav" aria-label="主导航">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="['ct-header__nav-link', { 'is-active': isNavActive(item.path) }]"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="ct-header__actions">
          <template v-if="!authStore.isLoggedIn">
            <router-link to="/login">
              <el-button type="primary">登录 / 注册</el-button>
            </router-link>
          </template>
          <template v-else>
            <router-link v-if="authStore.isAdmin" to="/admin">
              <el-button type="warning" plain size="small">后台管理</el-button>
            </router-link>

            <router-link
              to="/profile"
              :class="['ct-header__user', { 'is-active': isNavActive('/profile') }]"
            >
              <el-avatar :size="30" :src="authStore.userInfo?.avatar_url || undefined">
                {{ avatarInitial }}
              </el-avatar>
              <span class="ct-header__nickname">{{ displayName }}</span>
            </router-link>

            <router-link to="/profile" class="ct-header__profile-link">
              <el-button text type="primary">
                <el-icon><User /></el-icon>
                <span>个人中心</span>
              </el-button>
            </router-link>

            <el-button link type="danger" @click="handleLogout">退出登录</el-button>
          </template>
        </div>
      </div>
    </header>

    <main class="ct-main-layout__content">
      <div class="ct-container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.ct-main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--ct-bg-page);
}

.ct-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--ct-header-height);
  background-color: var(--ct-bg-surface);
  border-bottom: 1px solid var(--ct-border-color);
  box-shadow: var(--ct-shadow-sm);
}

.ct-header__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.ct-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: var(--ct-font-size-lg);
  font-weight: 700;
  color: var(--ct-text-primary);
  white-space: nowrap;
}

.ct-header__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #ffffff;
  background-color: var(--ct-color-primary);
  border-radius: var(--ct-radius-sm);
}

.ct-header__nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ct-header__nav-link {
  padding: 8px 14px;
  font-size: var(--ct-font-size-base);
  font-weight: 500;
  color: var(--ct-text-regular);
  border-radius: var(--ct-radius-sm);
  transition: color 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}

.ct-header__nav-link:hover {
  color: var(--ct-color-primary);
  background-color: var(--ct-color-primary-lighter);
}

.ct-header__nav-link.is-active {
  color: var(--ct-color-primary);
  background-color: var(--ct-color-primary-lighter);
  font-weight: 600;
}

.ct-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.ct-header__user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: var(--ct-radius-round);
  color: var(--ct-text-primary);
  transition: background-color 0.15s ease;
}

.ct-header__user:hover,
.ct-header__user.is-active {
  background-color: var(--ct-bg-subtle);
}

.ct-header__nickname {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
}

.ct-main-layout__content {
  flex: 1;
  padding: 24px 0 48px;
}

@media (max-width: 768px) {
  .ct-header__profile-link {
    display: none;
  }

  .ct-header__brand-name {
    display: none;
  }
}
</style>
