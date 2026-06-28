$src = "C:\Users\user\SubDeals-Pro"
$dst = Join-Path $env:TEMP "sdp-upload"
$out = "C:\Users\user\SubDeals-Pro-Upload.zip"
if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }
if (Test-Path $out) { Remove-Item $out -Force }
robocopy $src $dst /E /XD node_modules .git backups logs /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
Compress-Archive -Path "$dst\*" -DestinationPath $out -Force
Remove-Item $dst -Recurse -Force
Write-Host "ZIP created: $out"