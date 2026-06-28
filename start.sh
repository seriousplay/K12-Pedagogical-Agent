#!/bin/bash
# 教研智能体 Web 应用启动脚本

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 使用 WorkBuddy 内置 CLI
export CODEBUDDY_CODE_PATH="/Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/cli/dist/codebuddy.js"
export CODEBUDDY_CONFIG_DIR="${HOME}/.workbuddy"
export CODEBUDDY_INTERNET_ENVIRONMENT="internal"
export CODEBUDDY_HOST="workbuddy-desktop"

cd "$SCRIPT_DIR"

echo "=== 教研智能体 Web 应用 ==="
echo "前端: http://localhost:5173"
echo "API:  http://localhost:3000"
echo ""

# 使用 managed node 运行
NODE_BIN="${HOME}/.workbuddy/binaries/node/versions/22.22.2/bin/node"
NPM_BIN="${HOME}/.workbuddy/binaries/node/versions/22.22.2/bin/npm"

if [ -f "$NODE_BIN" ]; then
  "$NPM_BIN" run dev
else
  npm run dev
fi
