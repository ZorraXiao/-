-- ============================================================================
-- 校园交易平台 —— 本机 MySQL 8.0 专用账号创建与清库脚本
-- 说明：
--   - 使用 Docker Compose 的同学不需要运行本脚本（容器会自动创建库与账号）。
--   - 使用本机手动安装 MySQL 8.0 的同学，可先以 root 执行本脚本，
--     然后再依次导入 init/01_schema.sql 与 init/02_seed.sql。
-- ============================================================================

DROP DATABASE IF EXISTS `campus_trading_platform`;

CREATE DATABASE `campus_trading_platform`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

-- 创建项目专用本地账号（仅授予 campus_trading_platform 库权限）
CREATE USER IF NOT EXISTS 'campus_app'@'localhost' IDENTIFIED BY 'campus_dev_123456';
CREATE USER IF NOT EXISTS 'campus_app'@'127.0.0.1' IDENTIFIED BY 'campus_dev_123456';

GRANT ALL PRIVILEGES ON `campus_trading_platform`.* TO 'campus_app'@'localhost';
GRANT ALL PRIVILEGES ON `campus_trading_platform`.* TO 'campus_app'@'127.0.0.1';

FLUSH PRIVILEGES;
