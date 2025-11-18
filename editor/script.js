// GitHub API 설정
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'lebronisbest';
const REPO_NAME = 'lebronisbest.github.io';
const POSTS_PATH = '_posts';
const ASSETS_IMG_PATH = 'assets/img';

// 전역 변수
let githubToken = null;
let currentPost = null;
let posts = [];

// DOM 요소
const authSection = document.getElementById('authSection');
const editorSection = document.getElementById('editorSection');
const tokenInput = document.getElementById('tokenInput');
const authBtn = document.getElementById('authBtn');
const saveBtn = document.getElementById('saveBtn');
const publishBtn = document.getElementById('publishBtn');
const newPostBtn = document.getElementById('newPostBtn');
const postsList = document.getElementById('postsList');
const titleInput = document.getElementById('titleInput');
const subtitleInput = document.getElementById('subtitleInput');
const dateInput = document.getElementById('dateInput');
const tagsInput = document.getElementById('tagsInput');
const markdownEditor = document.getElementById('markdownEditor');
const preview = document.getElementById('preview');
const imageModal = document.getElementById('imageModal');
const imageInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const imageNameInput = document.getElementById('imageNameInput');
const confirmUpload = document.getElementById('confirmUpload');
const cancelUpload = document.getElementById('cancelUpload');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 저장된 토큰 확인
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
        githubToken = savedToken;
        tokenInput.value = savedToken;
        showEditor();
        loadPosts();
    }

    // 이벤트 리스너 설정
    setupEventListeners();
    setupEditor();
    setupTabs();
    setupToolbar();
    setupImageUpload();
    
    // 오늘 날짜로 기본 설정
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

// 이벤트 리스너 설정
function setupEventListeners() {
    authBtn.addEventListener('click', handleAuth);
    saveBtn.addEventListener('click', handleSave);
    publishBtn.addEventListener('click', handlePublish);
    newPostBtn.addEventListener('click', handleNewPost);
    
    // 토큰 입력 시 엔터키
    tokenInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAuth();
        }
    });
    
    // 마크다운 에디터 변경 시 미리보기 업데이트
    markdownEditor.addEventListener('input', updatePreview);
    
    // 메타데이터 변경 시 자동 저장 표시
    [titleInput, subtitleInput, dateInput, tagsInput].forEach(input => {
        input.addEventListener('input', () => {
            if (currentPost) {
                currentPost.hasChanges = true;
            }
        });
    });
    
    markdownEditor.addEventListener('input', () => {
        if (currentPost) {
            currentPost.hasChanges = true;
        }
    });
}

// 에디터 설정
function setupEditor() {
    // 키보드 단축키
    markdownEditor.addEventListener('keydown', (e) => {
        // Ctrl+B: 굵게
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            insertMarkdown('**', '**');
        }
        // Ctrl+I: 기울임
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            insertMarkdown('*', '*');
        }
        // Ctrl+K: 링크
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            insertLink();
        }
    });
}

// 탭 설정
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // 탭 버튼 활성화
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 탭 컨텐츠 표시
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            if (tab === 'write') {
                document.getElementById('writeTab').classList.add('active');
            } else if (tab === 'preview') {
                document.getElementById('previewTab').classList.add('active');
                updatePreview();
            }
        });
    });
}

// 툴바 설정
function setupToolbar() {
    const toolBtns = document.querySelectorAll('.tool-btn');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleToolbarAction(action);
        });
    });
}

// 툴바 액션 처리
function handleToolbarAction(action) {
    const textarea = markdownEditor;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    switch (action) {
        case 'bold':
            insertMarkdown('**', '**', selectedText);
            break;
        case 'italic':
            insertMarkdown('*', '*', selectedText);
            break;
        case 'heading':
            insertMarkdown('## ', '', selectedText || '제목');
            break;
        case 'link':
            insertLink(selectedText);
            break;
        case 'image':
            showImageModal();
            break;
        case 'code':
            if (selectedText.includes('\n')) {
                insertMarkdown('```\n', '\n```', selectedText);
            } else {
                insertMarkdown('`', '`', selectedText);
            }
            break;
        case 'quote':
            insertMarkdown('> ', '', selectedText);
            break;
        case 'list':
            insertList(selectedText);
            break;
    }
}

