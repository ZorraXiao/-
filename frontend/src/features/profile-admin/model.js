export const CONTENT = {
  products: { title: '商品', tag: 'product', statuses: { on_sale: '在售', off_shelf: '已下架' }, create: '/products/create' },
  'lost-found': { title: '失物信息', tag: 'lost_found', statuses: { searching: '寻找中', unclaimed: '待认领', resolved: '已完结' }, create: '/lost-found/create' },
  errands: { title: '跑腿任务', tag: 'errand', statuses: { pending: '待接单', in_progress: '进行中', pending_confirm: '待确认', completed: '已完成' }, create: '/errands/create' },
}
export const titleOf = row => row.title || row.item_name || `${row.start_location} → ${row.end_location}`
export const detailPath = (kind, id, admin = false) => `${admin ? '/admin' : '/profile'}/content/${kind}/${id}`
export function availableAction(kind, row, userId) {
  if (!row || row.is_deleted || row.moderation_status !== 'normal') return null
  if (kind === 'products' && row.seller_id === userId && row.status === 'on_sale') return { key: 'off-shelf', label: '下架', confirm: '下架后将隐藏联系方式，并从商品大厅移除。' }
  if (kind === 'lost-found' && row.publisher_id === userId && ['searching', 'unclaimed'].includes(row.status)) return { key: 'resolve', label: '已完结', confirm: '请确认物品已找回或归还。完结后将隐藏联系方式。' }
  if (kind === 'errands' && row.accepter_id === userId && row.status === 'in_progress') return { key: 'deliver', label: '确认送达', confirm: '请确认已经送达。提交后等待发布者确认完成。' }
  if (kind === 'errands' && row.publisher_id === userId && row.status === 'pending_confirm') return { key: 'complete', label: '确认完成', confirm: '请确认任务已经完成。确认后将保留为历史记录。' }
  return null
}
