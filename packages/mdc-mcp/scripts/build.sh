#!/bin/bash

set -ex

# 获取当前脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 计算 package 根目录 (脚本目录的上一级)
PACKAGE_DIR="$( dirname "$SCRIPT_DIR" )"

cd "$PACKAGE_DIR"

rm -rf "$PACKAGE_DIR/dist"

# 使用 rollup 打包，包含 workspace 依赖
# 添加 --debug 选项以获取更多信息
DEBUG=rollup* npx rollup -c rollup.config.mjs

# 检查生成的文件
echo "=== 检查生成的文件 ==="
ls -la "$PACKAGE_DIR/dist"

# 检查脚本是否可执行
chmod +x "$PACKAGE_DIR/dist/cli.js"

# 复制文档资源
cp -r "../../docs/antd" "$PACKAGE_DIR/dist/docs"
