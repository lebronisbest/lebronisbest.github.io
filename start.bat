@echo off
echo ========================================
echo Jekyll 로컬 서버 시작
echo ========================================
echo.

REM Ruby 확인
ruby --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Ruby가 설치되어 있지 않습니다.
    echo setup.bat을 먼저 실행하세요.
    pause
    exit /b 1
)

echo [시작] Jekyll 서버 실행 중...
echo 브라우저에서 http://localhost:4000 접속하세요
echo 서버 중지: Ctrl + C
echo.

bundle exec jekyll serve

