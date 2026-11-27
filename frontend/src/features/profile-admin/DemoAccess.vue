<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { demoLogin, resetDemo } from './api'
import { profileAdminMock } from './config'
const router = useRouter(), route = useRoute(), auth = useAuthStore()
function enter(id) {
  try {
    const { token, user } = demoLogin(id)
    auth.setAuth(token, user)
    const redirect = String(route.query.redirect || '')
    const safe = /^\/(?!\/)/.test(redirect) && !redirect.startsWith('/login') && (user.role === 'admin' || !redirect.startsWith('/admin'))
    router.replace(safe ? redirect : user.role === 'admin' ? '/admin/users' : '/profile')
  } catch (error) { ElMessage.error(error.message) }
}
async function reset() {
  try {
    await ElMessageBox.confirm('将清除本机演示中的资料修改和管理操作，恢复初始样例。', '重置演示数据', { confirmButtonText: '确认重置', cancelButtonText: '取消' })
    resetDemo(); auth.clearAuth(); ElMessage.success('演示数据已重置')
  } catch (error) { if (!['cancel', 'close'].includes(error)) ElMessage.error(error.message) }
}
</script>
<template>
  <section v-if="profileAdminMock" class="pa-demo-access" aria-label="本地演示入口">
    <p class="pa-demo-access__title">先体验个人中心与管理后台</p>
    <p>演示操作仅保存在当前浏览器，不会修改服务器数据。</p>
    <div class="pa-actions">
      <el-button @click="enter('2')">以林同学体验</el-button>
      <el-button @click="enter('1')">进入管理员演示</el-button>
      <el-button link @click="reset">重置演示数据</el-button>
    </div>
  </section>
</template>
