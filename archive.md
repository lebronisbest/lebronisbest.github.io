---
layout: page
title: 아카이브
subtitle: 모든 포스트를 날짜별로
---

<div class="posts-section">
  {% assign postsByYear = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
  
  {% for year in postsByYear %}
  <div class="archive-year">
    <h2 class="section-title">{{ year.name }}년</h2>
    
    {% assign postsByMonth = year.items | group_by_exp: "post", "post.date | date: '%m'" %}
    {% for month in postsByMonth %}
    <div class="archive-month">
      <h3 class="archive-month-title">
        {{ month.items[0].date | date: "%m월" }}
        <span class="post-count">({{ month.items.size }}개)</span>
      </h3>
      
      <div class="archive-posts">
        {% for post in month.items %}
        <article class="archive-post">
          <time class="archive-date" datetime="{{ post.date | date: '%Y-%m-%d' }}">
            {{ post.date | date: "%d일" }}
          </time>
          <div class="archive-content">
            <h4 class="archive-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h4>
            {% if post.tags %}
            <div class="post-tags">
              {% for tag in post.tags %}
              <span class="tag">{{ tag }}</span>
              {% endfor %}
            </div>
            {% endif %}
          </div>
        </article>
        {% endfor %}
      </div>
    </div>
    {% endfor %}
  </div>
  {% endfor %}
</div>

<style>
.archive-year {
  margin-bottom: 6rem;
}

.archive-month {
  margin-bottom: 3rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border-color);
}

.archive-month-title {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.post-count {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.archive-posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.archive-post {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.archive-post:hover {
  background: var(--bg-secondary);
}

.archive-date {
  min-width: 60px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 400;
}

.archive-content {
  flex: 1;
}

.archive-title {
  font-size: 1.125rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.archive-title a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.archive-title a:hover {
  color: var(--accent-color);
}

@media (max-width: 768px) {
  .archive-post {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .archive-date {
    min-width: auto;
  }
}
</style>

