#!/bin/bash
# 部署脚本 - 在服务器上执行

cd /var/www/html

# 下载 Next.js 静态文件（需要先本地打包上传）
# 或者使用 rsync/scp 手动上传

# 方法1: 如果有 wget/curl
# wget http://your-server/next-app.zip

# 方法2: 手动复制
# 复制以下文件到 /var/www/html/
# - .next/server/app/index.html
# - .next/server/app/dev-editor.html  
# - .next/server/app/product/*.html
# - out/_next/
# - out/uploads/

echo "部署目录内容："
ls -la

echo ""
echo "需要上传的文件："
echo "1. index.html → /var/www/html/"
echo "2. dev-editor.html → /var/www/html/"
echo "3. product/ 目录 → /var/www/html/product/"
echo "4. _next/ 目录 → /var/www/html/_next/"
echo "5. uploads/ 目录 → /var/www/html/uploads/"
