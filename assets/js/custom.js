// Apple-style blog features

(function() {
    'use strict';

    // ========================================
    // Dark Mode Toggle
    // ========================================
    function initThemeToggle() {
        // Check for saved theme preference or default to 'light' mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Create theme toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle dark mode');
        toggleButton.innerHTML = currentTheme === 'dark'
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"/></svg>';

        document.body.appendChild(toggleButton);

        // Toggle theme on button click
        toggleButton.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update button icon with smooth transition
            toggleButton.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                toggleButton.innerHTML = newTheme === 'dark'
                    ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"/></svg>';
                toggleButton.style.transform = 'rotate(0deg)';
            }, 150);
        });
    }

    // ========================================
    // Back to Top Button
    // ========================================
    function initBackToTop() {
        const backToTopButton = document.createElement('button');
        backToTopButton.className = 'back-to-top';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        backToTopButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"/></svg>';

        document.body.appendChild(backToTopButton);

        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Scroll to top on click
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // Search Functionality
    // ========================================
    function initSearch() {
        const postsSection = document.querySelector('.posts-section');
        if (!postsSection) return;

        // Create search container
        const searchSection = document.createElement('div');
        searchSection.className = 'search-section';
        searchSection.innerHTML = `
            <div class="search-container">
                <span class="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </span>
                <input type="text" class="search-input" placeholder="포스트 검색..." />
            </div>
        `;

        // Insert search before posts section
        postsSection.parentNode.insertBefore(searchSection, postsSection);

        const searchInput = searchSection.querySelector('.search-input');
        const postCards = postsSection.querySelectorAll('.post-card');

        // Search functionality
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();

            postCards.forEach(function(card) {
                const title = card.querySelector('.post-title')?.textContent.toLowerCase() || '';
                const subtitle = card.querySelector('.post-subtitle')?.textContent.toLowerCase() || '';
                const excerpt = card.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

                const searchContent = title + ' ' + subtitle + ' ' + excerpt + ' ' + tags;

                if (searchContent.includes(searchTerm)) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.4s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });

            // Show message if no results
            const visibleCards = Array.from(postCards).filter(card => card.style.display !== 'none');
            let noResultsMsg = postsSection.querySelector('.no-results');

            if (visibleCards.length === 0 && searchTerm !== '') {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('p');
                    noResultsMsg.className = 'no-results';
                    noResultsMsg.style.cssText = 'text-align: center; color: var(--text-secondary); font-size: 1.125rem; padding: 4rem 0;';
                    noResultsMsg.textContent = '검색 결과가 없습니다.';
                    postsSection.appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const elementsToAnimate = document.querySelectorAll('.hero-section, .section-title');
        elementsToAnimate.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // ========================================
    // Smooth Scrolling for Anchor Links
    // ========================================
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ========================================
    // Image Lazy Loading Enhancement
    // ========================================
    function initImageLoading() {
        const images = document.querySelectorAll('img[src]');
        images.forEach(function(img) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease-in-out';

            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.addEventListener('load', function() {
                    img.style.opacity = '1';
                });
            }
        });
    }

    // ========================================
    // Reading Time Calculator
    // ========================================
    function initReadingTime() {
        const readingTimeEl = document.getElementById('readingTime');
        if (!readingTimeEl) return;
        
        const content = document.querySelector('.post-content') || 
                       document.querySelector('article') || 
                       document.querySelector('.main-content');
        if (!content) return;
        
        const text = content.innerText || content.textContent;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const readingTime = Math.ceil(words / 200); // 분당 200단어 기준
        
        readingTimeEl.textContent = `약 ${readingTime}분 읽기`;
    }

    // ========================================
    // Table of Contents Generator
    // ========================================
    function initTableOfContents() {
        const tocContainer = document.querySelector('.table-of-contents');
        if (!tocContainer) return;
        
        const content = document.querySelector('.post-content') || document.querySelector('article');
        if (!content) return;
        
        const headings = content.querySelectorAll('h2, h3, h4');
        if (headings.length === 0) {
            tocContainer.remove();
            return;
        }
        
        const toc = document.getElementById('toc');
        if (!toc) return;
        
        let tocHTML = '<ul class="toc-list">';
        let currentLevel = 2;
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const id = heading.id || `heading-${index}`;
            heading.id = id;
            
            if (level > currentLevel) {
                tocHTML += '<ul class="toc-sublist">';
            } else if (level < currentLevel) {
                for (let i = currentLevel; i > level; i--) {
                    tocHTML += '</ul>';
                }
            }
            
            tocHTML += `<li class="toc-item toc-level-${level}">`;
            tocHTML += `<a href="#${id}" class="toc-link">${heading.textContent}</a>`;
            tocHTML += '</li>';
            
            currentLevel = level;
        });
        
        // 닫는 태그 추가
        while (currentLevel > 2) {
            tocHTML += '</ul>';
            currentLevel--;
        }
        
        tocHTML += '</ul>';
        toc.innerHTML = tocHTML;
        
        // 활성 항목 하이라이트
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const link = toc.querySelector(`a[href="#${id}"]`);
                    if (link) {
                        toc.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });
        
        headings.forEach(heading => observer.observe(heading));
    }

    // ========================================
    // Initialize all features
    // ========================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initThemeToggle();
                initBackToTop();
                initSearch();
                initScrollAnimations();
                initSmoothScrolling();
                initImageLoading();
                initReadingTime();
                initTableOfContents();
            });
        } else {
            initThemeToggle();
            initBackToTop();
            initSearch();
            initScrollAnimations();
            initSmoothScrolling();
            initImageLoading();
            initReadingTime();
            initTableOfContents();
        }
    }

    init();
})();
