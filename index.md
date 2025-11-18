---
layout: page
title: 홈
subtitle: 개발과 일상을 기록하는 블로그
---

<div class="hero-section fade-in">
  <h1 class="hero-title">안녕하세요</h1>
  <p class="hero-description">개발과 일상을 기록하는 블로그입니다.</p>
  <p class="hero-description" style="font-size: 1.125rem; margin-top: 2rem;">
    <a href="{{ '/posts' | relative_url }}" class="button">모든 포스트 보기</a>
    <a href="{{ '/about' | relative_url }}" class="button-secondary" style="margin-left: 1rem;">더 알아보기</a>
  </p>
</div>

<div class="search-section">
  <div class="search-container">
    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
    <input type="text" id="searchInput" class="search-input" placeholder="포스트 검색...">
  </div>
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
