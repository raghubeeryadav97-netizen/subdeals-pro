$git = "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"
Set-Location C:\Users\user\SubDeals-Pro
& $git remote remove origin 2>$null
& $git remote add origin https://github.com/raghubeeryadav97/subdeals-pro.git
& $git branch -M main
& $git push -u origin main 2>&1