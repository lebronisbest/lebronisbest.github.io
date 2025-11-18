---
layout: page
title: 홈
subtitle: 개발과 일상을 기록하는 블로그
---

<div class="hero-section">
  <h1 class="hero-title">안녕하세요</h1>
  <p class="hero-description">개발과 일상을 기록하는 블로그입니다.</p>
</div>

<div class="posts-section">
  <h2 class="section-title">최근 포스트</h2>
  
  {% for post in site.posts limit: 10 %}
  <article class="post-card">
    <h3 class="post-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    {% if post.subtitle %}
    <p class="post-subtitle">{{ post.subtitle }}</p>
    {% endif %}
    <div class="post-meta">
      <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%Y년 %m월 %d일" }}</time>
      {% if post.tags %}
      <div class="post-tags">
        {% for tag in post.tags %}
        <span class="tag">{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </div>
    {% if post.excerpt %}
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
    {% endif %}
    <a href="{{ post.url | relative_url }}" class="read-more">더 보기</a>
  </article>
  {% endfor %}
</div>
