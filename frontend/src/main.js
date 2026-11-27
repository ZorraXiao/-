import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import '@/styles/variables.css'
import '@/styles/global.css'
import '@/features/profile-admin/styles.css'
import App from '@/App.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { setUnauthorizedHandler } from '@/utils/request'
import { isDemoToken, profileAdminMock } from '@/features/profile-admin/config'

const app = createApp(App)
const pinia = createPinia()

// Pinia 必须在 router 之前挂载，确保首次路由守卫可执行 useAuthStore()
app.use(pinia)
// Switching from a demo build to the real API must require a real login.
const initialAuth = useAuthStore(pinia)
if (!profileAdminMock && isDemoToken(initialAuth.token)) initialAuth.clearAuth()
app.use(router)
app.use(ElementPlus, { locale: zhCn })

// 接通 Axios 401 钩子：清理登录态并跳转至登录页（已在登录页时避免重复跳转）
setUnauthorizedHandler(() => {
  const authStore = useAuthStore(pinia)
  if (authStore.isLoggedIn) {
    authStore.clearAuth()
  }
  const currentRoute = router.currentRoute.value
  if (currentRoute.path === '/login') {
    return
  }
  router.replace({
    path: '/login',
    query: { redirect: currentRoute.fullPath || '/' },
  })
})

app.mount('#app')
