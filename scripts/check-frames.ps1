# Run this in PowerShell — paste output back to chat

$dir = "D:\Stallion Project\Items\Home page Video_frames"
$files = Get-ChildItem $dir -File | Sort-Object Name

Write-Host "=== TOTAL COUNT ===" 
Write-Host $files.Count

Write-Host "`n=== FIRST 5 FILES ==="
$files | Select-Object -First 5 | ForEach-Object { Write-Host $_.Name }

Write-Host "`n=== LAST 5 FILES ==="
$files | Select-Object -Last 5 | ForEach-Object { Write-Host $_.Name }
