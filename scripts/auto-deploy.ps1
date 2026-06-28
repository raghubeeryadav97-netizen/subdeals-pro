$git = "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"
$root = "C:\Users\user\SubDeals-Pro"
$githubUser = "raghubeeryadav97-netizen"
$repoName = "subdeals-pro"
$repoUrl = "https://github.com/$githubUser/$repoName.git"

Set-Location $root

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SubDeals Pro - Auto Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fix Git SSL on Windows
& $git config --global http.sslBackend schannel 2>$null

# Git commit
& $git add -A
& $git config user.email "raghubeeryadav97@gmail.com"
& $git config user.name $githubUser
& $git commit -m "SubDeals Pro production deploy" -a 2>$null
& $git remote remove origin 2>$null
& $git remote add origin $repoUrl
& $git branch -M main

# Check if repo exists
Write-Host "Checking GitHub repo..." -ForegroundColor Yellow
try {
    $check = Invoke-WebRequest -Uri "https://github.com/$githubUser/$repoName" -UseBasicParsing -TimeoutSec 10
    $exists = $check.StatusCode -eq 200
} catch {
    $exists = $false
}

if (-not $exists) {
    Write-Host ""
    Write-Host "GitHub repo not found. Opening browser..." -ForegroundColor Yellow
    Write-Host "SIRF 1 CLICK KARO: 'Create repository' button" -ForegroundColor Green
    Write-Host ""
    Start-Process "https://github.com/new?name=$repoName&description=SubDeals+Pro+SaaS"
    Write-Host "Waiting for you to create empty repo (subdeals-pro)..." -ForegroundColor Yellow
    Write-Host "README, .gitignore, license - SAB UNCHECK rakho" -ForegroundColor Yellow
    Write-Host ""
    for ($i = 1; $i -le 60; $i++) {
        Start-Sleep -Seconds 5
        try {
            $r = Invoke-WebRequest -Uri "https://github.com/$githubUser/$repoName" -UseBasicParsing -TimeoutSec 5
            if ($r.StatusCode -eq 200) {
                Write-Host "Repo found! Pushing code..." -ForegroundColor Green
                $exists = $true
                break
            }
        } catch { }
        Write-Host "  Waiting... ($i/60)" -ForegroundColor DarkGray
    }
}

if ($exists) {
    Write-Host "Pushing to GitHub..." -ForegroundColor Green
    $push = & $git push -u origin main 2>&1
    Write-Host $push
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "GITHUB DONE: https://github.com/$githubUser/$repoName" -ForegroundColor Green
        Write-Host ""
        Write-Host "Opening Render to create Web Service..." -ForegroundColor Yellow
        Start-Process "https://dashboard.render.com/select-repo?type=web"
        Write-Host ""
        Write-Host "RENDER SETTINGS (copy-paste):" -ForegroundColor Cyan
        Write-Host "  Root Directory: backend"
        Write-Host "  Build Command:  npm install"
        Write-Host "  Start Command:  node server.js"
        Write-Host "  Plan:           Free"
        Write-Host ""
        Write-Host "ENV VARIABLES:" -ForegroundColor Cyan
        Write-Host "  FRONTEND_URL = https://subdeals-696aa.web.app"
        Write-Host "  NODE_ENV = production"
        Write-Host "  JWT_SECRET = subdeals-jwt-secret-2026"
        Write-Host "  JWT_REFRESH_SECRET = subdeals-refresh-2026"
        Write-Host "  MONGODB_URI = (Atlas connection string)"
    } else {
        Write-Host "Push failed. Manual upload ZIP:" -ForegroundColor Red
        Write-Host "  C:\Users\user\SubDeals-Pro-Upload.zip"
        Write-Host "  https://github.com/$githubUser/$repoName/upload"
        Start-Process "https://github.com/$githubUser/$repoName/upload"
    }
} else {
    Write-Host "Repo not created in time." -ForegroundColor Red
    Write-Host "Manual: Upload ZIP at https://github.com/new" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Render URL milne par mujhe bhejo - main site connect kar dunga." -ForegroundColor Cyan
Read-Host "Press Enter to close"