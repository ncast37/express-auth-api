@echo off
setlocal EnableDelayedExpansion

echo.
echo 🚀 Updating GitHub Repository with React Frontend
echo =================================================

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not a git repository
    echo Run 'git init' first or navigate to the correct directory
    pause
    exit /b 1
)

echo.
echo 📊 Checking git status...
git status --porcelain

echo.
echo 📦 Adding all files to git...
git add .

echo.
echo 📋 Files to be committed:
git status --short

echo.
echo 💬 Enter commit message (or press Enter for default):
set /p commit_message="Commit message: "

if "%commit_message%"=="" (
    set "commit_message=✨ Add React frontend with modern signup form

Features:
- 🎨 Multiple theme options (Default, Mocha, Glassmorphism)
- 🔐 Full JWT authentication integration
- 📱 Responsive mobile-first design
- ♿ WCAG accessibility compliant
- 🚀 Real-time validation and password strength
- 🛡️ Comprehensive error handling
- 📊 Protected routes and dashboard
- 🔧 Development tools and startup scripts

Components:
- SignupForm with theme switching
- LoginForm with validation
- Dashboard for authenticated users
- Auth hooks and API utilities
- Startup scripts for easy development"
)

echo.
echo 💾 Committing changes...
git commit -m "!commit_message!"

echo.
echo 🌐 Checking for remote repository...
git remote -v | find "origin" >nul
if !errorlevel! == 0 (
    echo Remote 'origin' found
    
    echo.
    echo ⬆️ Pushing to GitHub...
    
    REM Get current branch
    for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
    echo 📍 Current branch: !current_branch!
    
    REM Push to GitHub
    git push origin !current_branch!
    if !errorlevel! == 0 (
        echo.
        echo ✅ Successfully pushed to GitHub!
        
        REM Get remote URL
        for /f "tokens=*" %%i in ('git remote get-url origin') do set remote_url=%%i
        echo 🔗 Repository URL: !remote_url!
        
    ) else (
        echo.
        echo ❌ Failed to push to GitHub
        echo 💡 You may need to set up authentication or check your remote URL
        pause
        exit /b 1
    )
    
) else (
    echo ⚠️ No remote 'origin' found
    echo.
    echo 💡 To add a GitHub remote, run:
    echo git remote add origin https://github.com/yourusername/your-repo-name.git
    echo git push -u origin main
)

echo.
echo 🎉 Repository update complete!
echo.
echo 📁 Updated files include:
echo   ✅ React frontend components
echo   ✅ Authentication system
echo   ✅ Multiple themes
echo   ✅ Responsive design
echo   ✅ Development tools
echo   ✅ Documentation
echo.
pause
