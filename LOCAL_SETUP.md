# 🚀 로컬 미리보기 (선택사항)

> ⚠️ **중요**: 포스트 작성은 **웹 에디터**를 사용해주세요!  
> 이 가이드는 로컬에서 블로그를 미리보기 위한 것입니다.

## 1단계: Ruby 설치

### Windows에서 Ruby 설치

1. **RubyInstaller 다운로드**
   - https://rubyinstaller.org/ 접속
   - "Ruby+Devkit" 버전 다운로드 (권장)
   - 최신 버전 선택 (예: Ruby 3.2.x)

2. **설치**
   - 다운로드한 파일 실행
   - "Add Ruby executables to your PATH" 체크
   - 설치 완료 후 터미널 재시작

3. **설치 확인**
   ```bash
   ruby --version
   ```
   버전이 나오면 성공!

---

## 2단계: Jekyll 의존성 설치

터미널에서 블로그 폴더로 이동 후:

```bash
cd C:\Users\user\lebronisbest.github.io
bundle install
```

시간이 좀 걸릴 수 있습니다 (5-10분).

---

## 3단계: 로컬 서버 실행

```bash
bundle exec jekyll serve
```

성공하면 다음과 같은 메시지가 나옵니다:
```
Server address: http://127.0.0.1:4000/
```

---

## 4단계: 브라우저에서 확인

브라우저에서 `http://localhost:4000` 접속!

---

## 💡 팁

- **파일 수정하면 자동으로 새로고침됨!**
- 서버 중지: `Ctrl + C`
- 오류 발생 시: `bundle update` 실행 후 다시 시도

---

## 문제 해결

### "bundle: command not found" 오류
```bash
gem install bundler
```

### 포트 충돌 오류
```bash
bundle exec jekyll serve --port 4001
```

---

**설치가 완료되면 언제든지 로컬에서 미리보기 가능합니다!** 🎉

