import request from '@/utils/request'
import { ACCESS_TOKEN_KEY } from '@/stores/auth'
import { DEMO_TOKEN_PREFIX, isDemoToken, profileAdminMock } from './config.js'
import { createMockService, ProfileAdminError } from './mock-service.js'

let storage
try { storage = window.localStorage } catch { /* private browser storage */ }
const demoToken = () => storage?.getItem(ACCESS_TOKEN_KEY) || ''
const mock = profileAdminMock ? createMockService({ storage, getActorId: () => {
  const token = demoToken()
  return isDemoToken(token) ? token.slice(token.lastIndexOf(':') + 1) : ''
} }) : null

async function call(operation, method, path, payload, params) {
  if (profileAdminMock) {
    await new Promise(resolve => setTimeout(resolve, 120))
    return operation()
  }
  // A demonstration credential must never be sent to an actual backend.
  if (isDemoToken(demoToken())) throw new ProfileAdminError('请使用真实账号重新登录', 401, 'UNAUTHENTICATED')
  const res = await request({ method, url: path, params, data: payload, skipErrorToast: true })
  if (!['OK', 'CREATED', 'SUCCESS'].includes(res?.code)) throw new ProfileAdminError(res?.message || '请求失败', 400, res?.code)
  return res.data
}

export const profileAdminApi = {
  me: () => call(() => mock.me(), 'get', '/users/me'),
  updateMe: payload => call(() => mock.updateMe(payload), 'patch', '/users/me', payload),
  listMine: (kind, params) => call(() => mock.listMine(kind, params), 'get', `/users/me/${kind}`, undefined, params),
  detail: (kind, id, admin = false) => call(() => mock.detail(kind, id, admin), 'get',
    `${admin ? '/admin' : '/users/me'}/${kind}/${encodeURIComponent(id)}`),
  act: (kind, id, action) => call(() => mock.act(kind, id, action), action === 'resolve' ? 'patch' : 'post',
    `/${kind}/${encodeURIComponent(id)}/${action}`),
  listUsers: params => call(() => mock.listUsers(params), 'get', '/admin/users', undefined, params),
  setBan: (id, banned, payload) => call(() => mock.setBan(id, banned, payload), 'post',
    `/admin/users/${encodeURIComponent(id)}/${banned ? 'ban' : 'unban'}`, payload),
  listAdmin: (kind, params) => call(() => mock.listAdmin(kind, params), 'get', `/admin/${kind}`, undefined, params),
  moderate: (kind, id, action, payload) => call(() => mock.moderate(kind, id, action, payload),
    action === 'delete' ? 'delete' : 'post', `/admin/${kind}/${encodeURIComponent(id)}${action === 'delete' ? '' : `/${action}`}`, payload),
}
export function demoLogin(id) {
  if (!mock) throw new Error('演示入口已关闭')
  return { token: `${DEMO_TOKEN_PREFIX}${id}`, user: mock.demoUser(id) }
}
export function resetDemo() { if (mock) mock.reset() }
