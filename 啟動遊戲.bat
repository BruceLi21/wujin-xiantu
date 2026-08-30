@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 無盡仙途 V21
echo http://localhost:8000/?v=21
start "" http://localhost:8000/?v=21
py -m http.server 8000
if errorlevel 1 python -m http.server 8000
pause
