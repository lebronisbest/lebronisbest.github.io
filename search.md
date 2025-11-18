---
layout: page
title: 검색
subtitle: 포스트 검색
---

<div class="search-section">
  <div class="search-container">
    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
    <input type="text" id="searchInput" class="search-input" placeholder="포스트 검색...">
  </div>
  <div id="searchResults" class="posts-section"></div>
</div>

<script>
(function() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  
  // 모든 포스트 데이터 로드
  const posts = [
    {% for post in site.posts %}
    {
      title: {{ post.title | jsonify }},
      url: {{ post.url | relative_url | jsonify }},
      date: {{ post.date | date: "%Y년 %m월 %d일" | jsonify }},
      excerpt: {{ post.excerpt | strip_html | truncatewords: 50 | jsonify }},
      tags: {{ post.tags | jsonify }},
      content: {{ post.content | strip_html | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];
  
  function performSearch(query) {
    if (!query.trim()) {
      searchResults.innerHTML = '';
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = posts.filter(post => {
      return post.title.toLowerCase().includes(lowerQuery) ||
             post.content.toLowerCase().includes(lowerQuery) ||
             post.excerpt.toLowerCase().includes(lowerQuery) ||
             (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)));
    });
    
    displayResults(results, query);
  }
  
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
          <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">검색 결과가 없습니다</p>
          <p style="font-size: 1rem;">다른 키워드로 검색해보세요.</p>
        </div>
      `;
      return;
    }
    
    let html = `<h2 class="section-title">검색 결과 (${results.length}개)</h2>`;
    
    results.forEach(post => {
      html += `
        <article class="post-card">
          <h3 class="post-title"><a href="${post.url}">${highlightText(post.title, query)}</a></h3>
          <div class="post-meta">
            <time>${post.date}</time>
            ${post.tags ? `
              <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <p class="post-excerpt">${highlightText(post.excerpt, query)}</p>
          <a href="${post.url}" class="read-more">더 보기</a>
        </article>
      `;
    });
    
    searchResults.innerHTML = html;
  }
  
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: var(--accent-color); color: white; padding: 0.1rem 0.3rem; border-radius: 4px;">$1</mark>');
  }
  
  // 검색 입력 이벤트
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });
  
  // URL 파라미터에서 검색어 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q');
  if (queryParam) {
    searchInput.value = queryParam;
    performSearch(queryParam);
  }
})();
</script>

