@echo off
setlocal enabledelayedexpansion

if "%~1"=="" (
  set /p APP_IDS=Enter Steam App ID(s) (comma or space separated): 
) else (
  set "APP_IDS=%*"
)

if "%APP_IDS%"=="" (
  echo No App ID provided.
  exit /b 1
)

if not exist "%~dp0SteamApi.txt" (
  echo SteamApi.txt not found. Place your Steam API key in SteamApi.txt and rerun.
  exit /b 1
)

set "ARGS="
for %%A in (%APP_IDS:,= %) do set "ARGS=!ARGS! --app-id %%A"

node "%~dp0dist\index.js" %ARGS% --output "%~dp0games.json" --output-csv "%~dp0achievements.csv"
endlocal
