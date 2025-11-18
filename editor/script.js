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
const richEditor = document.getElementById('richEditor');
const preview = document.getElementById('preview');
const imageModal = document.getElementById('imageModal');
const imageInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const imageNameInput = document.getElementById('imageNameInput');
const confirmUpload = document.getElementById('confirmUpload');
const cancelUpload = document.getElementById('cancelUpload');
const oauthLoginBtn = document.getElementById('oauthLoginBtn');
const setupOAuthLink = document.getElementById('setupOAuthLink');
const oauthSetupModal = document.getElementById('oauthSetupModal');
const closeOAuthSetup = document.getElementById('closeOAuthSetup');
const cancelOAuthSetup = document.getElementById('cancelOAuthSetup');
const saveClientId = document.getElementById('saveClientId');
const clientIdInput = document.getElementById('clientIdInput');
const homepageUrl = document.getElementById('homepageUrl');
const callbackUrl = document.getElementById('callbackUrl');

// OAuth 설정
let oauthClientId = null;

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
    
    // 저장된 Client ID 확인
    const savedClientId = localStorage.getItem('github_oauth_client_id');
    if (savedClientId) {
        oauthClientId = savedClientId;
        clientIdInput.value = savedClientId;
    }
    
    // OAuth callback 처리
    handleOAuthCallback();
    
    // URL 설정
    const currentUrl = window.location.origin + window.location.pathname;
    homepageUrl.textContent = currentUrl;
    callbackUrl.textContent = currentUrl;

    // 이벤트 리스너 설정
    setupEventListeners();
    setupRichEditor();
    setupToolbar();
    setupImageUpload();
    setupOAuth();
    
    // 오늘 날짜로 기본 설정
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

// OAuth 설정
function setupOAuth() {
    oauthLoginBtn.addEventListener('click', handleOAuthLogin);
    setupOAuthLink.addEventListener('click', (e) => {
        e.preventDefault();
        showOAuthSetupModal();
    });
    closeOAuthSetup.addEventListener('click', closeOAuthSetupModal);
    cancelOAuthSetup.addEventListener('click', closeOAuthSetupModal);
    saveClientId.addEventListener('click', saveOAuthClientId);
    
    oauthSetupModal.addEventListener('click', (e) => {
        if (e.target === oauthSetupModal) {
            closeOAuthSetupModal();
        }
    });
}

// OAuth 로그인 처리 (Device Flow 사용)
async function handleOAuthLogin() {
    if (!oauthClientId) {
        showOAuthSetupModal();
        return;
    }
    
    try {
        oauthLoginBtn.disabled = true;
        oauthLoginBtn.textContent = '인증 중...';
        
        // Device Flow 시작
        const deviceCodeResponse = await fetch('https://github.com/login/device/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: oauthClientId,
                scope: 'repo',
            }),
        });
        
        if (!deviceCodeResponse.ok) {
            throw new Error('Device code 요청 실패');
        }
        
        const deviceData = await deviceCodeResponse.json();
        const { device_code, user_code, verification_uri, expires_in, interval } = deviceData;
        
        // 사용자에게 인증 정보 표시
        showDeviceAuthModal(user_code, verification_uri, device_code, interval);
        
    } catch (error) {
        console.error('OAuth 로그인 실패:', error);
        alert('로그인 실패: ' + error.message);
        oauthLoginBtn.disabled = false;
        oauthLoginBtn.textContent = 'GitHub로 로그인';
    }
}

