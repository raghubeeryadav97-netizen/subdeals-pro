$ErrorActionPreference = "Stop"
$git = "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"
$root = "C:\Users\user\SubDeals-Pro"
Set-Location $root

Write-Host "=== SubDeals Pro Full Deploy ===" -ForegroundColor Cyan

# Read MongoDB URI
$mongoUri = $env:MONGODB_URI
if (-not $mongoUri -and (Test-Path "$root\backend\.env.production")) {
    $line = Get-Content "$root\backend\.env.production" | Where-Object { $_ -match "^MONGODB_URI=" }
    if ($line) { $mongoUri = $line -replace "^MONGODB_URI=", "" }
}

if (-not $mongoUri) {
    Write-Host ""
    Write-Host "MongoDB Atlas URI required (free): https://cloud.mongodb.com" -ForegroundColor Yellow
    Write-Host "Steps: Create M0 cluster -> Network Allow All -> Copy connection string" -ForegroundColor Yellow
    $mongoUri = Read-Host "Paste MONGODB_URI"
    if (-not $mongoUri) { throw "MongoDB URI is required" }
    "MONGODB_URI=$mongoUri" | Out-File "$root\backend\.env.production" -Encoding utf8
}

# Vercel deploy
Set-Location "$root\backend"
Write-Host "[1/4] Deploying API to Vercel..." -ForegroundColor Green

$env:FRONTEND_URL = "https://subdeals-696aa.web.app"
$env:NODE_ENV = "production"

# Check vercel login
$whoami = cmd /c "npx vercel whoami 2>&1"
if ($whoami -match "Error") {
    Write-Host "Vercel login required - browser will open..." -ForegroundColor Yellow
    cmd /c "npx vercel login"
}

function Set-VercelEnv($name, $value) {
    cmd /c "npx vercel env rm $name production -y 2>nul" | Out-Null
    $value | cmd /c "npx vercel env add $name production"
}

Set-VercelEnv "MONGODB_URI" $mongoUri
Set-VercelEnv "FRONTEND_URL" "https://subdeals-696aa.web.app"
Set-VercelEnv "JWT_SECRET" "subdeals-jwt-prod-secret-2026-secure"
Set-VercelEnv "JWT_REFRESH_SECRET" "subdeals-refresh-prod-secret-2026"
Set-VercelEnv "NODE_ENV" "production"
Set-VercelEnv "ADMIN_WHATSAPP" "919876543210"

$deployOut = cmd /c "npx vercel deploy --prod --yes 2>&1"
$deployOut | Out-File "$root\vercel-deploy.log"
Write-Host $deployOut

$apiUrl = ($deployOut | Select-String -Pattern "https://[a-z0-9-]+\.vercel\.app" | Select-Object -Last 1).Matches.Value
if (-not $apiUrl) { $apiUrl = "https://subdeals-api.vercel.app" }
Write-Host "API URL: $apiUrl" -ForegroundColor Cyan

# Update frontend
Set-Location "$root\frontend"
"VITE_API_URL=$apiUrl/api`nVITE_SOCKET_URL=" | Out-File ".env.production" -Encoding utf8NoBOM

Write-Host "[2/4] Building frontend..." -ForegroundColor Green
cmd /c "npm run build"

Write-Host "[3/4] Deploying Firebase..." -ForegroundColor Green
Set-Location $root
cmd /c "firebase deploy --only hosting"

Write-Host "[4/4] Seeding database..." -ForegroundColor Green
Set-Location "$root\backend"
$env:MONGODB_URI = $mongoUri
cmd /c "npm run seed"

Write-Host ""
Write-Host "=== FULL DEPLOY COMPLETE ===" -ForegroundColor Green
Write-Host "Website: https://subdeals-696aa.web.app"
Write-Host "API:     $apiUrl/api/health"
Write-Host "Admin:   admin@subdealspro.com / Admin@123"