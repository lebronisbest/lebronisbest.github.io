---
layout: page
title: 태그
subtitle: 모든 태그
---

<div class="posts-section">
  <div class="tag-cloud">
    {% assign tags = site.posts | map: 'tags' | flatten | uniq | sort %}
    {% for tag in tags %}
      {% assign count = site.posts | where: 'tags', tag | size %}
      {% assign size = count | times: 1.0 | divided_by: site.posts.size | times: 100 | plus: 80 %}
      <a href="#{{ tag | slugify }}" class="tag-link" style="font-size: {{ size }}%;" data-tag="{{ tag }}">
        {{ tag }} <span class="tag-count">({{ count }})</span>
      </a>
    {% endfor %}
  </div>
  
  <div class="tag-posts">
    {% for tag in tags %}
    <div id="{{ tag | slugify }}" class="tag-section">
      <h2 class="section-title">{{ tag }} <span class="tag-count">({{ site.posts | where: 'tags', tag | size }})</span></h2>
      {% for post in site.posts %}
        {% if post.tags contains tag %}
        <article class="post-card">
          <h3 class="post-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          {% if post.subtitle %}
          <p class="post-subtitle">{{ post.subtitle }}</p>
          {% endif %}
          <div class="post-meta">
            <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%Y년 %m월 %d일" }}</time>
            {% if post.tags %}
            <div class="post-tags">
              {% for postTag in post.tags %}
              <span class="tag">{{ postTag }}</span>
              {% endfor %}
            </div>
            {% endif %}
          </div>
          {% if post.excerpt %}
          <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
          {% endif %}
          <a href="{{ post.url | relative_url }}" class="read-more">더 보기</a>
        </article>
        {% endif %}
      {% endfor %}
    </div>
    {% endfor %}
  </div>
</div>

<style>
.tag-cloud {
  text-align: center;
  padding: 3rem 2rem;
  margin-bottom: 4rem;
  line-height: 2.5;
}

.tag-link {
  display: inline-block;
  margin: 0.5rem 1rem;
  padding: 0.5rem 1.25rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.tag-link:hover {
  background: var(--accent-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-md);
  text-decoration: none;
}

.tag-count {
  font-size: 0.75em;
  opacity: 0.7;
  font-weight: 400;
}

.tag-section {
  margin-bottom: 6rem;
  scroll-margin-top: 100px;
}
</style>