// Device Auth Modal 표시 및 폴링
function showDeviceAuthModal(userCode, verificationUri, deviceCode, interval) {
    // Modal 생성
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>GitHub 로그인</h3>
            </div>
            <div class="modal-body" style="text-align: center;">
                <p style="margin-bottom: 1.5rem;">아래 코드를 입력하고 GitHub에서 인증해주세요:</p>
                <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <div style="font-size: 2rem; font-weight: 600; letter-spacing: 0.5rem; color: var(--accent-color);">
                        ${userCode.match(/.{1,3}/g).join('-')}
                    </div>
                </div>
                <p style="margin-bottom: 1.5rem;">
                    <a href="${verificationUri}" target="_blank" class="btn btn-primary" style="display: inline-block;">
                        GitHub에서 인증하기
                    </a>
                </p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    새 창에서 인증을 완료하면 자동으로 로그인됩니다.
                </p>
                <div id="authStatus" style="margin-top: 1rem; color: var(--text-secondary);"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelDeviceAuth">취소</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const cancelBtn = modal.querySelector('#cancelDeviceAuth');
    const statusDiv = modal.querySelector('#authStatus');
    
    // 토큰 폴링 함수
    let currentInterval = interval * 1000;
    let pollInterval = null;
    
    cancelBtn.addEventListener('click', () => {
        if (pollInterval) clearInterval(pollInterval);
        modal.remove();
        oauthLoginBtn.disabled = false;
        oauthLoginBtn.textContent = 'GitHub로 로그인';
    });
    
    const pollForToken = async () => {
        try {
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    client_id: oauthClientId,
                    device_code: deviceCode,
                    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                }),
            });
            
            const tokenData = await tokenResponse.json();
            
            if (tokenData.access_token) {
                // 성공!
                if (pollInterval) clearInterval(pollInterval);
                githubToken = tokenData.access_token;
                localStorage.setItem('github_token', githubToken);
                modal.remove();
                showEditor();
                loadPosts();
                showMessage('로그인 성공!', 'success');
                oauthLoginBtn.disabled = false;
                oauthLoginBtn.textContent = 'GitHub로 로그인';
            } else if (tokenData.error === 'authorization_pending') {
                statusDiv.textContent = '인증 대기 중...';
            } else if (tokenData.error === 'slow_down') {
                // 폴링 간격 늘리기
                currentInterval = currentInterval * 2;
                if (pollInterval) clearInterval(pollInterval);
                pollInterval = setInterval(pollForToken, currentInterval);
                statusDiv.textContent = '인증 대기 중...';
            } else if (tokenData.error === 'expired_token') {
                if (pollInterval) clearInterval(pollInterval);
                statusDiv.innerHTML = '<span style="color: var(--danger);">인증 시간이 만료되었습니다. 다시 시도해주세요.</span>';
            } else if (tokenData.error) {
                if (pollInterval) clearInterval(pollInterval);
                statusDiv.innerHTML = `<span style="color: var(--danger);">오류: ${tokenData.error_description || tokenData.error}</span>`;
            }
        } catch (error) {
            console.error('토큰 폴링 실패:', error);
        }
    };
    
    // 토큰 폴링 시작
    pollInterval = setInterval(pollForToken, currentInterval);
    
    // 만료 시간 후 자동 정리
    setTimeout(() => {
        if (pollInterval) {
            clearInterval(pollInterval);
            if (modal.parentNode) {
                modal.remove();
                oauthLoginBtn.disabled = false;
                oauthLoginBtn.textContent = 'GitHub로 로그인';
            }
        }
    }, 10 * 60 * 1000); // 10분
}

// OAuth Callback 처리 (Device Flow 사용 시 불필요하지만 호환성을 위해 유지)
function handleOAuthCallback() {
    // Device Flow를 사용하므로 callback 처리는 필요 없음
    // URL 파라미터 정리만 수행
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') || urlParams.has('state')) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// OAuth Setup Modal 표시
function showOAuthSetupModal() {
    oauthSetupModal.classList.add('active');
    if (oauthClientId) {
        clientIdInput.value = oauthClientId;
    }
}

// OAuth Setup Modal 닫기
function closeOAuthSetupModal() {
    oauthSetupModal.classList.remove('active');
}

// OAuth Client ID 저장
function saveOAuthClientId() {
    const clientId = clientIdInput.value.trim();
    if (!clientId) {
        alert('Client ID를 입력해주세요.');
        return;
    }
    
    oauthClientId = clientId;
    localStorage.setItem('github_oauth_client_id', clientId);
    closeOAuthSetupModal();
    showMessage('Client ID가 저장되었습니다.', 'success');
}

// 랜덤 문자열 생성
function generateRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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
    
    // 리치 에디터 변경 시
    if (richEditor) {
        richEditor.addEventListener('input', () => {
            if (currentPost) {
                currentPost.hasChanges = true;
            }
            // HTML을 마크다운으로 변환하여 저장
            convertHtmlToMarkdown();
        });
        
        richEditor.addEventListener('paste', handlePaste);
    }
    
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

// 리치 에디터 설정
function setupRichEditor() {
    if (!richEditor) return;
    
    // 키보드 단축키
    richEditor.addEventListener('keydown', (e) => {
        // Ctrl+B: 굵게
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            document.execCommand('bold', false, null);
        }
        // Ctrl+I: 기울임
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            document.execCommand('italic', false, null);
        }
        // Ctrl+U: 밑줄
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            document.execCommand('underline', false, null);
        }
        // Ctrl+K: 링크
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            insertLink();
        }
        // Enter 시 <p> 태그 유지
        if (e.key === 'Enter' && !e.shiftKey) {
            setTimeout(() => {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const p = document.createElement('p');
                    p.innerHTML = '<br>';
                    range.insertNode(p);
                    range.setStartAfter(p);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }, 0);
        }
    });
    
    // 포커스 시 빈 상태면 <p> 태그 추가
    richEditor.addEventListener('focus', () => {
        if (richEditor.innerHTML.trim() === '' || richEditor.innerHTML === '<br>') {
            richEditor.innerHTML = '<p><br></p>';
        }
    });
}

