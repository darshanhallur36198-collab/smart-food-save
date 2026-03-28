@echo off
echo Restarting FoodSave Application Servers...
taskkill /F /IM node.exe >nul 2>&1
start cmd /k "title Backend Server && cd /d %~dp0backend && node server.js"
start cmd /k "title Frontend Server && cd /d %~dp0frontend && npm run dev"
echo Done! Servers are relaunching in new windows.
exit
