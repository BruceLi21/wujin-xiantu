@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo 無盡仙途 V19 本機伺服器
echo 網址：http://localhost:8000/?v=19
echo.
start "" http://localhost:8000/?v=19
py -m http.server 8000
if errorlevel 1 python -m http.server 8000
pause
