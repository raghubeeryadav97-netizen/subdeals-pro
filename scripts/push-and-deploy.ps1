$git = "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"
$root = "C:\Users\user\SubDeals-Pro"
Set-Location $root

Write-Host "=== Git Push to GitHub ===" -ForegroundColor Cyan
& $git add -A
& $git config user.email "raghubeeryadav97@gmail.com"
& $git config user.name "raghubeeryadav97"
& $git commit -m "SubDeals Pro deploy" -a 2>$null

& $git remote remove origin 2>$null
& $git remote add origin https://github.com/raghubeeryadav97/subdeals-pro.git
& $git branch -M main

Write-Host "Pushing to GitHub..."
$push = & $git push -u origin main 2>&1
Write-Host $push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git push failed - GitHub repo may need to be created first at https://github.com/new" -ForegroundColor Yellow
}