@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   唯英科技官网 - 一键部署脚本
echo ========================================
echo.

set "PROJECT_DIR=I:\weighingtech_src\next-app"
set "SERVER=root@69.5.23.121"
set "KEY=C:\Users\hw\.ssh\myssh.pem"
set "REMOTE_DIR=/var/www/html"

:: 清理旧打包
if exist "%PROJECT_DIR%\deploy" rmdir /s /q "%PROJECT_DIR%\deploy"
mkdir "%PROJECT_DIR%\deploy"

echo [1/4] 打包 index.html ...
copy /y "%PROJECT_DIR%\.next\server\app\index.html" "%PROJECT_DIR%\deploy\" >nul

echo [2/4] 打包 dev-editor.html ...
copy /y "%PROJECT_DIR%\.next\server\app\dev-editor.html" "%PROJECT_DIR%\deploy\" >nul

echo [3/4] 打包 product 目录 ...
xcopy /y /e /i "%PROJECT_DIR%\.next\server\app\product" "%PROJECT_DIR%\deploy\product\" >nul

echo [4/4] 打包 _next 和 uploads ...
xcopy /y /e /i "%PROJECT_DIR%\out\_next" "%PROJECT_DIR%\deploy\_next\" >nul
xcopy /y /e /i "%PROJECT_DIR%\out\uploads" "%PROJECT_DIR%\deploy\uploads\" >nul

echo.
echo 打包完成！开始上传...
echo.

:: 上传文件
echo 上传 index.html ...
cmd /c "scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 -i %KEY% %PROJECT_DIR%\deploy\index.html %SERVER%:%REMOTE_DIR%"
if errorlevel 1 (echo 上传失败! & pause & exit /b 1)

echo 上传 dev-editor.html ...
cmd /c "scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 -i %KEY% %PROJECT_DIR%\deploy\dev-editor.html %SERVER%:%REMOTE_DIR%"
if errorlevel 1 (echo 上传失败! & pause & exit /b 1)

echo 上传 product 目录 ...
cmd /c "scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 -i %KEY% -r %PROJECT_DIR%\deploy\product %SERVER%:%REMOTE_DIR\"
if errorlevel 1 (echo 上传失败! & pause & exit /b 1)

echo 上传 _next 目录 ...
cmd /c "scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 -i %KEY% -r %PROJECT_DIR%\deploy\_next %SERVER%:%REMOTE_DIR\"
if errorlevel 1 (echo 上传失败! & pause & exit /b 1)

echo 上传 uploads 目录 ...
cmd /c "scp -o StrictHostKeyChecking=no -o ConnectTimeout=30 -i %KEY% -r %PROJECT_DIR%\deploy\uploads %SERVER%:%REMOTE_DIR\"
if errorlevel 1 (echo 上传失败! & pause & exit /b 1)

echo.
echo ========================================
echo   部署完成！
echo   访问 http://69.5.23.121 查看
echo ========================================
pause
