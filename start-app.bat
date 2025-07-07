@echo off
setlocal EnableDelayedExpansion

echo.
echo 🚀 Starting Modern Signup Form Application
echo ===============================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Not in the project root directory
    echo Please run this script from the project root (Desktop/fun)
    pause
    exit /b 1
)

REM Check if port 3000 is available
netstat -an | find "3000" >nul
if !errorlevel! == 0 (
    echo ⚠️  Port 3000 is already in use
    echo ℹ️  This might be the backend server already running
    set /p continue="Continue anyway? (y/n): "
    if /i not "!continue!"=="y" (
        echo ❌ Aborted
        pause
        exit /b 1
    )
)

echo.
echo 🔧 Starting backend server...
start "Backend Server" cmd /k "npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo.
echo 🎨 Starting frontend application...
cd client

REM Check if client dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing client dependencies...
    npm install
)

REM Start the React development server on port 3001
start "Frontend App" cmd /k "set PORT=3001 && npm start"

echo.
echo ✅ Application started successfully!
echo 📍 Backend API: http://localhost:3000
echo 📍 Frontend App: http://localhost:3001
echo.
echo ⭐ Check the opened terminal windows to monitor the servers
echo ⭐ Close the terminal windows to stop the servers
echo.
pause
