@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 無盡仙途 V20
echo http://localhost:8000/?v=20
start "" http://localhost:8000/?v=20
py -m http.server 8000
if errorlevel 1 python -m http.server 8000
pause
