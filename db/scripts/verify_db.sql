-- ============================================================================
-- 校园交易平台 —— 数据库初始化与约束自动验证脚本
-- 用途：验证 MySQL 版本、UTC 时区、字符集、7 张表数据、CHECK 约束、外键约束及
--       跑腿并发接单原子 UPDATE；所有写入测试均会回滚，不污染初始化数据。
-- ============================================================================

USE `campus_trading_platform`;
SET NAMES utf8mb4;

-- 1. 基础环境核验（版本 / 时区 / 字符集 / SQL 模式）
SELECT
  VERSION()                  AS mysql_version,
  @@global.time_zone         AS global_tz,
  @@session.time_zone        AS session_tz,
  @@character_set_server     AS server_charset,
  @@collation_server         AS server_collation,
  UTC_TIMESTAMP(3)           AS utc_now_ms;

-- 2. 7 张业务表及初始化行数核验
SELECT 'users'              AS table_name, COUNT(*) AS row_count FROM `users`
UNION ALL SELECT 'product_categories', COUNT(*) FROM `product_categories`
UNION ALL SELECT 'products',           COUNT(*) FROM `products`
UNION ALL SELECT 'product_images',     COUNT(*) FROM `product_images`
UNION ALL SELECT 'lost_found_items',   COUNT(*) FROM `lost_found_items`
UNION ALL SELECT 'errands',            COUNT(*) FROM `errands`
UNION ALL SELECT 'admin_audit_logs',   COUNT(*) FROM `admin_audit_logs`;

-- 3. 约束生效性与并发抢单原子 SQL 自动化测试（执行完毕自动清理）
DROP PROCEDURE IF EXISTS `_verify_campus_db_constraints`;

