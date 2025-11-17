---
layout: default
title: 블로그
---

<div class="blog-page">
    <h1 class="page-title">블로그</h1>
    
    <div class="posts-list">
        {% for post in site.posts %}
        <article class="post-item">
            <div class="post-item-header">
                <time datetime="{{ post.date | date: '%Y-%m-%d' }}" class="post-item-date">
                    {{ post.date | date: "%Y년 %m월 %d일" }}
                </time>
                {% if post.categories %}
                <div class="post-item-categories">
                    {% for category in post.categories %}
                    <span class="category-badge">{{ category }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
            <h2 class="post-item-title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </h2>
            {% if post.excerpt %}
            <p class="post-item-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
            {% endif %}
            <a href="{{ post.url | relative_url }}" class="post-item-link">자세히 보기 →</a>
        </article>
        {% endfor %}
        
        {% if site.posts.size == 0 %}
        <div class="empty-state">
            <p>아직 작성된 포스트가 없습니다.</p>
            <p class="empty-state-sub">곧 멋진 콘텐츠를 공유할 예정입니다!</p>
        </div>
        {% endif %}
    </div>
</div>

