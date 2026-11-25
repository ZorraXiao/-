# 校园交易平台 —— 数据库环境搭建与连接配置说明（阶段二）

- **负责成员**：成员 11
- **数据库版本**：MySQL 8.0（InnoDB、`utf8mb4 / utf8mb4_0900_ai_ci`、UTC 时区）
- **数据库名**：`campus_trading_platform`

---

## 目录结构

```text
db/
├── docker-compose.yml            # Docker Compose 一键启动 MySQL 8.0 编排文件
├── .env.example                  # 环境变量配置模板（复制为 .env 使用）
├── .gitignore                    # 忽略本机 .env 与临时文件
├── my.cnf.example                # 本机手动安装 MySQL 8.0 时的参考配置
├── README.md                     # 本说明文档
├── init/                         # Docker 首次启动时按文件名顺序自动执行的脚本
│   ├── 01_schema.sql             # 建库建表 + 7张表索引/外键/CHECK约束 + 6个初始商品分类
│   └── 02_seed.sql               # 开发与联调测试数据
└── scripts/
    ├── verify_db.sql             # 环境、时区、行数、约束及跑腿并发抢单 SQL 校验脚本
    ├── test_connection.py        # Python / SQLAlchemy 连库与 UTC 时区验证脚本
    ├── reset_local_mysql.sql     # 本机 MySQL 8.0 重建库及创建 campus_app 账号脚本
    └── requirements.txt          # Python 连库最小依赖清单
```

---

## 一、方式 A：Docker Compose 一键启动（推荐）

> 前提：本机已安装并启动 **Docker Desktop**（Windows / macOS）或 Docker Engine（Linux）。

### 1. 准备环境变量

在 `db/` 目录下复制模板文件：

```powershell
Copy-Item .env.example .env
```

> **端口冲突提醒**：默认映射宿主机 `3306` 端口。如果你的电脑已经安装了本机 MySQL 服务占用了 `3306`，请把 `.env` 中的 `MYSQL_PORT` 改为 `3307`。

### 2. 启动并自动初始化数据库

```powershell
docker compose up -d
```

查看启动状态（等待 `STATUS` 显示 `healthy`）：

```powershell
docker compose ps
```

首次启动时，容器会自动按顺序执行 `init/01_schema.sql` 与 `init/02_seed.sql`，并自动创建：
- 数据库：`campus_trading_platform`
- 业务专用账号：`campus_app`（密码见 `.env`，默认 `campus_dev_123456`，仅拥有 `campus_trading_platform` 库权限）

### 3. 常用运维命令

```powershell
# 查看初始化与运行日志
docker compose logs -f mysql

# 进入容器内 MySQL 命令行（以业务账号登录）
docker compose exec mysql mysql -ucampus_app -pcampus_dev_123456 campus_trading_platform

# 停止容器（保留数据）
docker compose stop

# 彻底重置数据库（删除数据卷并重新跑一遍 01_schema.sql 与 02_seed.sql）
docker compose down -v
docker compose up -d
```

---

## 二、方式 B：本机手动安装 MySQL 8.0（未装 Docker 的备选方案）

1. 确保安装 **MySQL 8.0.16 及以上版本**（不可使用 MySQL 5.7，`utf8mb4_0900_ai_ci` 排序规则与 `CHECK` 约束均依赖 8.0）。
2. 参考 [my.cnf.example](my.cnf.example) 修改本机 `my.ini` / `my.cnf`，重点确保：
   ```ini
   default-time-zone = '+00:00'
   character-set-server = utf8mb4
   collation-server = utf8mb4_0900_ai_ci
   ```
   修改后重启 MySQL 服务。
3. 使用 `root` 依次执行以下脚本：
   ```powershell
   mysql -u root -p < scripts/reset_local_mysql.sql
   mysql -u root -p < init/01_schema.sql
   mysql -u root -p < init/02_seed.sql
   ```

---

## 三、初始化验证

### 1. 执行 SQL 自动化校验脚本（推荐）

Docker 环境下执行：

```powershell
Get-Content scripts/verify_db.sql -Raw | docker compose exec -T mysql mysql -ucampus_app -pcampus_dev_123456 campus_trading_platform
```