DELIMITER //
CREATE PROCEDURE `_verify_campus_db_constraints`()
BEGIN
  DECLARE v_err_code INT DEFAULT 0;
  DECLARE v_rows INT DEFAULT 0;

  -- 捕获常见约束错误码（3819=CHECK约束, 1451=外键RESTRICT, 1062=唯一索引冲突）
  DECLARE CONTINUE HANDLER FOR 3819 SET v_err_code = 3819;
  DECLARE CONTINUE HANDLER FOR 1451 SET v_err_code = 1451;
  DECLARE CONTINUE HANDLER FOR 1062 SET v_err_code = 1062;

  -- 使用 MEMORY 引擎，保证事务 ROLLBACK 回滚业务表写入时不会清空测试报告记录
  DROP TEMPORARY TABLE IF EXISTS `_verify_results`;
  CREATE TEMPORARY TABLE `_verify_results` (
    `test_case` VARCHAR(80) NOT NULL,
    `expected`  VARCHAR(40) NOT NULL,
    `actual`    VARCHAR(40) NOT NULL,
    `status`    VARCHAR(10) NOT NULL
  ) ENGINE=MEMORY;

  -- 用例 1：服务端全局时区必须为 +00:00
  INSERT INTO `_verify_results` VALUES (
    'global_time_zone_is_utc',
    '+00:00',
    @@global.time_zone,
    IF(@@global.time_zone = '+00:00', 'PASS', 'FAIL')
  );

  START TRANSACTION;

  -- 用例 2：users 唯一索引（重复 username 拦截）
  SET v_err_code = 0;
  INSERT INTO `users` (`username`, `password_hash`, `nickname`, `phone`)
  VALUES ('lin_stu', 'dummy_hash', '重复用户', '13900009991');
  INSERT INTO `_verify_results` VALUES (
    'uk_users_username_blocks_duplicate',
    'ERR_1062',
    CONCAT('ERR_', v_err_code),
    IF(v_err_code = 1062, 'PASS', 'FAIL')
  );

  -- 用例 3：users 封禁一致性 CHECK（is_active=0 但 banned_at=NULL 必须拦截）
  SET v_err_code = 0;
  INSERT INTO `users` (`username`, `password_hash`, `nickname`, `phone`, `is_active`, `banned_at`)
  VALUES ('bad_ban_user', 'dummy_hash', '非法封禁', '13900009992', 0, NULL);
  INSERT INTO `_verify_results` VALUES (
    'chk_users_ban_consistency',
    'ERR_3819',
    CONCAT('ERR_', v_err_code),
    IF(v_err_code = 3819, 'PASS', 'FAIL')
  );

  -- 用例 4：products 价格必须 > 0（price_cents=0 必须拦截）
  SET v_err_code = 0;
  INSERT INTO `products` (`seller_id`, `category_id`, `title`, `price_cents`, `description`, `contact_info`)
  VALUES (2, 1, '零元非法商品', 0, '测试', '13800000002');
  INSERT INTO `_verify_results` VALUES (
    'chk_products_price_pos',
    'ERR_3819',
    CONCAT('ERR_', v_err_code),
    IF(v_err_code = 3819, 'PASS', 'FAIL')
  );

  -- 用例 5：product_images 文件大小上限 5MB CHECK
  SET v_err_code = 0;
  INSERT INTO `product_images` (`product_id`, `image_url`, `file_size_bytes`, `mime_type`, `sort_order`)
  VALUES (101, '/static/uploads/products/too_big.jpg', 5242881, 'image/jpeg', 6);
  INSERT INTO `_verify_results` VALUES (
    'chk_product_images_size_max_5mb',
    'ERR_3819',
    CONCAT('ERR_', v_err_code),
    IF(v_err_code = 3819, 'PASS', 'FAIL')
  );

  -- 用例 6：lost_found_items 类型与状态组合 CHECK（lost 不允许 unclaimed）
  SET v_err_code = 0;
  INSERT INTO `lost_found_items` (`publisher_id`, `item_type`, `item_name`, `location`, `contact_info`, `description`, `status`)
  VALUES (2, 'lost', '非法状态测试', '一教', '13800000002', '测试', 'unclaimed');
  INSERT INTO `_verify_results` VALUES (
    'chk_lf_type_status',
    'ERR_3819',
    CONCAT('ERR_', v_err_code),
    IF(v_err_code = 3819, 'PASS', 'FAIL')
  );

  -- 用例 7：errands 禁止自接单 CHECK（accepter_id = publisher_id 必须拦截）
  SET v_err_code = 0;
  INSERT INTO `errands` (`publisher_id`, `accepter_id`, `start_location`, `end_location`, `fee_cents`, `item_desc`, `contact_info`, `status`, `accepted_at`)
  VALUES (2, 2, '北门', '宿舍', 500, '自接单测试', '13800000002', 'in_progress', UTC_TIMESTAMP(3));
  INSERT INTO `_verify_results` VALUES (
    'chk_errands_no_self_accept',
    'ERR_3819',
    CONCAT('ERR_', v_err_code),
    IF(v_err_code = 3819, 'PASS', 'FAIL')
  );

  -- 用例 8：外键 ON DELETE RESTRICT（删除已发布商品的用户必须被拒绝）
  SET v_err_code = 0;
  DELETE FROM `users` WHERE `id` = 2;
  INSERT INTO `_verify_results` VALUES (
    'fk_on_delete_restrict_blocks_physical_delete',
    'ERR_1451',
    CONCAT('ERR_', v_err_code),
    IF(v_err_code = 1451, 'PASS', 'FAIL')
  );

  -- 用例 9 & 10：跑腿并发抢单原子 UPDATE（首次成功 affected=1，二次抢单冲突 affected=0，测试后统一回滚）
    UPDATE `errands`
    SET `accepter_id` = 4,
        `status`      = 'in_progress',
        `accepted_at` = UTC_TIMESTAMP(3)
    WHERE `id` = 301
      AND `is_deleted` = 0
      AND `moderation_status` = 'normal'
      AND `status` = 'pending'
      AND `accepter_id` IS NULL
      AND `publisher_id` <> 4;
    SET v_rows = ROW_COUNT();
    INSERT INTO `_verify_results` VALUES (
      'errand_atomic_accept_first_wins',
      'affected=1',
      CONCAT('affected=', v_rows),
      IF(v_rows = 1, 'PASS', 'FAIL')
    );

    -- 模拟另一名用户（id=2）并发抢同一单 301
    UPDATE `errands`
    SET `accepter_id` = 2,
        `status`      = 'in_progress',
        `accepted_at` = UTC_TIMESTAMP(3)
    WHERE `id` = 301
      AND `is_deleted` = 0
      AND `moderation_status` = 'normal'
      AND `status` = 'pending'
      AND `accepter_id` IS NULL
      AND `publisher_id` <> 2;
    SET v_rows = ROW_COUNT();
    INSERT INTO `_verify_results` VALUES (
      'errand_atomic_accept_second_conflicts',
      'affected=0',
      CONCAT('affected=', v_rows),
      IF(v_rows = 0, 'PASS', 'FAIL')
    );
  ROLLBACK;

  SELECT * FROM `_verify_results`;
  DROP TEMPORARY TABLE IF EXISTS `_verify_results`;
END //
DELIMITER ;

CALL `_verify_campus_db_constraints`();
DROP PROCEDURE IF EXISTS `_verify_campus_db_constraints`;
