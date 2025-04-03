@echo off
echo Setting up conda environment for ChatGPT automation...

REM Create the conda environment
call conda create -n chatgpt-automation python=3.10 -y
if %errorlevel% neq 0 (
    echo Failed to create conda environment.
    exit /b %errorlevel%
)

REM Activate the environment
call conda activate chatgpt-automation
if %errorlevel% neq 0 (
    echo Failed to activate conda environment.
    exit /b %errorlevel%
)

REM Install required packages
call pip install playwright
if %errorlevel% neq 0 (
    echo Failed to install playwright.
    exit /b %errorlevel%
)

REM Install browser
call playwright install chromium
if %errorlevel% neq 0 (
    echo Failed to install Chromium for Playwright.
    exit /b %errorlevel%
)

echo.
echo Environment setup complete!
echo.
echo To activate the environment, run:
echo conda activate chatgpt-automation
echo.
echo Make sure to set OPENAI_EMAIL and OPENAI_PASSWORD in your .env file.
echo.
pause 