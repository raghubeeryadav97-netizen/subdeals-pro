$git = "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"
$root = "C:\Users\user\SubDeals-Pro"
$repoUrl = "https://github.com/raghubeeryadav97-netizen/subdeals-pro.git"

Set-Location $root
& $git config --global http.sslBackend schannel 2>$null
& $git add -A
& $git config user.email "raghubeeryadav97@gmail.com"
& $git config user.name "raghubeeryadav97-netizen"
& $git commit -m "SubDeals Pro - full production code" -a 2>$null
& $git remote remove origin 2>$null
& $git remote add origin $repoUrl
& $git branch -M main
Write-Host "Pushing to GitHub..."
& $git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! Code pushed to GitHub" -ForegroundColor Green
    Write-Host "https://github.com/raghubeeryadav97-netizen/subdeals-pro"
} else {
    Write-Host "Push needs GitHub login - browser will open" -ForegroundColor Yellow
}