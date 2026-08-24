@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto NONODE

for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /PID %%P /F >nul 2>nul
)

echo Starting Wujin Xiantu V12...
start "Wujin Xiantu Server" /min cmd /c "cd /d ""%~dp0"" && node server.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173/?v=090"
exit /b 0

:NONODE
echo ERROR: Node.js was not found.
echo Please install Node.js LTS first.
echo https://nodejs.org/
pause
exit /b 1
