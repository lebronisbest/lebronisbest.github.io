@echo off
echo ========================================
echo Jekyll 로컬 서버 셋업
echo ========================================
echo.

REM Ruby 설치 확인
ruby --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Ruby가 설치되어 있지 않습니다.
    echo.
    echo Ruby 설치 방법:
    echo 1. https://rubyinstaller.org/ 접속
    echo 2. "Ruby+Devkit" 버전 다운로드
    echo 3. 설치 후 터미널 재시작
    echo.
    pause
    exit /b 1
)

echo [확인] Ruby 설치됨
ruby --version
echo.

REM Bundler 설치 확인
bundle --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [설치] Bundler 설치 중...
    gem install bundler
    if %errorlevel% neq 0 (
        echo [오류] Bundler 설치 실패
        pause
        exit /b 1
    )
)

echo [확인] Bundler 설치됨
bundle --version
echo.

REM 의존성 설치
echo [설치] Jekyll 의존성 설치 중... (시간이 걸릴 수 있습니다)
bundle install
if %errorlevel% neq 0 (
    echo [오류] 의존성 설치 실패
    pause
    exit /b 1
)

echo.
echo ========================================
echo 셋업 완료!
echo ========================================
echo.
echo 이제 다음 명령어로 서버를 실행하세요:
echo   bundle exec jekyll serve
echo.
echo 브라우저에서 http://localhost:4000 접속
echo.
pause

