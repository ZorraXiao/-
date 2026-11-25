-- ============================================================================
-- 校园交易平台 —— MySQL 8.0 建表脚本 (v1.0)
-- 引擎：InnoDB | 字符集：utf8mb4 | 时区：UTC
-- 注意：脚本中的 SET time_zone 仅对当前导入会话有效；运行时需在 MySQL 服务端
--       配置 default-time-zone = '+00:00'，且后端连接池建连时执行
--       SET time_zone = '+00:00'，以确保 DATETIME(3) 始终按 UTC 写入。
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `campus_trading_platform`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE `campus_trading_platform`;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 1. 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username`      VARCHAR(32)     NOT NULL                COMMENT '登录用户名（唯一）',
  `password_hash` VARCHAR(255)    NOT NULL                COMMENT '密码哈希值',
  `nickname`      VARCHAR(32)     NOT NULL                COMMENT '用户昵称',
  `phone`         VARCHAR(20)     NOT NULL                COMMENT '手机号（唯一）',
  `avatar_url`    VARCHAR(512)    NOT NULL DEFAULT '/static/avatars/default.png'
                                                          COMMENT '头像路径',
  `role`          ENUM('user', 'admin') NOT NULL DEFAULT 'user'
                                                          COMMENT '角色：user-普通用户，admin-管理员',
  `is_active`     TINYINT(1)      NOT NULL DEFAULT 1      COMMENT '账号状态：1-正常，0-已封禁',
  `banned_at`     DATETIME(3)     NULL     DEFAULT NULL   COMMENT '封禁时间（UTC）',
  `banned_reason` VARCHAR(255)    NULL     DEFAULT NULL   COMMENT '封禁原因',
  `created_at`    DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                                          COMMENT '注册时间（UTC）',
  `updated_at`    DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
                                                          COMMENT '更新时间（UTC）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_username` (`username`),
  UNIQUE KEY `uk_users_phone` (`phone`),
  KEY `idx_users_role_active_created` (`role`, `is_active`, `created_at`, `id`),
  CONSTRAINT `chk_users_is_active` CHECK (`is_active` IN (0, 1)),
  CONSTRAINT `chk_users_ban_consistency` CHECK (
    (`is_active` = 1 AND `banned_at` IS NULL AND `banned_reason` IS NULL)
    OR (`is_active` = 0 AND `banned_at` IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='用户表';

-- 2. 商品分类表
CREATE TABLE IF NOT EXISTS `product_categories` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `code`        VARCHAR(32)     NOT NULL                COMMENT '分类编码',
  `name`        VARCHAR(32)     NOT NULL                COMMENT '分类名称',
  `sort_order`  INT             NOT NULL DEFAULT 0      COMMENT '排序权重（升序）',
  `is_enabled`  TINYINT(1)      NOT NULL DEFAULT 1      COMMENT '是否启用：1-启用，0-停用',
  `created_at`  DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                                        COMMENT '创建时间（UTC）',
  `updated_at`  DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
                                                        COMMENT '更新时间（UTC）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_categories_code` (`code`),
  UNIQUE KEY `uk_product_categories_name` (`name`),
  KEY `idx_categories_enabled_sort` (`is_enabled`, `sort_order`, `id`),
  CONSTRAINT `chk_product_categories_enabled` CHECK (`is_enabled` IN (0, 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='二手商品分类表';

-- 3. 二手商品表
CREATE TABLE IF NOT EXISTS `products` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `seller_id`         BIGINT UNSIGNED NOT NULL                COMMENT '卖家用户ID',
  `category_id`       BIGINT UNSIGNED NOT NULL                COMMENT '商品分类ID',
  `title`             VARCHAR(64)     NOT NULL                COMMENT '商品标题',
  `price_cents`       BIGINT UNSIGNED NOT NULL                COMMENT '价格（单位：分，如2500表示25.00元）',
  `description`       TEXT            NOT NULL                COMMENT '商品描述',
  `contact_info`      VARCHAR(100)    NOT NULL                COMMENT '发布时保存的卖家联系方式快照',
  `status`            ENUM('on_sale', 'off_shelf') NOT NULL DEFAULT 'on_sale'
                                                              COMMENT '业务状态：on_sale-在售，off_shelf-已下架',
  `off_shelf_at`      DATETIME(3)     NULL     DEFAULT NULL   COMMENT '卖家下架时间（UTC）',
  `moderation_status` ENUM('normal', 'taken_down') NOT NULL DEFAULT 'normal'
                                                              COMMENT '治理状态：normal-正常，taken_down-违规下架',
  `taken_down_reason` VARCHAR(255)    NULL     DEFAULT NULL   COMMENT '违规下架原因',
  `taken_down_at`     DATETIME(3)     NULL     DEFAULT NULL   COMMENT '违规下架时间（UTC）',
  `is_deleted`        TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除：0-未删，1-已删',
  `deleted_at`        DATETIME(3)     NULL     DEFAULT NULL   COMMENT '逻辑删除时间（UTC）',
  `deleted_by`        BIGINT UNSIGNED NULL     DEFAULT NULL   COMMENT '执行删除的管理员ID',
  `created_at`        DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                                              COMMENT '发布时间（UTC）',
  `updated_at`        DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
                                                              COMMENT '更新时间（UTC）',
  PRIMARY KEY (`id`),
  KEY `idx_products_hall` (`is_deleted`, `moderation_status`, `status`, `created_at`, `id`),
  KEY `idx_products_cat_hall` (`is_deleted`, `moderation_status`, `status`, `category_id`, `created_at`, `id`),
  KEY `idx_products_cat_price` (`is_deleted`, `moderation_status`, `status`, `category_id`, `price_cents`, `id`),
  KEY `idx_products_seller` (`seller_id`, `is_deleted`, `created_at`, `id`),
  KEY `idx_products_admin` (`is_deleted`, `moderation_status`, `created_at`, `id`),
  KEY `idx_products_category_fk` (`category_id`),
  KEY `idx_products_deleted_by_fk` (`deleted_by`),
  CONSTRAINT `fk_products_seller`          FOREIGN KEY (`seller_id`)   REFERENCES `users` (`id`)              ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_products_category`        FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_products_deleted_by`      FOREIGN KEY (`deleted_by`)  REFERENCES `users` (`id`)              ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_products_price_pos`      CHECK (`price_cents` > 0),
  CONSTRAINT `chk_products_status_time`    CHECK (
    (`status` = 'on_sale'   AND `off_shelf_at` IS NULL)
    OR (`status` = 'off_shelf' AND `off_shelf_at` IS NOT NULL)
  ),
  CONSTRAINT `chk_products_moderation_time` CHECK (
    (`moderation_status` = 'normal'     AND `taken_down_at` IS NULL AND `taken_down_reason` IS NULL)
    OR (`moderation_status` = 'taken_down' AND `taken_down_at` IS NOT NULL)
  ),
  CONSTRAINT `chk_products_is_deleted`     CHECK (`is_deleted` IN (0, 1)),
  CONSTRAINT `chk_products_deleted_consistency` CHECK (
    (`is_deleted` = 0 AND `deleted_at` IS NULL AND `deleted_by` IS NULL)
    OR (`is_deleted` = 1 AND `deleted_at` IS NOT NULL AND `deleted_by` IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='二手商品表';

-- 4. 商品图片表
--    约定：sort_order = 1 的图片即为商品封面缩略图，由唯一索引保证封面唯一；
--          发布商品事务内由后端校验每个商品包含 1-6 张图片且必含 sort_order = 1。
CREATE TABLE IF NOT EXISTS `product_images` (
  `id`              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `product_id`      BIGINT UNSIGNED  NOT NULL                COMMENT '所属商品ID',
  `image_url`       VARCHAR(512)     NOT NULL                COMMENT '图片路径或URL',
  `file_size_bytes` INT UNSIGNED     NOT NULL                COMMENT '文件大小（字节，上限5MB）',
  `mime_type`       VARCHAR(32)      NOT NULL                COMMENT 'MIME类型（jpeg/png/webp）',
  `sort_order`      TINYINT UNSIGNED NOT NULL                COMMENT '展示顺序号（1-6，其中1固定为封面缩略图）',
  `created_at`      DATETIME(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                                             COMMENT '上传时间（UTC）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_images_order` (`product_id`, `sort_order`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_product_images_size`   CHECK (`file_size_bytes` > 0 AND `file_size_bytes` <= 5242880),
  CONSTRAINT `chk_product_images_order`  CHECK (`sort_order` BETWEEN 1 AND 6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='商品图片表（单品1-6张，sort_order=1为封面）';

-- 5. 失物招领表
CREATE TABLE IF NOT EXISTS `lost_found_items` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '信息ID',
  `publisher_id`      BIGINT UNSIGNED NOT NULL                COMMENT '发布者用户ID',
  `item_type`         ENUM('lost', 'found') NOT NULL          COMMENT '类型：lost-寻物，found-拾物',
  `item_name`         VARCHAR(64)     NOT NULL                COMMENT '物品名称',
  `location`          VARCHAR(100)    NOT NULL                COMMENT '丢失或拾取地点',
  `contact_info`      VARCHAR(100)    NOT NULL                COMMENT '发布时保存的发布者联系方式快照',
  `description`       TEXT            NOT NULL                COMMENT '详细描述',
  `status`            ENUM('searching', 'unclaimed', 'resolved') NOT NULL
                                                              COMMENT '状态：searching-寻找中，unclaimed-待认领，resolved-已完结',
  `resolved_at`       DATETIME(3)     NULL     DEFAULT NULL   COMMENT '完结时间（UTC）',
  `moderation_status` ENUM('normal', 'taken_down') NOT NULL DEFAULT 'normal'
                                                              COMMENT '治理状态：normal-正常，taken_down-违规下架',
  `taken_down_reason` VARCHAR(255)    NULL     DEFAULT NULL   COMMENT '违规下架原因',
  `taken_down_at`     DATETIME(3)     NULL     DEFAULT NULL   COMMENT '违规下架时间（UTC）',
  `is_deleted`        TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除：0-未删，1-已删',
  `deleted_at`        DATETIME(3)     NULL     DEFAULT NULL   COMMENT '逻辑删除时间（UTC）',
  `deleted_by`        BIGINT UNSIGNED NULL     DEFAULT NULL   COMMENT '执行删除的管理员ID',
  `created_at`        DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                                              COMMENT '发布时间（UTC）',
  `updated_at`        DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
                                                              COMMENT '更新时间（UTC）',
  PRIMARY KEY (`id`),
  KEY `idx_lf_hall` (`is_deleted`, `moderation_status`, `status`, `created_at`, `id`),
  KEY `idx_lf_type_hall` (`is_deleted`, `moderation_status`, `item_type`, `status`, `created_at`, `id`),
  KEY `idx_lf_publisher` (`publisher_id`, `is_deleted`, `created_at`, `id`),
  KEY `idx_lf_admin` (`is_deleted`, `moderation_status`, `created_at`, `id`),
  KEY `idx_lf_deleted_by_fk` (`deleted_by`),
  CONSTRAINT `fk_lf_publisher`  FOREIGN KEY (`publisher_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_lf_deleted_by` FOREIGN KEY (`deleted_by`)   REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_lf_type_status` CHECK (
    (`item_type` = 'lost'  AND `status` IN ('searching', 'resolved'))
    OR (`item_type` = 'found' AND `status` IN ('unclaimed', 'resolved'))
  ),
  CONSTRAINT `chk_lf_status_time` CHECK (
    (`status` IN ('searching', 'unclaimed') AND `resolved_at` IS NULL)
    OR (`status` = 'resolved' AND `resolved_at` IS NOT NULL)
  ),
  CONSTRAINT `chk_lf_moderation_time` CHECK (
    (`moderation_status` = 'normal'     AND `taken_down_at` IS NULL AND `taken_down_reason` IS NULL)
    OR (`moderation_status` = 'taken_down' AND `taken_down_at` IS NOT NULL)
  ),
  CONSTRAINT `chk_lf_is_deleted` CHECK (`is_deleted` IN (0, 1)),
  CONSTRAINT `chk_lf_deleted_consistency` CHECK (
    (`is_deleted` = 0 AND `deleted_at` IS NULL AND `deleted_by` IS NULL)
    OR (`is_deleted` = 1 AND `deleted_at` IS NOT NULL AND `deleted_by` IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='失物招领表';

-- 6. 跑腿任务表
CREATE TABLE IF NOT EXISTS `errands` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `publisher_id`      BIGINT UNSIGNED NOT NULL                COMMENT '发布者用户ID',
  `accepter_id`       BIGINT UNSIGNED NULL     DEFAULT NULL   COMMENT '接单人用户ID（待接单为NULL）',
  `start_location`    VARCHAR(100)    NOT NULL                COMMENT '起点',
  `end_location`      VARCHAR(100)    NOT NULL                COMMENT '终点',
  `fee_cents`         BIGINT UNSIGNED NOT NULL                COMMENT '跑腿费（单位：分）',
  `item_desc`         TEXT            NOT NULL                COMMENT '物品及任务说明',
  `contact_info`      VARCHAR(100)    NOT NULL                COMMENT '发布时保存的发布者联系方式快照',
  `status`            ENUM('pending', 'in_progress', 'pending_confirm', 'completed')
                                      NOT NULL DEFAULT 'pending'
                                                              COMMENT '任务状态：待接单/进行中/待确认/已完成',
  `accepted_at`       DATETIME(3)     NULL     DEFAULT NULL   COMMENT '接单时间（UTC）',
  `delivered_at`      DATETIME(3)     NULL     DEFAULT NULL   COMMENT '确认送达时间（UTC）',
  `completed_at`      DATETIME(3)     NULL     DEFAULT NULL   COMMENT '确认完成时间（UTC）',
  `moderation_status` ENUM('normal', 'taken_down') NOT NULL DEFAULT 'normal'
                                                              COMMENT '治理状态：normal-正常，taken_down-违规下架',
  `taken_down_reason` VARCHAR(255)    NULL     DEFAULT NULL   COMMENT '违规下架原因',
  `taken_down_at`     DATETIME(3)     NULL     DEFAULT NULL   COMMENT '违规下架时间（UTC）',
  `is_deleted`        TINYINT(1)      NOT NULL DEFAULT 0      COMMENT '逻辑删除：0-未删，1-已删',
  `deleted_at`        DATETIME(3)     NULL     DEFAULT NULL   COMMENT '逻辑删除时间（UTC）',
  `deleted_by`        BIGINT UNSIGNED NULL     DEFAULT NULL   COMMENT '执行删除的管理员ID',
  `created_at`        DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                                              COMMENT '发布时间（UTC）',
  `updated_at`        DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
                                                              COMMENT '更新时间（UTC）',
  PRIMARY KEY (`id`),
  KEY `idx_errands_hall` (`is_deleted`, `moderation_status`, `status`, `created_at`, `id`),
  KEY `idx_errands_publisher` (`publisher_id`, `is_deleted`, `created_at`, `id`),
  KEY `idx_errands_accepter` (`accepter_id`, `is_deleted`, `accepted_at`, `id`),
  KEY `idx_errands_admin` (`is_deleted`, `moderation_status`, `created_at`, `id`),
  KEY `idx_errands_deleted_by_fk` (`deleted_by`),
  CONSTRAINT `fk_errands_publisher`  FOREIGN KEY (`publisher_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_errands_accepter`   FOREIGN KEY (`accepter_id`)  REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_errands_deleted_by` FOREIGN KEY (`deleted_by`)   REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_errands_fee_pos`        CHECK (`fee_cents` > 0),
  CONSTRAINT `chk_errands_no_self_accept` CHECK (`accepter_id` IS NULL OR `accepter_id` <> `publisher_id`),
  CONSTRAINT `chk_errands_status_time_consistency` CHECK (
    (`status` = 'pending'
      AND `accepter_id` IS NULL
      AND `accepted_at` IS NULL
      AND `delivered_at` IS NULL
      AND `completed_at` IS NULL)
    OR (`status` = 'in_progress'
      AND `accepter_id` IS NOT NULL
      AND `accepted_at` IS NOT NULL
      AND `delivered_at` IS NULL
      AND `completed_at` IS NULL)
    OR (`status` = 'pending_confirm'
      AND `accepter_id` IS NOT NULL
      AND `accepted_at` IS NOT NULL
      AND `delivered_at` IS NOT NULL
      AND `completed_at` IS NULL
      AND `delivered_at` >= `accepted_at`)
    OR (`status` = 'completed'
      AND `accepter_id` IS NOT NULL
      AND `accepted_at` IS NOT NULL
      AND `delivered_at` IS NOT NULL
      AND `completed_at` IS NOT NULL
      AND `delivered_at` >= `accepted_at`
      AND `completed_at` >= `delivered_at`)
  ),
  CONSTRAINT `chk_errands_moderation_time` CHECK (
    (`moderation_status` = 'normal'     AND `taken_down_at` IS NULL AND `taken_down_reason` IS NULL)
    OR (`moderation_status` = 'taken_down' AND `taken_down_at` IS NOT NULL)
  ),
  CONSTRAINT `chk_errands_is_deleted` CHECK (`is_deleted` IN (0, 1)),
  CONSTRAINT `chk_errands_deleted_consistency` CHECK (
    (`is_deleted` = 0 AND `deleted_at` IS NULL AND `deleted_by` IS NULL)
    OR (`is_deleted` = 1 AND `deleted_at` IS NOT NULL AND `deleted_by` IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='跑腿任务表';

-- 7. 管理员操作日志表
CREATE TABLE IF NOT EXISTS `admin_audit_logs` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `admin_id`        BIGINT UNSIGNED NOT NULL                COMMENT '操作管理员ID',
  `target_type`     ENUM('user', 'product', 'lost_found', 'errand') NOT NULL
                                                            COMMENT '目标资源类型',
  `target_id`       BIGINT UNSIGNED NOT NULL                COMMENT '目标资源ID',
  `action`          ENUM('ban_user', 'unban_user', 'take_down', 'restore', 'soft_delete') NOT NULL
                                                            COMMENT '管理动作',
  `before_snapshot` JSON            NULL     DEFAULT NULL   COMMENT '变更前状态快照',
  `after_snapshot`  JSON            NULL     DEFAULT NULL   COMMENT '变更后状态快照',
  `reason`          VARCHAR(255)    NULL     DEFAULT NULL   COMMENT '操作原因',
  `client_ip`       VARCHAR(45)     NULL     DEFAULT NULL   COMMENT '来源IP',
  `created_at`      DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                                            COMMENT '操作时间（UTC）',
  PRIMARY KEY (`id`),
  KEY `idx_audit_target` (`target_type`, `target_id`, `created_at`, `id`),
  KEY `idx_audit_admin` (`admin_id`, `created_at`, `id`),
  KEY `idx_audit_created` (`created_at`, `id`),
  CONSTRAINT `fk_audit_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  COMMENT='管理员操作日志表';

-- 初始商品分类数据（显式指定 ID 1~6 以保证与测试种子数据及分类编码严格一致）
INSERT INTO `product_categories` (`id`, `code`, `name`, `sort_order`, `is_enabled`) VALUES
  (1, 'books',       '书籍教材', 10, 1),
  (2, 'electronics', '数码电子', 20, 1),
  (3, 'daily',       '生活用品', 30, 1),
  (4, 'sports',      '运动户外', 40, 1),
  (5, 'clothing',    '服饰鞋包', 50, 1),
  (6, 'others',      '其他闲置', 99, 1)
AS `new_cat`
ON DUPLICATE KEY UPDATE
  `name` = `new_cat`.`name`,
  `sort_order` = `new_cat`.`sort_order`,
  `is_enabled` = `new_cat`.`is_enabled`;
