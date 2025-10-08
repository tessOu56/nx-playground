#!/bin/bash

# 統一配置管理
# 避免在多個腳本中硬編碼版本號

# 版本配置
export PNPM_VERSION="10.13.1"

# 文件配置
export OVERRIDE_FILE="docker-compose.override.yml"
export OVERRIDE_TEMPLATE="docker-compose.override.template"

# 其他配置
export FORCE_REBUILD=false
export SKIP_DOCKER_CHECK=false