// 마크다운 삽입
function insertMarkdown(before, after, text = '') {
    const textarea = markdownEditor;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text || textarea.value.substring(start, end);
    
    const newText = before + selectedText + after;
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    
    textarea.value = newValue;
    textarea.focus();
    
    // 커서 위치 조정
    const newCursorPos = start + before.length + selectedText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
}

// 링크 삽입
function insertLink(text = '') {
    const linkText = text || '링크 텍스트';
    const url = prompt('URL을 입력하세요:', 'https://');
    if (url) {
        insertMarkdown(`[${linkText}](`, ')', url);
    }
}

// 리스트 삽입
function insertList(text = '') {
    if (text) {
        const lines = text.split('\n');
        const listItems = lines.map(line => `- ${line}`).join('\n');
        insertMarkdown('', '', listItems);
    } else {
        insertMarkdown('- ', '', '리스트 항목');
    }
}

// 미리보기 업데이트
function updatePreview() {
    if (typeof marked !== 'undefined') {
        const markdown = markdownEditor.value;
        preview.innerHTML = marked.parse(markdown);
    }
}

// 이미지 업로드 설정
function setupImageUpload() {
    // 드래그 앤 드롭
    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--accent-color)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageSelect(files[0]);
        }
    });
    
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageSelect(e.target.files[0]);
        }
    });
    
    confirmUpload.addEventListener('click', handleImageUpload);
    cancelUpload.addEventListener('click', closeImageModal);
    
    document.querySelector('.close-btn').addEventListener('click', closeImageModal);
    
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });
}

// 이미지 선택 처리
function handleImageSelect(file) {
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
        uploadArea.style.display = 'none';
        
        // 파일명 자동 설정
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        imageNameInput.value = fileName;
        
        confirmUpload.disabled = false;
        confirmUpload.dataset.file = file.name;
    };
    reader.readAsDataURL(file);
}

// 이미지 업로드
async function handleImageUpload() {
    if (!imageInput.files[0]) return;
    
    const file = imageInput.files[0];
    const fileName = imageNameInput.value || 'image';
    const fileExtension = file.name.split('.').pop();
    const fullFileName = `${fileName}.${fileExtension}`;
    
    try {
        confirmUpload.disabled = true;
        confirmUpload.textContent = '업로드 중...';
        
        // Base64로 인코딩
        const base64Content = await fileToBase64(file);
        
        // GitHub API로 업로드
        const path = `${ASSETS_IMG_PATH}/${fullFileName}`;
        const message = `이미지 업로드: ${fullFileName}`;
        
        const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                content: base64Content,
            }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '업로드 실패');
        }
        
        // 마크다운에 이미지 삽입
        const imageMarkdown = `![${fileName}](/assets/img/${fullFileName})`;
        const textarea = markdownEditor;
        const start = textarea.selectionStart;
        const newValue = textarea.value.substring(0, start) + '\n' + imageMarkdown + '\n' + textarea.value.substring(start);
        textarea.value = newValue;
        textarea.focus();
        textarea.setSelectionRange(start + imageMarkdown.length + 2, start + imageMarkdown.length + 2);
        
        closeImageModal();
        showMessage('이미지가 업로드되었습니다!', 'success');
        
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드 실패: ' + error.message);
        confirmUpload.disabled = false;
        confirmUpload.textContent = '업로드';
    }
}

// 파일을 Base64로 변환
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 이미지 모달 표시
function showImageModal() {
    imageModal.classList.add('active');
    imagePreview.style.display = 'none';
    uploadArea.style.display = 'block';
    imageInput.value = '';
    imageNameInput.value = '';
    confirmUpload.disabled = true;
    confirmUpload.textContent = '업로드';
}