// 툴바 설정
function setupToolbar() {
    const toolBtns = document.querySelectorAll('.tool-btn');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const command = btn.dataset.command;
            const value = btn.dataset.value;
            const action = btn.dataset.action;
            
            if (action === 'image') {
                showImageModal();
            } else if (command === 'createLink') {
                insertLink();
            } else if (command) {
                document.execCommand(command, false, value || null);
                richEditor.focus();
            }
        });
    });
}

// HTML을 마크다운으로 변환
function convertHtmlToMarkdown() {
    if (!richEditor) return;
    
    try {
        // TurndownService가 로드되었는지 확인
        if (typeof TurndownService === 'undefined') {
            console.warn('TurndownService가 로드되지 않았습니다. 간단한 변환을 사용합니다.');
            // 간단한 변환
            let html = richEditor.innerHTML;
            html = html.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
            html = html.replace(/<b>(.*?)<\/b>/gi, '**$1**');
            html = html.replace(/<em>(.*?)<\/em>/gi, '*$1*');
            html = html.replace(/<i>(.*?)<\/i>/gi, '*$1*');
            html = html.replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>');
            html = html.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
            html = html.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
            html = html.replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n');
            html = html.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
            html = html.replace(/<br\s*\/?>/gi, '\n');
            html = html.replace(/<ul>(.*?)<\/ul>/gis, '$1');
            html = html.replace(/<ol>(.*?)<\/ol>/gis, '$1');
            html = html.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
            html = html.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
            html = html.replace(/<img[^>]*src="(.*?)"[^>]*alt="(.*?)"[^>]*>/gi, '![$2]($1)');
            html = html.replace(/<img[^>]*src="(.*?)"[^>]*>/gi, '![]($1)');
            html = html.replace(/<[^>]+>/g, '');
            markdownEditor.value = html.trim();
            return;
        }
        
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            bulletListMarker: '-',
            emDelimiter: '*',
            strongDelimiter: '**'
        });
        
        // 이미지 처리
        turndownService.addRule('image', {
            filter: 'img',
            replacement: function(content, node) {
                const alt = node.getAttribute('alt') || '';
                const src = node.getAttribute('src') || '';
                return `![${alt}](${src})`;
            }
        });
        
        const html = richEditor.innerHTML;
        const markdown = turndownService.turndown(html);
        markdownEditor.value = markdown;
    } catch (error) {
        console.error('마크다운 변환 실패:', error);
    }
}

// 마크다운을 HTML로 변환
function convertMarkdownToHtml(markdown) {
    if (!richEditor || typeof marked === 'undefined') return;
    
    try {
        const html = marked.parse(markdown);
        richEditor.innerHTML = html;
    } catch (error) {
        console.error('HTML 변환 실패:', error);
        richEditor.innerHTML = markdown.replace(/\n/g, '<br>');
    }
}

// 붙여넣기 처리
function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    const html = (e.clipboardData || window.clipboardData).getData('text/html');
    
    if (html) {
        // HTML이 있으면 정리하여 삽입
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 스타일 제거
        const cleanHtml = tempDiv.innerText || tempDiv.textContent || '';
        document.execCommand('insertText', false, cleanHtml);
    } else {
        // 텍스트만 있으면 그대로 삽입
        document.execCommand('insertText', false, text);
    }
}

// 링크 삽입
function insertLink() {
    const url = prompt('링크 URL을 입력하세요:', 'https://');
    if (url) {
        const linkText = window.getSelection().toString() || '링크 텍스트';
        document.execCommand('createLink', false, url);
        
        // 링크 텍스트 설정
        setTimeout(() => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const link = range.commonAncestorContainer.parentElement;
                if (link.tagName === 'A' && linkText !== '링크 텍스트') {
                    link.textContent = linkText;
                }
            }
        }, 0);
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
        
        // 리치 에디터에 이미지 삽입
        const img = document.createElement('img');
        img.src = `/assets/img/${fullFileName}`;
        img.alt = fileName;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.style.margin = '2rem 0';
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.setStartAfter(img);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            richEditor.appendChild(img);
        }
        
        richEditor.focus();
        
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
        
        // 마크다운을 HTML로 변환하여 리치 에디터에 표시
        markdownEditor.value = body;
        convertMarkdownToHtml(body);
        
        currentPost = {
            ...post,
            frontMatter,
            body,
            hasChanges: false,
        };
        
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
    if (richEditor) {
        richEditor.innerHTML = '<p><br></p>';
    }
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
        
        // HTML을 마크다운으로 변환
        convertHtmlToMarkdown();
        
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

