-- ============================================================================
-- 校园交易平台 —— 测试初始化数据 (v1.0)
-- 说明：
--   1. 本脚本会在 Docker 容器首次启动时紧随 01_schema.sql 自动执行。
--   2. 当前 password_hash 为占位值，待成员 7 确定认证哈希算法（bcrypt / Argon2id）后，
--      可通过 scripts/update_seed_passwords.py 生成并替换为真实哈希。
--   3. 手机号与业务内容均为开发测试虚构数据。
-- ============================================================================

USE `campus_trading_platform`;
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 1. 测试用户
INSERT INTO `users` (`id`, `username`, `password_hash`, `nickname`, `phone`, `avatar_url`, `role`, `is_active`, `banned_at`, `banned_reason`, `created_at`) VALUES
  (1, 'admin01',  '$2b$12$PLACEHOLDER_HASH_ADMIN01_REPLACE_BEFORE_USE_XXXXXXXXXX', '平台管理员', '13800000001', '/static/avatars/admin.png',   'admin', 1, NULL, NULL, '2026-11-20 01:00:00.000'),
  (2, 'lin_stu',  '$2b$12$PLACEHOLDER_HASH_LINSTU_REPLACE_BEFORE_USE_XXXXXXXXXXX', '林同学',     '13800000002', '/static/avatars/default.png', 'user',  1, NULL, NULL, '2026-11-20 02:00:00.000'),
  (3, 'zhou_stu', '$2b$12$PLACEHOLDER_HASH_ZHOUSTU_REPLACE_BEFORE_USE_XXXXXXXXXX', '周同学',     '13800000003', '/static/avatars/default.png', 'user',  1, NULL, NULL, '2026-11-20 02:15:00.000'),
  (4, 'chen_stu', '$2b$12$PLACEHOLDER_HASH_CHENSTU_REPLACE_BEFORE_USE_XXXXXXXXXX', '陈同学',     '13800000004', '/static/avatars/default.png', 'user',  1, NULL, NULL, '2026-11-20 02:30:00.000'),
  (5, 'spam_usr', '$2b$12$PLACEHOLDER_HASH_SPAMUSR_REPLACE_BEFORE_USE_XXXXXXXXXX', '测试封禁号', '13800000005', '/static/avatars/default.png', 'user',  0, '2026-11-21 04:00:00.000', '发布违规广告信息', '2026-11-20 03:00:00.000')
AS `new_u`
ON DUPLICATE KEY UPDATE `nickname` = `new_u`.`nickname`;

-- 2. 测试二手商品（价格单位：分）
INSERT INTO `products` (`id`, `seller_id`, `category_id`, `title`, `price_cents`, `description`, `contact_info`, `status`, `off_shelf_at`, `moderation_status`, `taken_down_reason`, `taken_down_at`, `is_deleted`, `created_at`) VALUES
  (101, 2, 1, '软件工程导论（第六版）九成新', 2500, '课本干净无涂画，附期末笔记，图书馆面交。', '13800000002', 'on_sale',   NULL,                      'normal',     NULL,               NULL,                      0, '2026-11-21 06:00:00.000'),
  (102, 3, 2, '罗技无线静音鼠标 M330',       6800, '上学期购买，带接收器，支持现场试机。',       '13800000003', 'on_sale',   NULL,                      'normal',     NULL,               NULL,                      0, '2026-11-21 07:30:00.000'),
  (103, 2, 3, '宿舍桌面折叠小风扇',           1800, 'USB充电三档风速，已线下成交。',               '13800000002', 'off_shelf', '2026-11-22 05:00:00.000', 'normal',     NULL,               NULL,                      0, '2026-11-21 08:00:00.000'),
  (104, 5, 6, '测试违规商品',                  100, '用于测试违规下架与大厅过滤逻辑。',             '13800000005', 'on_sale',   NULL,                      'taken_down', '包含站外违规广告', '2026-11-22 06:10:00.000', 0, '2026-11-21 09:00:00.000')
AS `new_p`
ON DUPLICATE KEY UPDATE `title` = `new_p`.`title`;

