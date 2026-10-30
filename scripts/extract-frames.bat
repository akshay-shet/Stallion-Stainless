@echo off
setlocal

echo ============================================================
echo  Stallion — Scroll Video Frame Extractor
echo ============================================================
echo.

:: Check ffmpeg
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] ffmpeg not found in PATH.
    echo     Trying common install paths...
    if exist "C:\ffmpeg\bin\ffmpeg.exe" (
        set FFMPEG=C:\ffmpeg\bin\ffmpeg.exe
    ) else if exist "C:\Program Files\ffmpeg\bin\ffmpeg.exe" (
        set FFMPEG=C:\Program Files\ffmpeg\bin\ffmpeg.exe
    ) else (
        echo.
        echo [ERROR] ffmpeg is not installed. Please install it:
        echo   Option 1: winget install --id=Gyan.FFmpeg -e
        echo   Option 2: Download from https://ffmpeg.org/download.html
        echo             and add to PATH
        echo.
        pause
        exit /b 1
    )
) else (
    set FFMPEG=ffmpeg
)

echo [OK] ffmpeg found: %FFMPEG%
echo.

:: Source video
set VIDEO=D:\Stallion Project\Items\Home page Video.mp4
if not exist "%VIDEO%" (
    echo [ERROR] Video not found: %VIDEO%
    echo Please check the path and try again.
    pause
    exit /b 1
)
echo [OK] Video found: %VIDEO%
echo.

:: Output directory
set OUTDIR=D:\Stallion Project\Stallion Stainless V1\public\frames
if not exist "%OUTDIR%" mkdir "%OUTDIR%"
echo [OK] Output dir: %OUTDIR%
echo.

:: Get video duration
echo Getting video info...
%FFMPEG% -i "%VIDEO%" 2>&1 | findstr /i "Duration"
echo.

:: Extract frames at 10fps, scaled to 1920px wide, high quality JPEG
echo Extracting frames (10fps, max 1920px wide)...
echo This may take 1-3 minutes...
echo.
%FFMPEG% -i "%VIDEO%" -vf "fps=10,scale=1920:-2:flags=lanczos" -q:v 3 "%OUTDIR%\frame_%%04d.jpg" -y

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Frame extraction failed!
    pause
    exit /b 1
)

:: Count frames
set COUNT=0
for %%f in ("%OUTDIR%\frame_*.jpg") do set /a COUNT+=1

echo.
echo ============================================================
echo  DONE! Extracted %COUNT% frames
echo ============================================================
echo.
echo  Next step: Open the file below and set FRAME_COUNT to %COUNT%
echo  File: D:\Stallion Project\Stallion Stainless V1\src\components\HomePageClient.tsx
echo  Search for: const FRAME_COUNT =
echo.
echo  Then run: npm run dev
echo.

:: Write the frame count to a temp file so we know
echo %COUNT% > "%OUTDIR%\frame_count.txt"

pause
