@echo off
title SubDeals Pro - Startup
echo.
echo ========================================
echo   SubDeals Pro - Step by Step Startup
echo ========================================
echo.

echo [Step 1] Environment files...
if not exist "C:\Users\user\SubDeals-Pro\backend\.env" (
  copy "C:\Users\user\SubDeals-Pro\backend\.env.example" "C:\Users\user\SubDeals-Pro\backend\.env"
)
if not exist "C:\Users\user\SubDeals-Pro\frontend\.env" (
  copy "C:\Users\user\SubDeals-Pro\frontend\.env.example" "C:\Users\user\SubDeals-Pro\frontend\.env"
)
echo Done.
echo.

echo [Step 2] Installing dependencies...
cd /d C:\Users\user\SubDeals-Pro\backend
call npm install
cd /d C:\Users\user\SubDeals-Pro\frontend
call npm install --legacy-peer-deps
echo Done.
echo.

echo [Step 3] Database setup and seed...
cd /d C:\Users\user\SubDeals-Pro\backend
call npm run setup
echo.

echo [Step 4] Starting Backend (port 5000)...
start "SubDeals Backend" cmd /k "cd /d C:\Users\user\SubDeals-Pro\backend && npm run dev"
ping 127.0.0.1 -n 6 >nul
echo.

echo [Step 5] Starting Frontend (port 5173)...
start "SubDeals Frontend" cmd /k "cd /d C:\Users\user\SubDeals-Pro\frontend && npm run dev"
echo.

echo ========================================
echo   SubDeals Pro is starting!
echo ========================================
echo.
echo   Website:  http://localhost:5173
echo   API:      http://localhost:5000/api
echo   Admin:    admin@subdealspro.com / Admin@123
echo.
echo   Two terminal windows opened for backend and frontend.
echo   Wait 10-15 seconds then open http://localhost:5173
echo.
pause