#!/bin/bash
set -e

CONFIG_DIR="/etc/config/"
HTML_DIR="/usr/share/nginx/html/js"
# CONFIG_DIR="./"
# HTML_DIR="./"

echo "Generating configuration for environment: ${APP_ENV:-sit}"

# 选择对应的 env 文件
ENV_FILE="${CONFIG_DIR}/.env.${APP_ENV:-sit}"
if [ ! -f "$ENV_FILE" ]; then
    echo "Environment file not found: $ENV_FILE"
    exit 1
fi

# 使用 awk 一次性处理整个文件
awk '
BEGIN { 
    print "window.APP_AIS_WEB_CONFIG = {"
    first = 1
}
# 跳过注释行和空行
/^[[:space:]]*#/ || /^[[:space:]]*$/ || !/[[:alnum:]]/ { next }
{
    # 分割键值对
    equal_pos = index($0, "=")
    if (equal_pos > 0) {
        key = substr($0, 1, equal_pos-1)
        value = substr($0, equal_pos+1)
        
        # 去除首尾空格
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", key)
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
        
        # 移除引号
        if (value ~ /^".*"$/) value = substr(value, 2, length(value)-2)
        if (value ~ /^'"'"'.*'"'"'$/) value = substr(value, 2, length(value)-2)
        
        # 转义特殊字符
        gsub(/\\/, "\\\\", value)
        gsub(/"/, "\\\"", value)
        
        # 输出结果
        if (!first) printf ",\n"
        printf "  \"%s\": \"%s\"", key, value
        first = 0
    }
}
END {
    print ""
    print "};"
}' "$ENV_FILE" > "${HTML_DIR}/env.js"

echo "Configuration generated successfully"

nginx -g 'daemon off;'
