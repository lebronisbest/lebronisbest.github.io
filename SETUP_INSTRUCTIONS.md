# 🚀 로컬 미리보기 셋업 (선택사항)

> ⚠️ **중요**: 포스트 작성은 **웹 에디터**를 사용해주세요!  
> https://lebronisbest.github.io/editor/  
> 이 가이드는 로컬에서 블로그를 미리보기 위한 것입니다.

## 빠른 시작

### 1단계: Ruby 설치 (필수)

1. **RubyInstaller 다운로드**
   - https://rubyinstaller.org/ 접속
   - **"Ruby+Devkit"** 버전 다운로드 (중요!)
   - 최신 버전 선택 (예: Ruby 3.2.x)

2. **설치**
   - 다운로드한 `.exe` 파일 실행
   - ✅ **"Add Ruby executables to your PATH"** 체크 (중요!)
   - 설치 완료

3. **터미널 재시작**
   - 현재 터미널을 닫고 새로 열기
   - 또는 Cursor를 재시작

4. **설치 확인**
   ```bash
   ruby --version
   ```
   버전이 나오면 성공!

---

### 2단계: 자동 셋업 실행

**방법 1: 배치 파일 사용 (추천)**
```bash
setup.bat
```

**방법 2: 수동 실행**
```bash
gem install bundler
bundle install
```

---

### 3단계: 서버 실행

**방법 1: 배치 파일 사용**
```bash
start.bat
```

**방법 2: 수동 실행**
```bash
bundle exec jekyll serve
```

---

### 4단계: 브라우저에서 확인

브라우저에서 **http://localhost:4000** 접속!

---

## 💡 팁

- **파일 수정하면 자동으로 새로고침됨!**
- 서버 중지: `Ctrl + C`
- 포트 변경: `bundle exec jekyll serve --port 4001`

---

## 문제 해결

### "ruby: command not found"
→ Ruby 설치 후 터미널을 재시작했는지 확인

### "bundle: command not found"
→ `gem install bundler` 실행

### 포트 충돌
→ `bundle exec jekyll serve --port 4001` 사용

### 의존성 설치 오류
→ `bundle update` 실행 후 다시 시도

---

## 다음에 사용할 때

Ruby 설치가 완료되면:
1. `start.bat` 실행
2. 브라우저에서 http://localhost:4000 접속
3. 끝!

---

**Ruby 설치만 하면 나머지는 자동으로 됩니다!** 🎉

