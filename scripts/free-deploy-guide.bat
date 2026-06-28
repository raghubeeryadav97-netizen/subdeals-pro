@echo off
title SubDeals Pro - Free Deploy Guide
echo.
echo ============================================
echo   SubDeals Pro - 100%% FREE Deployment
echo ============================================
echo.
echo ALREADY LIVE (Frontend):
echo   https://subdeals-696aa.web.app
echo.
echo ============================================
echo   AB YE 2 STEPS KARO (sab free):
echo ============================================
echo.
echo STEP 1 - MongoDB Atlas (Free DB):
echo   1. https://www.mongodb.com/cloud/atlas/register
echo   2. Free M0 cluster banao
echo   3. Network Access - Allow from anywhere
echo   4. Connection string copy karo
echo.
echo STEP 2 - Render.com (Free API):
echo   1. https://render.com par sign up karo
echo   2. New Web Service
echo   3. GitHub connect karo YA manual deploy
echo   4. Root: backend
echo   5. Build: npm install
echo   6. Start: node server.js
echo   7. Plan: FREE
echo   8. Env vars add karo:
echo      MONGODB_URI = Atlas connection string
echo      FRONTEND_URL = https://subdeals-696aa.web.app
echo      NODE_ENV = production
echo   9. Deploy - URL milega jaise:
echo      https://subdeals-api.onrender.com
echo.
echo STEP 3 - Frontend update:
echo   frontend\.env.production mein API URL daalo
echo   npm run build
echo   firebase deploy --only hosting
echo.
echo Full guide: docs\FREE_DEPLOY.md
echo.
pause