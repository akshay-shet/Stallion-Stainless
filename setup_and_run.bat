@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo  STALLION STAINLESS: AUTOMATIC FRAME SETUP & DEV SERVER
echo ========================================================
echo.

set "SOURCE_DIR=D:\Stallion Project\Items\Home page Video_frames"
set "DEST_DIR=D:\Stallion Project\Stallion Stainless V1\public\frames"

if not exist "!SOURCE_DIR!" (
    echo [ERROR] Source frames folder not found at:
    echo "!SOURCE_DIR!"
    echo Please verify the folder path.
    pause
    exit /b 1
)

echo [1/3] Creating public\frames folder...
if not exist "!DEST_DIR!" mkdir "!DEST_DIR!"

echo [2/3] Copying frames from "!SOURCE_DIR!" to public\frames...
echo (This may take a moment depending on the number of frames)...
copy /Y "!SOURCE_DIR!\*" "!DEST_DIR!\" >nul

set COUNT=0
set "FIRST_FILE="
for /f "delims=" %%F in ('dir /b /a-d /on "!DEST_DIR!\*.*"') do (
    set /a COUNT+=1
    if !COUNT! EQU 1 set "FIRST_FILE=%%F"
)

echo [OK] Copied !COUNT! frames successfully!
echo First frame file name: !FIRST_FILE!
echo.

echo Total frames: !COUNT! > "!DEST_DIR!\frame_info.txt"
echo First file: !FIRST_FILE! >> "!DEST_DIR!\frame_info.txt"

echo [3/3] Launching Next.js dev server...
echo --------------------------------------------------------
cd /d "D:\Stallion Project\Stallion Stainless V1"
npm run dev

pause
