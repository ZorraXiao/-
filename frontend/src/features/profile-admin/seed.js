export function createSeed() {
  const users = [
    { id: '1', username: 'admin01', nickname: '平台管理员', phone: '13800000001', role: 'admin' },
    { id: '2', username: 'lin_stu', nickname: '林同学', phone: '13800000002', role: 'user' },
    { id: '3', username: 'zhou_stu', nickname: '周同学', phone: '13800000003', role: 'user' },
    { id: '4', username: 'chen_stu', nickname: '陈同学', phone: '13800000004', role: 'user' },
    { id: '5', username: 'spam_usr', nickname: '测试封禁号', phone: '13800000005', role: 'user' },
    ...Array.from({ length: 22 }, (_, index) => ({
      id: String(index + 6), username: `student_${index + 6}`, nickname: `校园同学 ${index + 6}`,
      phone: `139${String(index + 6).padStart(8, '0')}`, role: 'user',
    })),
  ].map(user => ({ ...user, avatar_url: '', is_active: user.id !== '5',
    banned_reason: user.id === '5' ? '发布违规广告信息' : null,
    banned_at: user.id === '5' ? '2026-11-25T09:00:00Z' : null,
    created_at: '2026-11-20T01:00:00Z', updated_at: '2026-11-20T01:00:00Z' }))
  const base = { moderation_status: 'normal', taken_down_reason: null, taken_down_at: null,
    is_deleted: false, deleted_at: null, deleted_by: null, created_at: '2026-11-26T08:00:00Z',
    updated_at: '2026-11-26T08:00:00Z' }
  const product = (id, seller_id, title, price_cents, status = 'on_sale') => ({ ...base,
    id, seller_id, title, price_cents, status, category_name: '书籍教材',
    cover_url: '/illustrations/campus-desk-books.jpg', description: '物品保存完好，可在图书馆门口当面检查并交接。',
    contact_info: users.find(user => user.id === seller_id).phone,
    off_shelf_at: status === 'off_shelf' ? '2026-11-26T09:00:00Z' : null })
  const products = [
    product('101', '2', '软件工程导论（第六版）九成新', 2500),
    product('102', '3', '罗技无线静音鼠标 M330', 6800),
    product('103', '2', '宿舍桌面折叠小风扇', 1800, 'off_shelf'),
    { ...product('104', '5', '测试违规商品', 100), moderation_status: 'taken_down',
      taken_down_reason: '包含站外违规广告', taken_down_at: '2026-11-26T09:00:00Z' },
    ...Array.from({ length: 12 }, (_, index) => product(String(110 + index), '2',
      ['高等数学学习笔记', '英语四级词汇书', '计算机网络教材', '校园手帐本'][index % 4] + ` · ${index + 1}`, 1000 + index * 150)),
  ]
  const lostFound = [
    { ...base, id: '201', publisher_id: '2', item_type: 'lost', item_name: '黑色不锈钢保温杯',
      location: '第二教学楼 302 教室', contact_info: users[1].phone, description: '杯身有航天贴纸，昨天下午下课后遗落。', status: 'searching', resolved_at: null },
    { ...base, id: '202', publisher_id: '3', item_type: 'found', item_name: '校园一卡通（尾号6821）',
      location: '图书馆二楼自习区', contact_info: users[2].phone, description: '带透明卡套，请核对认领。', status: 'unclaimed', resolved_at: null },
    { ...base, id: '205', publisher_id: '2', item_type: 'found', item_name: '蓝色折叠雨伞',
      location: '一食堂门口', contact_info: users[1].phone, description: '伞柄上有一枚星星贴纸。', status: 'unclaimed', resolved_at: null },
    { ...base, id: '206', publisher_id: '2', item_type: 'lost', item_name: '无线耳机充电盒',
      location: '南区操场', contact_info: users[1].phone, description: '物品已经找回，保留记录。', status: 'resolved', resolved_at: '2026-11-26T10:00:00Z' },
  ]
  const errand = (id, publisher_id, accepter_id, status, start_location, end_location, item_desc) => ({
    ...base, id, publisher_id, accepter_id, status, start_location, end_location, item_desc,
    fee_cents: 500, contact_info: users.find(user => user.id === publisher_id).phone,
    accepted_at: status !== 'pending' ? '2026-11-26T08:10:00Z' : null,
    delivered_at: ['pending_confirm', 'completed'].includes(status) ? '2026-11-26T08:30:00Z' : null,
    completed_at: status === 'completed' ? '2026-11-26T08:40:00Z' : null,
  })
  const errands = [
    errand('301', '3', null, 'pending', '北门菜鸟驿站', '梅园 5 栋', '代取中号快递一个。'),
    errand('302', '3', '2', 'in_progress', '西区打印店', '一教 105 教室', '取已打印好的实验报告两份。'),
    errand('303', '2', '4', 'pending_confirm', '二食堂', '竹园 2 栋', '代买一份打包米饭，等待发布者确认。'),
    errand('304', '2', '4', 'completed', '南门丰巢快递柜', '兰园 3 栋', '书籍包裹已完成交付。'),
    errand('305', '2', null, 'pending', '校门口文具店', '图书馆', '代取一袋文具。'),
    errand('306', '2', '3', 'in_progress', '一食堂', '教学楼 B 座', '代送午餐。'),
    errand('307', '3', '2', 'completed', '图书馆服务台', '实验楼', '资料已经送达并确认。'),
    errand('308', '4', '2', 'pending_confirm', '东门快递点', '荷园 1 栋', '快递已经送达，等待对方确认。'),
  ]
  return { version: 1, users, products, 'lost-found': lostFound, errands, audit_logs: [] }
}
