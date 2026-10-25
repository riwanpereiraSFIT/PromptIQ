@echo off
title PromptIQ - Unified Single-Port Server (Port 8000)
cd /d "%~dp0"
echo ========================================================
echo        PROMPTIQ UNIFIED SINGLE-PORT SERVER (PORT 8000)
echo ========================================================
echo Serving React production frontend + FastAPI BiLSTM backend
echo Web Application: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo ========================================================

set PYTHONUTF8=1
set PYTHONPATH=backend

if exist .venv\Scripts\python.exe (
    echo Using virtual environment at .venv...
    .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
) else (
    echo .venv not found. Running with system Python...
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
)
pause
