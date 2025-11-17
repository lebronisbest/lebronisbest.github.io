# 👀 미리보기 방법

## 방법 1: GitHub에 푸시해서 확인 (가장 간단)

1. 파일 저장
2. Git 커밋 & 푸시
3. 1-5분 후 블로그에서 확인: `https://lebronisbest.github.io`

**장점:** 별도 설치 없이 바로 확인 가능

---

## 방법 2: 로컬에서 Jekyll 실행 (실시간 미리보기)

### 준비물
- Ruby 설치 필요
- Git Bash 또는 PowerShell

### 실행 방법

1. **의존성 설치** (처음 한 번만)
```bash
bundle install
```

2. **로컬 서버 실행**
```bash
bundle exec jekyll serve
```

3. **브라우저에서 확인**
- `http://localhost:4000` 접속
- 파일 수정하면 자동으로 새로고침됨!

**장점:** 실시간으로 수정사항 확인 가능

---

## 방법 3: 온라인 마크다운 미리보기 (빠른 확인)

- **StackEdit**: https://stackedit.io/
- **Dillinger**: https://dillinger.io/
- **Markdown Live Preview**: https://markdownlivepreview.com/

이 사이트들에서 마크다운을 붙여넣으면 바로 미리보기를 볼 수 있습니다!

**장점:** 설치 없이 바로 사용 가능

---

## 추천

- **빠르게 확인**: 방법 3 (온라인 도구)
- **실제 블로그처럼**: 방법 1 (GitHub 푸시)
- **개발 중**: 방법 2 (로컬 Jekyll)

