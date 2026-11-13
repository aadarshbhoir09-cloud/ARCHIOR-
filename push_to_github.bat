@echo off
title Push Archior to GitHub
color 0A
echo ========================================================
echo    PUSHING ARCHIOR INTERIOR DESIGN TO GITHUB
echo ========================================================
echo.
cd /d "d:\MY PROJECT\portfolio\New folder"
echo Current Repository Status:
git status -s
echo.
echo Pushing to: https://github.com/aadarshbhoir09-cloud/ARCHIOR-.git
echo (If prompted, please sign in via browser or paste your GitHub Token)
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   SUCCESS! All files are now live on GitHub:
    echo   https://github.com/aadarshbhoir09-cloud/ARCHIOR-
    echo ========================================================
) else (
    echo ========================================================
    echo   Push encountered an error. Check credentials above.
    echo ========================================================
)
echo.
pause
