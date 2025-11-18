// Dark Mode Toggle
const toggleButton = document.getElementById('dark-mode-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleButton.textContent = '☀️ Light Mode';
    }
}

if (toggleButton) {
    toggleButton.addEventListener('click', function () {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            theme = 'dark';
            toggleButton.textContent = '☀️ Light Mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            theme = 'light';
            toggleButton.textContent = '🌙 Dark Mode';
        }
        localStorage.setItem('theme', theme);
    });
}

// Copy Code Button
document.querySelectorAll('pre.highlight').forEach(function (pre) {
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.textContent = 'Copy';

    const header = document.createElement('div');
    header.className = 'code-header';
    header.appendChild(button);

    pre.parentNode.insertBefore(header, pre);

    button.addEventListener('click', function () {
        const code = pre.querySelector('code').innerText;
        navigator.clipboard.writeText(code).then(function () {
            button.textContent = 'Copied!';
            setTimeout(function () {
                button.textContent = 'Copy';
            }, 2000);
        });
    });
});

// TOC Generation (Simple version if not using kramdown's auto TOC)
// Note: Beautiful Jekyll usually handles this, but if we need custom logic:
document.addEventListener('DOMContentLoaded', function () {
    const tocContainer = document.getElementById('toc');
    if (tocContainer) {
        const headings = document.querySelectorAll('.post-content h2, .post-content h3');
        if (headings.length > 0) {
            const ul = document.createElement('ul');
            headings.forEach(function (heading) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                if (!heading.id) {
                    heading.id = heading.textContent.toLowerCase().replace(/\s+/g, '-');
                }
                a.href = '#' + heading.id;
                a.textContent = heading.textContent;
                li.appendChild(a);
                ul.appendChild(li);
            });
            tocContainer.appendChild(ul);
        } else {
            document.querySelector('.toc-container').style.display = 'none';
        }
    }
});