该脚本会自动检查并输出：
- MySQL 版本、全局/会话时区（`+00:00`）、字符集与排序规则
- 7 张业务表行数（`users=5`、`product_categories=6`、`products=4`、`product_images=5`、`lost_found_items=3`、`errands=4`、`admin_audit_logs=2`）
- 10 项约束与并发抢单原子 SQL 用例全部为 `PASS`（所有测试写入均会自动回滚，不污染种子数据）

### 2. 执行 Python / SQLAlchemy 连库验证

```powershell
pip install -r scripts/requirements.txt
python scripts/test_connection.py
```

---

## 四、给成员 7（FastAPI 后端）的连接配置对接指南

### 1. 环境变量连接串

> 若本机 Docker 映射端口为 `3307`，请将下面 URL 中的 `3306` 替换为 `3307`。

- **同步（SQLAlchemy + PyMySQL）**：
  ```env
  DATABASE_URL=mysql+pymysql://campus_app:campus_dev_123456@127.0.0.1:3306/campus_trading_platform?charset=utf8mb4
  ```
- **异步（SQLAlchemy + asyncmy）**：
  ```env
  DATABASE_URL=mysql+asyncmy://campus_app:campus_dev_123456@127.0.0.1:3306/campus_trading_platform?charset=utf8mb4
  ```
- **异步（SQLAlchemy + aiomysql）**：
  ```env
  DATABASE_URL=mysql+aiomysql://campus_app:campus_dev_123456@127.0.0.1:3306/campus_trading_platform?charset=utf8mb4
  ```

> **依赖提醒**：使用 `PyMySQL` 连接 MySQL 8.0 默认的 `caching_sha2_password` 认证插件时，必须同时安装 `cryptography` 包（见 `scripts/requirements.txt`）。

### 2. 连接池强制 UTC 会话时区（必配）

除 MySQL 服务端配置 `default-time-zone = '+00:00'` 外，后端建连时需显式执行 `SET time_zone = '+00:00'`：

```python
from sqlalchemy import create_engine, event

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=1800,
)

@event.listens_for(engine, "connect")
def _set_utc_timezone(dbapi_connection, _connection_record):
    with dbapi_connection.cursor() as cursor:
        cursor.execute("SET time_zone = '+00:00'")
```

> 异步引擎（`create_async_engine`）请将监听器绑定到 `engine.sync_engine` 上：
> `@event.listens_for(async_engine.sync_engine, "connect")`。

### 3. 联调必看注意事项

1. **UTC 时间序列化**：MySQL `DATETIME(3)` 读到 Python 后是不带时区信息的 naive `datetime`（但其值本身是 UTC），在 Pydantic 响应模型中序列化时应补齐 `timezone.utc`，统一输出形如 `2026-11-20T08:00:00Z` 的 ISO 8601 字符串。
2. **测试账号密码哈希替换**：`init/02_seed.sql` 中的 `password_hash` 目前是占位值，请成员 7 确认认证加密算法（`bcrypt` 或 `Argon2id`）后同步成员 11 替换为真实测试密码哈希。
3. **健康检查接口**：`GET /health` 建议通过 `SELECT 1` 验证数据库连通性。
4. **异常处理边界**：切勿将所有 `IntegrityError` 一律映射为 `409`；仅唯一约束冲突（错误码 `1062`，如 `uk_users_username` / `uk_users_phone`）映射为 `409 ACCOUNT_CONFLICT`，外键约束（`1451/1452`）与 `CHECK` 约束（`3819`）应按业务语义区分处理。

---

## 五、预置测试账号一览

| 用户ID | 用户名 | 昵称 | 手机号 | 角色 | 状态 | 说明 |
|---:|---|---|---|---|---|---|
| 1 | `admin01` | 平台管理员 | `13800000001` | `admin` | 正常 | 后台管理测试账号 |
| 2 | `lin_stu` | 林同学 | `13800000002` | `user` | 正常 | 卖家 / 失主 / 跑腿接单人 |
| 3 | `zhou_stu` | 周同学 | `13800000003` | `user` | 正常 | 卖家 / 拾物者 / 跑腿发布者 |
| 4 | `chen_stu` | 陈同学 | `13800000004` | `user` | 正常 | 失主 / 跑腿发布与接单人 |
| 5 | `spam_usr` | 测试封禁号 | `13800000005` | `user` | 已封禁 | 校验 403 `FORBIDDEN` 拦截 |

*(密码哈希待与成员 7 对齐加密方案后统一写入并补充明文测试密码)*
