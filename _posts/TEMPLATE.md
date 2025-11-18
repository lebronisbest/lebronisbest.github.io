---
layout: post
title: "포스트 제목을 여기에 적으세요"
subtitle: "부제목 (없으면 이 줄 삭제하세요)"
date: 2025-11-18
author: lebronisbest
tags: [태그1, 태그2]
comments: true
share: true
related: true
toc: true
---

<!-- 읽기 시간 표시 -->
<div class="post-meta">
  <time datetime="{{ page.date | date: '%Y-%m-%d' }}">{{ page.date | date: "%Y년 %m월 %d일" }}</time>
  <span class="reading-time" id="readingTime"></span>
  {% if page.tags %}
  <div class="post-tags">
    {% for tag in page.tags %}
    <a href="{{ '/tags' | relative_url }}#{{ tag | slugify }}" class="tag">{{ tag }}</a>
    {% endfor %}
  </div>
  {% endif %}
</div>

<!-- 목차 (자동 생성) -->
<div class="table-of-contents">
  <h3 class="toc-title">목차</h3>
  <nav id="toc" class="toc-nav"></nav>
</div>

여기에 본문을 작성하세요.

그냥 일반 텍스트로 적어도 됩니다!

줄바꿈은 엔터 두 번 치면 됩니다.

## 소제목 (원하면 사용)

- 리스트 항목 1
- 리스트 항목 2

**굵게** 하려면 별표 2개로 감싸세요.

*기울임* 하려면 별표 1개로 감싸세요.

---

이게 전부입니다! 복잡한 문법 몰라도 됩니다.

---

<!-- 소셜 공유 버튼 -->
{% include share-buttons.html %}

<!-- 관련 포스트 -->
{% include related-posts.html %}

<!-- 댓글 -->
{% include comments.html %}

