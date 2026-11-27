import { createSeed } from './seed.js'

export const DATABASE_KEY = 'ct_profile_admin_demo_v1'
const clone = value => JSON.parse(JSON.stringify(value))
const kinds = ['products', 'lost-found', 'errands']
const statuses = { products: ['on_sale', 'off_shelf'], 'lost-found': ['searching', 'unclaimed', 'resolved'],
  errands: ['pending', 'in_progress', 'pending_confirm', 'completed'] }
export class ProfileAdminError extends Error {
  constructor(message, status = 409, code = 'INVALID_STATE_TRANSITION') {
    super(message)
    this.status = status
    this.code = code
  }
}
const fail = (message, status, code) => { throw new ProfileAdminError(message, status, code) }

// All state changes read the latest snapshot, validate, and save together with their audit record.
// This is a local demonstration of the contract; real authorization/transactions belong to the API.
export function createMockService({ storage, getActorId, now = () => new Date().toISOString() }) {
  let memory = null
  function read() {
    let value
    try { value = JSON.parse(storage?.getItem(DATABASE_KEY) || 'null') } catch { /* empty or unavailable */ }
    if (value?.version === 1 && ['users', ...kinds, 'audit_logs'].every(key => Array.isArray(value[key]))) return value
    return clone(memory || createSeed())
  }
  function save(db) {
    // A failed storage write must not report a successful persistent mutation.
    if (storage) storage.setItem(DATABASE_KEY, JSON.stringify(db))
    memory = clone(db)
  }
  function actor(db, admin = false) {
    const user = db.users.find(item => item.id === String(getActorId() || ''))
    if (!user) fail('登录状态已失效，请重新登录', 401, 'UNAUTHENTICATED')
    if (!user.is_active) fail('账号已被封禁，请联系管理员', 403, 'FORBIDDEN')
    if (admin && user.role !== 'admin') fail('仅管理员可以执行此操作', 403, 'FORBIDDEN')
    return user
  }
  function collection(db, kind) {
    if (!kinds.includes(kind)) fail('内容类型不存在', 404, 'ROUTE_NOT_FOUND')
    return db[kind]
  }
  function find(db, kind, id) {
    const item = collection(db, kind).find(row => row.id === String(id) && !row.is_deleted)
    if (!item) fail('内容不存在或已被删除', 404, { products: 'PRODUCT_NOT_FOUND', 'lost-found': 'LOST_FOUND_NOT_FOUND', errands: 'ERRAND_NOT_FOUND' }[kind])
    return item
  }
  function owner(kind, item) { return kind === 'products' ? item.seller_id : item.publisher_id }
  function canRead(kind, item, user) {
    return owner(kind, item) === user.id || (kind === 'errands' && item.accepter_id === user.id)
  }
  function view(db, kind, item) {
    const result = clone(item)
    result.publisher_nickname = db.users.find(user => user.id === owner(kind, item))?.nickname || '校园用户'
    if (kind === 'errands') result.accepter_nickname = db.users.find(user => user.id === item.accepter_id)?.nickname || null
    if (item.moderation_status === 'taken_down' ||
      (kind === 'products' && item.status === 'off_shelf') ||
      (kind === 'lost-found' && item.status === 'resolved') ||
      (kind === 'errands' && item.status === 'completed')) result.contact_info = null
    return result
  }
  function paginate(rows, params = {}) {
    const page = Number(params.page ?? 1), pageSize = Number(params.page_size ?? 20)
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      fail('分页参数不合法', 422, 'VALIDATION_ERROR')
    }
    const keyword = String(params.keyword || '').trim().toLowerCase()
    if (keyword.length > 100) fail('关键词不能超过 100 个字符', 422, 'VALIDATION_ERROR')
    const filtered = rows.filter(row => {
      const text = [row.title, row.item_name, row.item_desc, row.start_location, row.end_location,
        row.nickname, row.username, row.phone, row.publisher_nickname].filter(Boolean).join(' ').toLowerCase()
      return (!keyword || text.includes(keyword)) &&
        (!params.status || row.status === params.status) &&
        (!params.moderation_status || row.moderation_status === params.moderation_status) &&
        (params.is_active === undefined || params.is_active === '' || row.is_active === (String(params.is_active) === 'true'))
    }).sort((a, b) => b.created_at.localeCompare(a.created_at) ||
      (BigInt(b.id) > BigInt(a.id) ? 1 : BigInt(b.id) < BigInt(a.id) ? -1 : 0))
    return { items: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, page_size: pageSize }
  }
  function reasonOf(payload) {
    const reason = String(payload?.reason || '').trim()
    if (!reason || reason.length > 255) fail('请输入 1–255 字的操作原因', 422, 'VALIDATION_ERROR')
    return reason
  }
  function validateFilters(kind, params) {
    if (params.status && !statuses[kind]?.includes(params.status)) fail('状态参数不合法', 422, 'VALIDATION_ERROR')
    if (params.moderation_status && !['normal', 'taken_down'].includes(params.moderation_status)) fail('治理状态不合法', 422, 'VALIDATION_ERROR')
    if (params.participation && (kind !== 'errands' || !['published', 'accepted'].includes(params.participation))) fail('参与身份不合法', 422, 'VALIDATION_ERROR')
  }
  function audit(db, user, type, target, action, before, reason = null) {
    db.audit_logs.push({ id: String(db.audit_logs.length + 1), admin_id: user.id, target_type: type,
      target_id: target.id, action, reason, before_snapshot: before, after_snapshot: clone(target), created_at: now() })
  }
  return {
    demoUser(id) {
      const user = read().users.find(row => row.id === String(id))
      if (!user?.is_active) fail('此演示账号已封禁，请先在管理员演示中解封', 403, 'FORBIDDEN')
      return clone(user)
    },
    reset() { save(createSeed()) },
    me() { const db = read(); return clone(actor(db)) },
    updateMe(payload) {
      const db = read(), user = actor(db)
      if (Object.keys(payload).some(key => !['nickname', 'phone'].includes(key))) fail('包含不允许修改的字段', 422, 'VALIDATION_ERROR')
      if (Object.keys(payload).some(key => typeof payload[key] !== 'string')) fail('昵称和手机号必须是字符串', 422, 'VALIDATION_ERROR')
      const nickname = String(payload.nickname ?? user.nickname).trim(), phone = String(payload.phone ?? user.phone).trim()
      if (!nickname || [...nickname].length > 20 || !/^1[3-9]\d{9}$/.test(phone)) fail('昵称或手机号格式不正确', 422, 'VALIDATION_ERROR')
      if (db.users.some(item => item.id !== user.id && item.phone === phone)) fail('该手机号已被其他账号使用', 409, 'ACCOUNT_CONFLICT')
      Object.assign(user, { nickname, phone, updated_at: now() })
      save(db)
      return clone(user)
    },
    listMine(kind, params = {}) {
      const db = read(), user = actor(db)
      validateFilters(kind, params)
      const rows = collection(db, kind).filter(row => !row.is_deleted &&
        (kind === 'errands' && params.participation === 'accepted' ? row.accepter_id === user.id : owner(kind, row) === user.id))
      return paginate(rows.map(row => view(db, kind, row)), params)
    },
    detail(kind, id, admin = false) {
      const db = read(), user = actor(db, admin), item = find(db, kind, id)
      if (!admin && !canRead(kind, item, user)) fail('只能查看自己的发布或接单记录', 403, 'FORBIDDEN')
      return view(db, kind, item)
    },
    act(kind, id, action) {
      const db = read(), user = actor(db), item = find(db, kind, id)
      const rules = {
        'off-shelf': ['products', owner(kind, item), 'on_sale', 'off_shelf', 'off_shelf_at'],
        resolve: ['lost-found', item.publisher_id, ['searching', 'unclaimed'], 'resolved', 'resolved_at'],
        deliver: ['errands', item.accepter_id, 'in_progress', 'pending_confirm', 'delivered_at'],
        complete: ['errands', item.publisher_id, 'pending_confirm', 'completed', 'completed_at'],
      }
      const rule = rules[action]
      if (!rule || rule[0] !== kind) fail('操作不存在', 404, 'ROUTE_NOT_FOUND')
      if (rule[1] !== user.id) fail('你没有权限操作这条记录', 403, 'FORBIDDEN')
      if (item.moderation_status !== 'normal') fail('内容已被违规下架，暂不可操作', 409, 'INVALID_STATE_TRANSITION')
      if (![rule[2]].flat().includes(item.status)) fail('状态已更新，请刷新后再试', 409, 'INVALID_STATE_TRANSITION')
      Object.assign(item, { status: rule[3], [rule[4]]: now(), updated_at: now() })
      save(db)
      return view(db, kind, item)
    },
    listUsers(params = {}) {
      const db = read(); actor(db, true)
      if (params.is_active !== undefined && params.is_active !== '' && !['true', 'false'].includes(String(params.is_active))) fail('账号状态不合法', 422, 'VALIDATION_ERROR')
      return paginate(db.users, params)
    },
    setBan(id, banned, payload) {
      const db = read(), user = actor(db, true), target = db.users.find(row => row.id === String(id))
      if (!target) fail('用户不存在', 404, 'USER_NOT_FOUND')
      if (target.role === 'admin') fail('不能封禁管理员账号', 403, 'FORBIDDEN')
      if (target.is_active === !banned) fail('账号状态已经更新，请刷新', 409, 'CONFLICT')
      const reason = banned ? reasonOf(payload) : null, before = clone(target)
      Object.assign(target, { is_active: !banned, banned_reason: reason, banned_at: banned ? now() : null, updated_at: now() })
      audit(db, user, 'user', target, banned ? 'ban_user' : 'unban_user', before, reason)
      save(db)
      return clone(target)
    },
    listAdmin(kind, params = {}) {
      const db = read(); actor(db, true)
      validateFilters(kind, params)
      return paginate(collection(db, kind).filter(row => !row.is_deleted).map(row => view(db, kind, row)), params)
    },
    moderate(kind, id, action, payload) {
      const db = read(), user = actor(db, true), item = find(db, kind, id), before = clone(item)
      if (!['take-down', 'restore', 'delete'].includes(action)) fail('操作不存在', 404, 'ROUTE_NOT_FOUND')
      const reason = action === 'restore' ? null : reasonOf(payload)
      if (action === 'delete') Object.assign(item, { is_deleted: true, deleted_at: now(), deleted_by: user.id })
      else {
        const down = action === 'take-down'
        if (item.moderation_status === (down ? 'taken_down' : 'normal')) fail('内容状态已经更新，请刷新', 409, 'CONFLICT')
        Object.assign(item, { moderation_status: down ? 'taken_down' : 'normal',
          taken_down_reason: reason, taken_down_at: down ? now() : null })
      }
      item.updated_at = now()
      audit(db, user, { products: 'product', 'lost-found': 'lost_found', errands: 'errand' }[kind], item,
        { 'take-down': 'take_down', restore: 'restore', delete: 'soft_delete' }[action], before, reason)
      save(db)
      return action === 'delete' ? { id: item.id, is_deleted: true } : view(db, kind, item)
    },
  }
}
