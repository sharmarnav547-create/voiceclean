@echo off
cd /d "%~dp0"
echo Starting ClearVoice AI backend (Demucs source separation)...
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
