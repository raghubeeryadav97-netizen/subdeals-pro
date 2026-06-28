$projectRoot = Split-Path -Parent $PSScriptRoot
$zipPath = Join-Path (Split-Path -Parent $projectRoot) "SubDeals-Pro.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$exclude = @('node_modules', '.git', 'dist', 'backups', 'logs', '*.log')

$tempDir = Join-Path $env:TEMP "SubDeals-Pro-package"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
Copy-Item $projectRoot $tempDir -Recurse

Get-ChildItem $tempDir -Recurse -Directory -Filter 'node_modules' | Remove-Item -Recurse -Force
Get-ChildItem $tempDir -Recurse -Directory -Filter 'dist' | Remove-Item -Recurse -Force
Get-ChildItem $tempDir -Recurse -Directory -Filter '.git' | Remove-Item -Recurse -Force

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
Remove-Item $tempDir -Recurse -Force

Write-Host "ZIP created: $zipPath"