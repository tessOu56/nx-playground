#!/bin/bash

# --- 環境變數設置腳本 ---
# 統一管理所有環境變數，避免重複維護
# Parses existing .env without `source` (unquoted values like APP_NAME=NX Playground Events would break bash).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 - <<'PY'
from pathlib import Path
import os
import re

root = Path(".")
env_path = root / ".env"
existing: dict[str, str] = {}
if env_path.exists():
    for raw in env_path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)$", line)
        if not m:
            continue
        existing[m.group(1)] = m.group(2)

def pick(key: str, default: str) -> str:
    if os.environ.get(key):
        return os.environ[key]
    if key in existing and existing[key] != "":
        return existing[key]
    return default

LEFTOVER_LINE_IDS = {
    "2007835339-AmngJedQ",
    "2007835339",
}

def pick_owner_line(key: str) -> str:
    val = pick(key, "")
    if val in LEFTOVER_LINE_IDS:
        return ""
    return val

local_postgres = "postgresql://event:event@127.0.0.1:5433/event_stack"
database_url = pick("DATABASE_URL", local_postgres)
if (
    not database_url
    or database_url.startswith("file:")
    or "sqlite" in database_url.lower()
):
    database_url = local_postgres

values = {
    "NEXT_PUBLIC_LIFF_ID": pick_owner_line("NEXT_PUBLIC_LIFF_ID"),
    "NEXT_PUBLIC_LINE_CLIENT_ID": pick_owner_line("NEXT_PUBLIC_LINE_CLIENT_ID"),
    "NEXT_PUBLIC_LINE_PROVIDER_ID": pick("NEXT_PUBLIC_LINE_PROVIDER_ID", ""),
    "NEXT_PUBLIC_LIFF_URL": pick("NEXT_PUBLIC_LIFF_URL", ""),
    "LINE_CLIENT_SECRET": pick("LINE_CLIENT_SECRET", "your_line_client_secret_here"),
    "PUBLIC_API_BASE_URL": pick("PUBLIC_API_BASE_URL", "http://localhost:3001/api"),
    "PORTAL_PUBLIC_URL": pick("PORTAL_PUBLIC_URL", "http://localhost:3000"),
    "ECPAY_MERCHANT_ID": pick("ECPAY_MERCHANT_ID", ""),
    "ECPAY_HASH_KEY": pick("ECPAY_HASH_KEY", ""),
    "ECPAY_HASH_IV": pick("ECPAY_HASH_IV", ""),
    "NEXT_PUBLIC_LINE_REDIRECT_URI": pick(
        "NEXT_PUBLIC_LINE_REDIRECT_URI", "https://frontend.nx-playground.local"
    ),
    "NEXT_PUBLIC_API_BASE_URL": pick(
        "NEXT_PUBLIC_API_BASE_URL", "http://localhost:3001/api"
    ),
    "NEXT_PUBLIC_API_TIMEOUT": pick("NEXT_PUBLIC_API_TIMEOUT", "10000"),
    "NEXT_PUBLIC_PRODUCTION_DOMAIN": pick(
        "NEXT_PUBLIC_PRODUCTION_DOMAIN", "https://frontend.nx-playground.local"
    ),
    "NEXT_PUBLIC_DEVELOPMENT_DOMAIN": pick(
        "NEXT_PUBLIC_DEVELOPMENT_DOMAIN", "http://localhost:3000"
    ),
    "NEXT_PUBLIC_APP_NAME": pick("NEXT_PUBLIC_APP_NAME", "NX Playground Events"),
    "NEXT_PUBLIC_APP_VERSION": pick("NEXT_PUBLIC_APP_VERSION", "1.0.0"),
    "NEXT_PUBLIC_ENABLE_DEVTOOLS": pick("NEXT_PUBLIC_ENABLE_DEVTOOLS", "true"),
    "NEXT_PUBLIC_ENABLE_MOCK_DATA": pick("NEXT_PUBLIC_ENABLE_MOCK_DATA", "false"),
    "VITE_API_BASE_URL": pick("VITE_API_BASE_URL", "http://localhost:3001/api"),
    "VITE_ORY_PUBLIC_API": pick("VITE_ORY_PUBLIC_API", "http://localhost:4433"),
    "VITE_KRATOS_PUBLIC_URL": pick("VITE_KRATOS_PUBLIC_URL", "http://localhost:4433"),
    "VITE_AUTH_APP_URL": pick("VITE_AUTH_APP_URL", "http://localhost:3004"),
    "DATABASE_URL": database_url,
    "VITE_APP_NAME": pick("VITE_APP_NAME", "NX Playground Console"),
    "VITE_APP_VERSION": pick("VITE_APP_VERSION", "1.0.0"),
    "HTTPS": pick("HTTPS", "true"),
}

lines = [
    "# Events 專案的環境變數",
    *[f"{k}={v}" for k, v in values.items() if k.startswith("NEXT_") or k in ("LINE_CLIENT_SECRET", "PUBLIC_API_BASE_URL", "PORTAL_PUBLIC_URL", "ECPAY_MERCHANT_ID", "ECPAY_HASH_KEY", "ECPAY_HASH_IV", "VITE_API_BASE_URL", "VITE_ORY_PUBLIC_API", "VITE_KRATOS_PUBLIC_URL", "VITE_AUTH_APP_URL", "DATABASE_URL")],
    "",
    "# Console 專案的環境變數",
    f"VITE_APP_NAME={values['VITE_APP_NAME']}",
    f"VITE_APP_VERSION={values['VITE_APP_VERSION']}",
    f"HTTPS={values['HTTPS']}",
    "",
]
env_path.write_text("\n".join(lines))
print("Wrote .env (DATABASE_URL is postgres; secrets preserved when already set).")
PY
