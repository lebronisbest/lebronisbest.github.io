---
layout: page
title: 포스트 목록
subtitle: 모든 포스트
---

{% for post in site.posts %}
<div class="post-preview">
  <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
  {% if post.subtitle %}
  <p class="post-subtitle">{{ post.subtitle }}</p>
  {% endif %}
  <p class="post-meta">
    <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%Y년 %m월 %d일" }}</time>
    {% if post.tags %}
    <span class="tags">
      {% for tag in post.tags %}
      <span class="tag">{{ tag }}</span>
      {% endfor %}
    </span>
    {% endif %}
  </p>
  {% if post.excerpt %}
  <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 50 }}</p>
  {% endif %}
</div>
<hr>
{% endfor %}

