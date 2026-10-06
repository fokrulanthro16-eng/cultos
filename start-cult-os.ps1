# CultOS One-Click Runner (Powershell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting CultOS: Autonomous Cultural Intelligence Engine" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Start Backend in new process
Write-Host "[1/2] Launching Backend on http://localhost:8000..." -ForegroundColor Yellow
$backendJob = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

# Start Frontend
Write-Host "[2/2] Launching Next.js Frontend on http://localhost:3000..." -ForegroundColor Yellow
cd frontend
npm run dev
