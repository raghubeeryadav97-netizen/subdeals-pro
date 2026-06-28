@echo off
set SRC=C:\Users\user\SubDeals-Pro
set DST=C:\Users\user\SubDeals-Pro.zip
set TEMP=%TEMP%\sdpkg

if exist "%DST%" del /f "%DST%"
if exist "%TEMP%" rmdir /s /q "%TEMP%"

mkdir "%TEMP%"
robocopy "%SRC%" "%TEMP%" /E /XD node_modules .git dist backups logs /NFL /NDL /NJH /NJS /nc /ns /np

powershell -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%TEMP%\*' -DestinationPath '%DST%' -Force"
rmdir /s /q "%TEMP%"

echo ZIP created: %DST%