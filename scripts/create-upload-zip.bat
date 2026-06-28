@echo off
echo Creating upload ZIP for GitHub (without node_modules)...
set OUT=C:\Users\user\SubDeals-Pro-Upload.zip
if exist "%OUT%" del "%OUT%"

powershell -Command "$src='C:\Users\user\SubDeals-Pro'; $dst=Join-Path $env:TEMP 'sdp-upload'; if(Test-Path $dst){Remove-Item $dst -Recurse -Force}; robocopy $src $dst /E /XD node_modules .git dist backups logs /NFL /NDL /NJH /NJS /nc /ns /np; Compress-Archive -Path ($dst+'\*') -DestinationPath '%OUT%' -Force; Remove-Item $dst -Recurse -Force; Write-Host 'ZIP:' '%OUT%''"

echo.
echo ZIP ready: C:\Users\user\SubDeals-Pro-Upload.zip
echo GitHub par upload karo: https://github.com/new
pause