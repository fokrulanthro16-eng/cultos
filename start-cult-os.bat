@echo off
echo ==========================================================
echo   Starting CultOS: Autonomous Cultural Intelligence Engine
echo ==========================================================

echo [1/2] Launching Backend on http://localhost:8000...
start cmd /k "cd backend && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Launching Next.js Frontend on http://localhost:3000...
cd frontend
call npm run dev
pause
