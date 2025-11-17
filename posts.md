---
layout: page
title: 포스트 목록
subtitle: 모든 포스트
---

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
    <a href="{{ post.url | relative_url }}" class="read-more">읽기 →</a>
  </article>
  {% endfor %}
</div>
