$git = "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"
Set-Location C:\Users\user\SubDeals-Pro
& $git add -A
& $git config user.email "raghubeeryadav97@gmail.com"
& $git config user.name "raghubeeryadav97"
& $git commit -m "SubDeals Pro production" 2>$null
Write-Host "Git commit done"