-- 3. 测试商品图片（sort_order = 1 为封面图）
INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `file_size_bytes`, `mime_type`, `sort_order`, `created_at`) VALUES
  (1001, 101, '/static/uploads/products/101_1.jpg',  245120, 'image/jpeg', 1, '2026-11-21 06:00:00.000'),
  (1002, 101, '/static/uploads/products/101_2.jpg',  312800, 'image/jpeg', 2, '2026-11-21 06:00:00.000'),
  (1003, 102, '/static/uploads/products/102_1.png',  418900, 'image/png',  1, '2026-11-21 07:30:00.000'),
  (1004, 103, '/static/uploads/products/103_1.webp', 198400, 'image/webp', 1, '2026-11-21 08:00:00.000'),
  (1005, 104, '/static/uploads/products/104_1.jpg',  150000, 'image/jpeg', 1, '2026-11-21 09:00:00.000')
AS `new_img`
ON DUPLICATE KEY UPDATE `image_url` = `new_img`.`image_url`;

-- 4. 测试失物招领
INSERT INTO `lost_found_items` (`id`, `publisher_id`, `item_type`, `item_name`, `location`, `contact_info`, `description`, `status`, `resolved_at`, `moderation_status`, `is_deleted`, `created_at`) VALUES
  (201, 2, 'lost',  '黑色不锈钢保温杯',     '第二教学楼 302 教室', '13800000002', '杯身贴有贴纸，昨日下午下课后遗落。',       'searching', NULL,                      'normal', 0, '2026-11-21 10:00:00.000'),
  (202, 3, 'found', '校园一卡通（尾号6821）', '图书馆二楼自习区',   '13800000003', '在北窗桌上拾到，带透明卡套，请核对认领。', 'unclaimed', NULL,                      'normal', 0, '2026-11-21 11:00:00.000'),
  (203, 4, 'lost',  '无线蓝牙耳机充电盒',   '南区操场看台',       '13800000004', '已找回，用于测试完结状态隐藏联系方式。',   'resolved',  '2026-11-22 08:30:00.000', 'normal', 0, '2026-11-20 12:00:00.000')
AS `new_lf`
ON DUPLICATE KEY UPDATE `item_name` = `new_lf`.`item_name`;

-- 5. 测试跑腿任务
INSERT INTO `errands` (`id`, `publisher_id`, `accepter_id`, `start_location`, `end_location`, `fee_cents`, `item_desc`, `contact_info`, `status`, `accepted_at`, `delivered_at`, `completed_at`, `moderation_status`, `is_deleted`, `created_at`) VALUES
  (301, 3, NULL, '北门菜鸟驿站',   '梅园 5 栋楼下',   500, '代取中号快递一个，18点前送达即可。',     '13800000003', 'pending',         NULL,                      NULL,                      NULL,                      'normal', 0, '2026-11-22 09:00:00.000'),
  (302, 3, 2,    '西区打印店',     '一教 105 教室',   300, '帮忙取已打印好的实验报告两份。',         '13800000003', 'in_progress',     '2026-11-22 09:20:00.000', NULL,                      NULL,                      'normal', 0, '2026-11-22 09:05:00.000'),
  (303, 4, 2,    '二食堂一楼窗口', '竹园 2 栋宿管处', 400, '代买一份打包米饭，已送到宿管处待确认。', '13800000004', 'pending_confirm', '2026-11-22 04:10:00.000', '2026-11-22 04:35:00.000', NULL,                      'normal', 0, '2026-11-22 04:00:00.000'),
  (304, 2, 4,    '南门丰巢快递柜', '兰园 3 栋楼下',   600, '代取书籍包裹一件，已完成交付。',         '13800000002', 'completed',       '2026-11-21 03:10:00.000', '2026-11-21 03:30:00.000', '2026-11-21 03:45:00.000', 'normal', 0, '2026-11-21 03:00:00.000')
AS `new_e`
ON DUPLICATE KEY UPDATE `item_desc` = `new_e`.`item_desc`;

-- 6. 测试操作日志
INSERT INTO `admin_audit_logs` (`id`, `admin_id`, `target_type`, `target_id`, `action`, `before_snapshot`, `after_snapshot`, `reason`, `client_ip`, `created_at`) VALUES
  (501, 1, 'user',    5,   'ban_user',  JSON_OBJECT('is_active', 1),                JSON_OBJECT('is_active', 0),                    '发布违规广告信息', '127.0.0.1', '2026-11-21 04:00:00.000'),
  (502, 1, 'product', 104, 'take_down', JSON_OBJECT('moderation_status', 'normal'), JSON_OBJECT('moderation_status', 'taken_down'), '包含站外违规广告', '127.0.0.1', '2026-11-22 06:10:00.000')
AS `new_log`
ON DUPLICATE KEY UPDATE `reason` = `new_log`.`reason`;
