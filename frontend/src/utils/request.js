import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getActivePinia } from 'pinia'
import {
  ACCESS_TOKEN_KEY,
  USER_INFO_KEY,
  useAuthStore,
} from '@/stores/auth'

// 预留未认证（401）跳转 /login 钩子，供后续路由模块注册，避免循环依赖
let unauthorizedHandler = null
let isHandling401 = false

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null
}

function readFallbackToken() {
  try {
    if (getActivePinia()) {
      return useAuthStore().token
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(ACCESS_TOKEN_KEY) || ''
    }
  } catch {
    return ''
  }
  return ''
}

function clearAuthState() {
  try {
    if (getActivePinia()) {
      useAuthStore().clearAuth()
      return
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY)
      window.localStorage.removeItem(USER_INFO_KEY)
    }
  } catch {
    // ignore
  }
}

function pickMessage(resBody, fallback) {
  if (resBody && typeof resBody === 'object' && typeof resBody.message === 'string') {
    const trimmed = resBody.message.trim()
    if (trimmed) return trimmed
  }
  return fallback
}

function formatValidationMessage(resBody) {
  const fields = resBody?.data?.fields
  if (Array.isArray(fields) && fields.length > 0) {
    const details = fields
      .map((item) => {
        if (!item || typeof item !== 'object') return ''
        if (item.field && item.reason) return `${item.field}：${item.reason}`
        return item.reason || item.message || ''
      })
      .filter(Boolean)
    if (details.length > 0) {
      return details.join('；')
    }
  }
  return pickMessage(resBody, '请求参数不合法')
}

const STATUS_FALLBACK_MESSAGES = {
  400: '请求参数或操作状态不合法',
  404: '请求的资源不存在',
  409: '操作冲突或当前状态不允许操作',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误，请稍后再试',
}

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    const token = readFallbackToken()
    if (token && !config.skipAuth && !config.headers.has('Authorization')) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    // FormData 上传时删除显式 Content-Type，交由浏览器自动生成 multipart/form-data boundary
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.headers.delete('Content-Type')
    }

    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => {
    const responseType = response.config?.responseType
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      return response.data
    }
    return response.data
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const skipToast = Boolean(error.config?.skipErrorToast)
    const response = error.response

    if (!response) {
      const isTimeout =
        error.code === 'ECONNABORTED' ||
        (typeof error.message === 'string' && error.message.toLowerCase().includes('timeout'))
      if (!skipToast) {
        ElMessage.error(isTimeout ? '请求超时，请检查网络连接' : '网络异常，无法连接服务器')
      }
      return Promise.reject(error)
    }

    const { status, data: resBody } = response

    if (status === 401) {
      clearAuthState()
      if (!isHandling401) {
        isHandling401 = true
        setTimeout(() => {
          isHandling401 = false
        }, 500)

        if (!skipToast) {
          ElMessage.error(pickMessage(resBody, '登录状态已失效，请重新登录'))
        }
        if (unauthorizedHandler) {
          unauthorizedHandler(error)
        }
      }
      return Promise.reject(error)
    }

    if (!skipToast) {
      if (status === 403) {
        ElMessage.error(pickMessage(resBody, '权限不足或账号已被停用'))
      } else if (status === 422) {
        ElMessage.error(formatValidationMessage(resBody))
      } else {
        const fallback = STATUS_FALLBACK_MESSAGES[status] || '请求失败，请稍后重试'
        ElMessage.error(pickMessage(resBody, fallback))
      }
    }

    return Promise.reject(error)
  }
)

export default request
