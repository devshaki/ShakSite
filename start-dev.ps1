# ShakSite Development Scripts

# Start both frontend and backend in separate terminals

Write-Host "Starting ShakSite..." -ForegroundColor Green

# Start backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev"

# Wait a moment
Start-Sleep -Seconds 2

# Start frontend  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host ""
Write-Host "Backend starting on http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend starting on http://localhost:4200" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
