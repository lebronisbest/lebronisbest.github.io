---
layout: page
title: 포스트 목록
subtitle: 모든 포스트
---

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
  {% for post in site.posts %}
  <article class="post-card">
    <h2 class="post-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
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
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
    {% endif %}
    <a href="{{ post.url | relative_url }}" class="read-more">더 보기</a>
  </article>
  {% endfor %}
</div>
