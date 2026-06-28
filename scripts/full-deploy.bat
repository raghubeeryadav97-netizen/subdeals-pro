@echo off
setlocal EnableDelayedExpansion
title SubDeals Pro - Full Deploy
cd /d C:\Users\user\SubDeals-Pro

set GIT="C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"

echo.
echo ============================================
echo   SubDeals Pro - FULL DEPLOYMENT
echo ============================================
echo.

:: Check MongoDB URI
if "%MONGODB_URI%"=="" (
  if exist backend\.env.production (
    for /f "tokens=1,* delims==" %%a in ('findstr MONGODB_URI backend\.env.production') do set MONGODB_URI=%%b
  )
)

if "%MONGODB_URI%"=="" (
  echo [!] MongoDB Atlas URI required.
  echo.
  echo STEP A - MongoDB Atlas ^(free^):
  echo   1. https://cloud.mongodb.com - Sign up
  echo   2. Create FREE M0 cluster
  echo   3. Network Access - Allow from anywhere
  echo   4. Database Access - Create user
  echo   5. Connect - Copy connection string
  echo.
  set /p MONGODB_URI="Paste MongoDB URI here: "
  if "!MONGODB_URI!"=="" (
    echo ERROR: MongoDB URI is required for full deploy.
    pause
    exit /b 1
  )
  echo MONGODB_URI=!MONGODB_URI!> backend\.env.production
)

echo [1/6] Git init...
if not exist .git %GIT% init
%GIT% add -A
%GIT% config user.email "deploy@subdealspro.com"
%GIT% config user.name "SubDeals Deploy"
%GIT% commit -m "SubDeals Pro full deploy" --allow-empty
%GIT% commit -m "SubDeals Pro production" -a --allow-empty 2>nul

echo [2/6] Deploying API to Vercel...
cd backend
set FRONTEND_URL=https://subdeals-696aa.web.app
set NODE_ENV=production
call npx vercel link --yes --project=subdeals-api 2>nul
call npx vercel env rm MONGODB_URI production -y 2>nul
echo %MONGODB_URI%| call npx vercel env add MONGODB_URI production
call npx vercel env rm FRONTEND_URL production -y 2>nul
echo https://subdeals-696aa.web.app| call npx vercel env add FRONTEND_URL production
call npx vercel env rm JWT_SECRET production -y 2>nul
echo subdeals-jwt-secret-prod-2026-secure-key| call npx vercel env add JWT_SECRET production
call npx vercel env rm JWT_REFRESH_SECRET production -y 2>nul
echo subdeals-refresh-secret-prod-2026-secure| call npx vercel env add JWT_REFRESH_SECRET production
call npx vercel env rm NODE_ENV production -y 2>nul
echo production| call npx vercel env add NODE_ENV production
call npx vercel deploy --prod --yes > ..\vercel-url.txt 2>&1
cd ..

for /f "tokens=*" %%i in ('findstr /i "https://" vercel-url.txt ^| findstr /i "vercel.app"') do set API_URL=%%i
if "%API_URL%"=="" set API_URL=https://subdeals-api.vercel.app

echo API URL: %API_URL%

echo [3/6] Updating frontend API URL...
echo VITE_API_URL=%API_URL%/api> frontend\.env.production
echo VITE_SOCKET_URL=>> frontend\.env.production

echo [4/6] Building frontend...
cd frontend
call npm run build
cd ..

echo [5/6] Deploying Firebase hosting...
call firebase deploy --only hosting

echo [6/6] Seeding database...
cd backend
set MONGODB_URI=%MONGODB_URI%
call npm run seed
cd ..

echo.
echo ============================================
echo   FULL DEPLOY COMPLETE!
echo ============================================
echo   Website: https://subdeals-696aa.web.app
echo   API:     %API_URL%/api/health
echo   Admin:   admin@subdealspro.com / Admin@123
echo ============================================
del vercel-url.txt 2>nul
pause