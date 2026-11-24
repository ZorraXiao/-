import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import '@/styles/variables.css'
import '@/styles/global.css'
import App from '@/App.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { setUnauthorizedHandler } from '@/utils/request'

const app = createApp(App)
const pinia = createPinia()

// Pinia 必须在 router 之前挂载，确保首次路由守卫可执行 useAuthStore()
app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale: zhCn })

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

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
