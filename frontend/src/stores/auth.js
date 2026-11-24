import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const ACCESS_TOKEN_KEY = 'ct_access_token'
export const USER_INFO_KEY = 'ct_user_info'

function getStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

function readToken() {
  const storage = getStorage()
  if (!storage) return ''
  try {
    const raw = storage.getItem(ACCESS_TOKEN_KEY)
    return typeof raw === 'string' ? raw.trim() : ''
  } catch {
    return ''
  }
}

function writeToken(token) {
  const storage = getStorage()
  if (!storage) return
  try {
    if (token) {
      storage.setItem(ACCESS_TOKEN_KEY, token)
    } else {
      storage.removeItem(ACCESS_TOKEN_KEY)
    }
  } catch {
    // 忽略无痕模式或存储配额异常
  }
}

function normalizeUserInfo(raw) {
  if (!raw || typeof raw !== 'object') return null
  return {
    ...raw,
    // 后端主键为 BIGINT，对外接口以字符串返回，这里强制保持字符串防止前端精度丢失
    id: raw.id !== undefined && raw.id !== null ? String(raw.id) : '',
    username: raw.username ?? '',
    nickname: raw.nickname ?? '',
    phone: raw.phone ?? '',
    avatar_url: raw.avatar_url ?? '',
    role: raw.role ?? 'user',
    is_active: raw.is_active === undefined ? true : Boolean(raw.is_active),
  }
}

function readUserInfo() {
  const storage = getStorage()
  if (!storage) return null
  try {
    const raw = storage.getItem(USER_INFO_KEY)
    if (!raw) return null
    return normalizeUserInfo(JSON.parse(raw))
  } catch {
    try {
      storage.removeItem(USER_INFO_KEY)
    } catch {
      // ignore
    }
    return null
  }
}

function writeUserInfo(user) {
  const storage = getStorage()
  if (!storage) return
  try {
    if (user) {
      storage.setItem(USER_INFO_KEY, JSON.stringify(user))
    } else {
      storage.removeItem(USER_INFO_KEY)
    }
  } catch {
    // ignore
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(readToken())
  const userInfo = ref(readUserInfo())

  const isLoggedIn = computed(() => Boolean(token.value))
  const isAdmin = computed(
    () => Boolean(token.value) && userInfo.value?.role === 'admin'
  )

  /**
   * 写入认证凭据与用户信息，支持 (token, userInfo) 或 ({ access_token, user }) 两种传参。
   */
  function setAuth(tokenOrPayload, maybeUser) {
    let nextToken = ''
    let hasUser = false
    let nextUser = null

    if (tokenOrPayload && typeof tokenOrPayload === 'object') {
      nextToken = tokenOrPayload.access_token ?? tokenOrPayload.token ?? ''
      if ('user' in tokenOrPayload || 'userInfo' in tokenOrPayload) {
        hasUser = true
        nextUser = tokenOrPayload.user ?? tokenOrPayload.userInfo ?? null
      }
    } else {
      nextToken = tokenOrPayload ?? ''
      if (maybeUser !== undefined) {
        hasUser = true
        nextUser = maybeUser
      }
    }

    const normalizedToken = typeof nextToken === 'string' ? nextToken.trim() : String(nextToken || '')
    token.value = normalizedToken
    writeToken(normalizedToken)

    if (hasUser) {
      const normalizedUser = normalizeUserInfo(nextUser)
      userInfo.value = normalizedUser
      writeUserInfo(normalizedUser)
    }
  }

  /**
   * 增量更新当前用户资料并同步持久化到 localStorage。
   */
  function updateUserInfo(patch) {
    if (!patch || typeof patch !== 'object') return
    const merged = normalizeUserInfo({
      ...(userInfo.value || {}),
      ...patch,
    })
    userInfo.value = merged
    writeUserInfo(merged)
  }

  /**
   * 清空内存与本地存储中的登录态。
   */
  function clearAuth() {
    token.value = ''
    userInfo.value = null
    writeToken('')
    writeUserInfo(null)
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    isAdmin,
    setAuth,
    updateUserInfo,
    clearAuth,
  }
})