// 이미지 모달 닫기
function closeImageModal() {
    imageModal.classList.remove('active');
}

// 인증 처리
async function handleAuth() {
    const token = tokenInput.value.trim();
    
    if (!token) {
        alert('토큰을 입력해주세요.');
        return;
    }
    
    try {
        authBtn.disabled = true;
        authBtn.textContent = '인증 중...';
        
        // 토큰 검증
        const response = await fetch(`${GITHUB_API}/user`, {
            headers: {
                'Authorization': `token ${token}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('인증 실패. 토큰을 확인해주세요.');
        }
        
        githubToken = token;
        localStorage.setItem('github_token', token);
        
        showEditor();
        loadPosts();
        showMessage('인증 성공!', 'success');
        
    } catch (error) {
        console.error('인증 실패:', error);
        alert('인증 실패: ' + error.message);
    } finally {
        authBtn.disabled = false;
        authBtn.textContent = '인증하기';
    }
}

// 에디터 표시
function showEditor() {
    authSection.style.display = 'none';
    editorSection.style.display = 'flex';
}

// 포스트 목록 로드
async function loadPosts() {
    try {
        const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${POSTS_PATH}`, {
            headers: {
                'Authorization': `token ${githubToken}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('포스트 목록을 불러올 수 없습니다.');
        }
        
        const files = await response.json();
        posts = files.filter(file => file.name.endsWith('.md') && file.name !== 'TEMPLATE.md');
        
        renderPostsList();
        
    } catch (error) {
        console.error('포스트 목록 로드 실패:', error);
        alert('포스트 목록을 불러오는데 실패했습니다: ' + error.message);
    }
}

// 포스트 목록 렌더링
function renderPostsList() {
    postsList.innerHTML = '';
    
    if (posts.length === 0) {
        postsList.innerHTML = '<div style="padding: 1rem; color: var(--text-secondary); text-align: center;">포스트가 없습니다</div>';
        return;
    }
    
    posts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.className = 'post-item';
        
        // 파일명에서 날짜와 제목 추출
        const match = post.name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
        const date = match ? match[1] : post.name;
        const title = match ? match[2].replace(/-/g, ' ') : post.name;
        
        postItem.innerHTML = `
            <div class="post-item-title">${title}</div>
            <div class="post-item-date">${date}</div>
        `;
        
        postItem.addEventListener('click', () => {
            // 활성 포스트 표시
            document.querySelectorAll('.post-item').forEach(item => {
                item.classList.remove('active');
            });
            postItem.classList.add('active');
            loadPost(post);
        });
        
        postsList.appendChild(postItem);
    });
}

// 포스트 로드
async function loadPost(post) {
    try {
        const response = await fetch(post.download_url);
        if (!response.ok) {
            throw new Error('포스트를 불러올 수 없습니다.');
        }
        
        const content = await response.text();
        const { frontMatter, body } = parseMarkdown(content);
        
        // 메타데이터 설정
        titleInput.value = frontMatter.title || '';
        subtitleInput.value = frontMatter.subtitle || '';
        dateInput.value = frontMatter.date || new Date().toISOString().split('T')[0];
        tagsInput.value = Array.isArray(frontMatter.tags) ? frontMatter.tags.join(', ') : '';
        markdownEditor.value = body;
        
        currentPost = {
            ...post,
            frontMatter,
            body,
            hasChanges: false,
        };
        
        updatePreview();
        showMessage('포스트를 불러왔습니다.', 'success');
        
    } catch (error) {
        console.error('포스트 로드 실패:', error);
        alert('포스트를 불러오는데 실패했습니다: ' + error.message);
    }
}

// 마크다운 파싱 (Front Matter 추출)
function parseMarkdown(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
        return {
            frontMatter: {},
            body: content,
        };
    }
    
    const frontMatterText = match[1];
    const body = match[2];
    
    // 간단한 YAML 파싱
    const frontMatter = {};
    frontMatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // 따옴표 제거
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // 배열 파싱
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            }
            
            frontMatter[key] = value;
        }
    });
    
    return { frontMatter, body };
}

// 새 포스트
function handleNewPost() {
    if (currentPost && currentPost.hasChanges) {
        if (!confirm('저장하지 않은 변경사항이 있습니다. 계속하시겠습니까?')) {
            return;
        }
    }
    
    // 초기화
    titleInput.value = '';
    subtitleInput.value = '';
    dateInput.value = new Date().toISOString().split('T')[0];
    tagsInput.value = '';
    markdownEditor.value = '';
    currentPost = null;
    
    // 활성 포스트 표시 제거
    document.querySelectorAll('.post-item').forEach(item => {
        item.classList.remove('active');
    });
    
    titleInput.focus();
}

// 저장
async function handleSave() {
    if (!currentPost) {
        alert('먼저 포스트를 선택하거나 새 포스트를 만드세요.');
        return;
    }
    
    await savePost(false);
}

// 발행
async function handlePublish() {
    if (!titleInput.value.trim()) {
        alert('제목을 입력해주세요.');
        titleInput.focus();
        return;
    }
    
    await savePost(true);
}

// 포스트 저장
async function savePost(isPublish) {
    try {
        // Front Matter 생성
        const frontMatter = {
            layout: 'post',
            title: `"${titleInput.value}"`,
            date: dateInput.value,
            author: 'lebronisbest',
        };
        
        if (subtitleInput.value.trim()) {
            frontMatter.subtitle = `"${subtitleInput.value}"`;
        }
        
        if (tagsInput.value.trim()) {
            const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
            frontMatter.tags = `[${tags.map(t => t).join(', ')}]`;
        }
        
        // Front Matter 문자열 생성
        const frontMatterText = Object.entries(frontMatter)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        
        // 전체 마크다운 생성
        const content = `---\n${frontMatterText}\n---\n\n${markdownEditor.value}`;
        
        // 파일명 생성
        const date = dateInput.value;
        let titleSlug = titleInput.value.trim();
        
        // 한글과 영문, 숫자만 허용하고 공백/특수문자를 하이픈으로 변환
        titleSlug = titleSlug
            .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거
            .replace(/\s+/g, '-') // 공백을 하이픈으로
            .replace(/-+/g, '-') // 연속된 하이픈을 하나로
            .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거
        
        // 파일명이 비어있으면 기본값 사용
        if (!titleSlug) {
            titleSlug = 'untitled';
        }
        
        const fileName = `${date}-${titleSlug}.md`;
        const path = `${POSTS_PATH}/${fileName}`;
        
        // Base64 인코딩 (UTF-8)
        const base64Content = btoa(unescape(encodeURIComponent(content)));
        
        // GitHub API 요청
        const method = currentPost && currentPost.sha ? 'PUT' : 'POST';
        const url = method === 'PUT' 
            ? `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${currentPost.path}`
            : `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
        
        const body = {
            message: isPublish ? `포스트 발행: ${titleInput.value}` : `포스트 저장: ${titleInput.value}`,
            content: base64Content,
        };
        
        if (method === 'PUT') {
            body.sha = currentPost.sha;
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '저장 실패');
        }
        
        const result = await response.json();
        
        // 현재 포스트 업데이트
        if (!currentPost) {
            currentPost = {
                name: fileName,
                path: path,
                sha: result.content.sha,
                download_url: result.content.download_url,
                hasChanges: false,
            };
            await loadPosts();
        } else {
            currentPost.sha = result.content.sha;
            currentPost.hasChanges = false;
        }
        
        showMessage(isPublish ? '포스트가 발행되었습니다!' : '포스트가 저장되었습니다!', 'success');
        
    } catch (error) {
        console.error('저장 실패:', error);
        alert('저장 실패: ' + error.message);
    }
}

// 메시지 표시
function showMessage(message, type = 'info') {
    // 간단한 토스트 메시지 (추후 개선 가능)
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--accent-color)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

