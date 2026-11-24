"""校园交易平台 —— Python/SQLAlchemy 数据库连接与 UTC 时区验证脚本。

用法：
  1. 安装依赖：pip install -r db/scripts/requirements.txt
  2. 运行验证：python db/scripts/test_connection.py
     （会自动读取 db/.env 中的连接配置；也可通过环境变量 DATABASE_URL 覆盖）
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Dict

from sqlalchemy import create_engine, event, text


def load_dotenv_file(env_path: Path) -> Dict[str, str]:
    values: Dict[str, str] = {}
    if not env_path.exists():
        return values
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        values[key.strip()] = val.strip().strip('"').strip("'")
    return values


def build_database_url() -> str:
    if os.getenv("DATABASE_URL"):
        return os.environ["DATABASE_URL"]

    db_dir = Path(__file__).resolve().parents[1]
    env_cfg = load_dotenv_file(db_dir / ".env")
    if not env_cfg:
        env_cfg = load_dotenv_file(db_dir / ".env.example")

    host = os.getenv("MYSQL_HOST", "127.0.0.1")
    port = os.getenv("MYSQL_PORT", env_cfg.get("MYSQL_PORT", "3306"))
    user = os.getenv("MYSQL_USER", env_cfg.get("MYSQL_USER", "campus_app"))
    password = os.getenv("MYSQL_PASSWORD", env_cfg.get("MYSQL_PASSWORD", "campus_dev_123456"))
    database = os.getenv("MYSQL_DATABASE", env_cfg.get("MYSQL_DATABASE", "campus_trading_platform"))
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}?charset=utf8mb4"


def create_campus_engine(database_url: str):
    """参考 FastAPI 后端连接池配置：建连时强制设置会话时区为 UTC (+00:00)。"""
    engine = create_engine(
        database_url,
        pool_pre_ping=True,
        pool_recycle=1800,
        pool_size=10,
        max_overflow=20,
        echo=False,
    )

    @event.listens_for(engine, "connect")
    def _set_utc_timezone(dbapi_connection, _connection_record):
        with dbapi_connection.cursor() as cursor:
            cursor.execute("SET time_zone = '+00:00'")

    return engine


def main() -> None:
    url = build_database_url()
    safe_url = url.split("@")[-1]
    print(f"[INFO] 正在连接 MySQL: {safe_url}")

    engine = create_campus_engine(url)
    try:
        with engine.connect() as conn:
            # 1. 健康检查探活（对应 GET /health）
            ping_val = conn.execute(text("SELECT 1")).scalar_one()
            assert ping_val == 1, f"Health check failed: {ping_val}"

            # 2. 检查版本、全局时区、会话时区、字符集
            info = conn.execute(
                text(
                    "SELECT VERSION() AS ver, "
                    "@@global.time_zone AS g_tz, "
                    "@@session.time_zone AS s_tz, "
                    "UTC_TIMESTAMP(3) AS utc_now"
                )
            ).mappings().one()
            print(f"[OK]   MySQL 版本     : {info['ver']}")
            print(f"[OK]   全局时区       : {info['g_tz']}")
            print(f"[OK]   连接会话时区   : {info['s_tz']}")
            print(f"[OK]   当前 UTC 时间  : {info['utc_now']}")
            assert info["s_tz"] == "+00:00", f"会话时区非 UTC: {info['s_tz']}"

            # 3. 检查 7 张核心表及初始数据量
            tables = [
                "users",
                "product_categories",
                "products",
                "product_images",
                "lost_found_items",
                "errands",
                "admin_audit_logs",
            ]
            print("[OK]   核心数据表统计 :")
            for tbl in tables:
                cnt = conn.execute(text(f"SELECT COUNT(*) FROM `{tbl}`")).scalar_one()
                print(f"       - {tbl:<20s}: {cnt} 行")

        print("\n[PASS] 数据库连接与初始化校验全部通过！")
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
