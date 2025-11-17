# 📝 로컬에서 포스트 작성하기

## 작성 위치

**`_posts` 폴더**에 마크다운 파일을 만들면 됩니다!

## 파일 경로

```
C:\Users\user\lebronisbest.github.io\_posts\
```

## 작성 방법

### 1. 새 파일 생성
`_posts` 폴더 안에 새 파일을 만드세요.

**파일명 형식:** `YYYY-MM-DD-제목.md`

예시:
- `2025-11-18-첫번째-포스트.md`
- `2025-11-19-javascript-배우기.md`
- `2025-11-20-일상-기록.md`

### 2. 파일 내용 작성

아래 템플릿을 복사해서 사용하세요:

```markdown
---
layout: post
title: "포스트 제목"
subtitle: "부제목 (선택사항)"
date: 2025-11-18
author: lebronisbest
tags: [태그1, 태그2]
---

여기에 본문을 작성하세요.

## 소제목

- 리스트 항목 1
- 리스트 항목 2

**굵게**, *기울임*, `코드` 사용 가능!
```

### 3. 저장 후 푸시

파일을 저장한 후:

```bash
git add _posts/파일명.md
git commit -m "새 포스트 추가"
git push origin main
```

또는 GitHub Desktop을 사용하시면 더 쉽습니다!

## 💡 팁

- **날짜**: 오늘 날짜로 자동 설정하려면 `date: 2025-11-18` 부분만 수정
- **태그**: `[개발, JavaScript, 일상]` 형식으로 여러 개 가능
- **이미지**: `assets/img/` 폴더에 이미지를 넣고 참조하세요

---

**간단하죠? `_posts` 폴더에 파일만 만들면 됩니다!** 🎉

