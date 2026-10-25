@echo off
title PromptIQ - Backend Server (FastAPI + BiLSTM)
cd /d "%~dp0"
echo ========================================================
echo        PROMPTIQ BACKEND SERVER (FastAPI + BiLSTM)
echo ========================================================
set PYTHONUTF8=1
set PYTHONPATH=backend

if exist .venv\Scripts\python.exe (
    echo Using virtual environment at .venv...
    .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
) else (
    echo .venv not found. Running with system Python...
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
)
pause
