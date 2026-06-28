param(
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl
)

$root = "C:\Users\user\SubDeals-Pro"
$apiUrl = $ApiUrl.TrimEnd('/')

Write-Host "Connecting frontend to: $apiUrl" -ForegroundColor Cyan

# Test API
try {
    $health = Invoke-RestMethod -Uri "$apiUrl/api/health" -TimeoutSec 60
    Write-Host "API Health: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "API not reachable yet. Render free tier wakes up in ~30 sec. Retry." -ForegroundColor Yellow
}

# Update frontend env
"VITE_API_URL=$apiUrl/api`nVITE_SOCKET_URL=" | Out-File "$root\frontend\.env.production" -Encoding utf8NoBOM

# Remove fallback-only - real API will be used
Set-Location "$root\frontend"
Write-Host "Building frontend..." -ForegroundColor Green
cmd /c "npm run build"

Set-Location $root
Write-Host "Deploying Firebase..." -ForegroundColor Green
cmd /c "firebase deploy --only hosting"

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "Website: https://subdeals-696aa.web.app"
Write-Host "API:     $apiUrl/api/health"
Write-Host "Admin:   admin@subdealspro.com / Admin@123"