$ffmpegPaths = @(
    "ffmpeg",
    "C:\ffmpeg\bin\ffmpeg.exe",
    "C:\Program Files\ffmpeg\bin\ffmpeg.exe",
    "C:\Users\$env:USERNAME\ffmpeg\bin\ffmpeg.exe",
    "C:\ProgramData\chocolatey\bin\ffmpeg.exe",
    "C:\Windows\System32\ffmpeg.exe"
)

foreach ($path in $ffmpegPaths) {
    try {
        $result = & $path -version 2>&1
        if ($LASTEXITCODE -eq 0 -or $result -match "ffmpeg version") {
            Write-Host "FOUND: $path"
            & $path -version 2>&1 | Select-Object -First 1
            exit 0
        }
    } catch {}
}

Write-Host "ffmpeg NOT FOUND"
Write-Host "Checking if winget/choco available..."
where.exe ffmpeg 2>&1
Get-Command ffmpeg -ErrorAction SilentlyContinue
