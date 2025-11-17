# myCPBL Dev Log

개발과 일상을 기록하는 블로그입니다.

## 구조

- `_config.yaml` - Jekyll 설정 파일
- `_layouts/` - 페이지 레이아웃 템플릿
- `_includes/` - 재사용 가능한 HTML 컴포넌트
- `_posts/` - 블로그 포스트 (YYYY-MM-DD-title.md 형식)
- `assets/` - CSS, JavaScript, 이미지 등 정적 파일
- `index.md` - 홈페이지
- `blog.md` - 블로그 목록 페이지
- `about.md` - 소개 페이지

## 포스트 작성하기

`_posts/` 디렉터리에 다음 형식으로 파일을 생성하세요:

```markdown
---
layout: post
title: "포스트 제목"
date: 2024-01-01
categories: [카테고리]
author: lebronisbest
---

포스트 내용...
```

## 로컬에서 실행하기

Jekyll이 설치되어 있다면:

```bash
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000`으로 접속하세요.

## GitHub Pages 배포

이 저장소를 GitHub에 푸시하면 자동으로 GitHub Pages에 배포됩니다.

