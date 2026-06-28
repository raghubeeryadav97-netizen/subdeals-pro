@echo off
title SubDeals Pro - Firebase Deploy
echo.
echo ========================================
echo   SubDeals Pro - Firebase Deployment
echo ========================================
echo.

cd /d C:\Users\user\SubDeals-Pro

echo [1/5] Checking Firebase login...
firebase login:list
if %errorlevel% neq 0 (
  echo Please login first: firebase login
  firebase login
)

echo.
echo [2/5] Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
  echo Frontend build failed!
  pause
  exit /b 1
)
cd ..

echo.
echo [3/5] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [4/5] IMPORTANT - Set secrets before first deploy:
echo   firebase functions:secrets:set MONGODB_URI
echo   firebase functions:secrets:set JWT_SECRET
echo   firebase functions:secrets:set JWT_REFRESH_SECRET
echo.

echo [5/5] Deploying to Firebase...
firebase deploy
echo.
echo Done! Your site URL will be shown above.
pause