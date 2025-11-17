# 🌐 웹에서 포스트 편집하기 (간단한 방법)

## GitHub 웹 에디터 사용하기

GitHub Pages 블로그는 **GitHub 웹 에디터**를 통해 쉽게 편집할 수 있습니다!

### ✨ 새 포스트 작성하기

1. **블로그 저장소 열기**
   - `https://github.com/lebronisbest/lebronisbest.github.io` 접속
   - 또는 블로그 헤더의 "✏️ 편집" 링크 클릭

2. **`_posts` 폴더로 이동**
   - 저장소에서 `_posts` 폴더 클릭

3. **새 파일 생성**
   - "Add file" 버튼 클릭 → "Create new file" 선택
   - 파일명 입력: `2024-01-20-제목.md` (날짜-제목 형식)

4. **포스트 작성**
   ```markdown
   ---
   layout: post
   title: "포스트 제목"
   date: 2024-01-20
   categories: [카테고리]
   author: lebronisbest
   ---

   여기에 본문을 Markdown 형식으로 작성하세요.

   ## 소제목

   - 리스트 항목
   - 리스트 항목

   **굵게**, *기울임*, `코드` 등 사용 가능!
   ```

5. **저장하기**
   - 하단의 "Commit new file" 클릭
   - "Commit directly to the main branch" 선택
   - "Commit new file" 버튼 클릭

6. **자동 배포**
   - 몇 분 후 자동으로 블로그에 반영됩니다! 🎉

### 📝 기존 포스트 수정하기

1. 저장소에서 수정할 파일 클릭
2. 연필 아이콘(✏️) 클릭
3. 내용 수정
4. "Commit changes" 클릭

### 💡 팁

- **미리보기**: GitHub에서 Markdown 미리보기 가능
- **이미지 추가**: `assets/images/` 폴더에 이미지 업로드 후 참조
- **자동 저장**: 커밋하면 자동으로 GitHub Pages에 배포됨

### 🎯 빠른 링크

- **저장소**: https://github.com/lebronisbest/lebronisbest.github.io
- **포스트 폴더**: https://github.com/lebronisbest/lebronisbest.github.io/tree/main/_posts
- **새 포스트 작성**: https://github.com/lebronisbest/lebronisbest.github.io/new/main/_posts

---

**참고**: GitHub Pages는 커밋 후 약 1-5분 내에 자동으로 업데이트됩니다.

