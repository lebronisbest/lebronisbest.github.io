# 블로그 포스트 작성 가이드

## 📝 포스트 작성 방법

### 1. 파일 생성
`_posts/` 디렉터리에 다음 형식으로 파일을 생성하세요:

**파일명 형식:** `YYYY-MM-DD-제목.md`

예시:
- `2024-01-15-javascript-tips.md`
- `2024-02-20-react-hooks.md`
- `2024-03-10-daily-life.md`

### 2. Front Matter 작성
파일 맨 위에 다음 형식의 메타데이터를 작성하세요:

```yaml
---
layout: post
title: "포스트 제목"
date: 2024-01-15
categories: [카테고리명]
author: lebronisbest
---
```

**Front Matter 설명:**
- `layout: post` - 포스트 레이아웃 사용 (필수)
- `title` - 포스트 제목 (필수)
- `date` - 작성 날짜 (YYYY-MM-DD 형식, 필수)
- `categories` - 카테고리 배열 (선택사항)
- `author` - 작성자 (선택사항)

### 3. 본문 작성
Front Matter 아래에 Markdown 형식으로 본문을 작성하세요.

## 📋 예시 포스트

```markdown
---
layout: post
title: "JavaScript 배열 메서드 정리"
date: 2024-01-15
categories: [JavaScript, 개발]
author: lebronisbest
---

JavaScript의 배열 메서드에 대해 정리해보겠습니다.

## map()

배열의 각 요소에 함수를 적용하여 새로운 배열을 반환합니다.

\`\`\`javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8]
\`\`\`

## filter()

조건에 맞는 요소만 필터링합니다.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]
\`\`\`

## 마무리

이렇게 JavaScript 배열 메서드를 활용할 수 있습니다.
```

## 🎨 Markdown 문법

### 제목
```markdown
# 제목 1
## 제목 2
### 제목 3
```

### 강조
```markdown
**굵게**
*기울임*
`코드`
```

### 리스트
```markdown
- 항목 1
- 항목 2
- 항목 3

1. 순서 1
2. 순서 2
3. 순서 3
```

### 코드 블록
````markdown
```javascript
const hello = "world";
console.log(hello);
```
````

### 링크
```markdown
[링크 텍스트](https://example.com)
```

### 이미지
```markdown
![이미지 설명](이미지경로.jpg)
```

### 인용
```markdown
> 인용문 내용
```

### 구분선
```markdown
---
```

## 💡 팁

1. **excerpt 추가하기**: 포스트 목록에 표시될 요약을 추가하려면 Front Matter에 `excerpt: "요약 내용"`을 추가하세요.

2. **카테고리 사용**: 여러 카테고리를 지정할 수 있습니다.
   ```yaml
   categories: [JavaScript, 웹개발, 튜토리얼]
   ```

3. **이미지 사용**: 이미지는 `assets/images/` 디렉터리에 저장하고 다음과 같이 참조하세요:
   ```markdown
   ![설명](/assets/images/example.jpg)
   ```

4. **날짜 형식**: 날짜는 반드시 `YYYY-MM-DD` 형식을 사용해야 합니다.

## 📁 파일 구조 예시

```
_posts/
  ├── 2024-01-01-welcome.md
  ├── 2024-01-15-javascript-tips.md
  ├── 2024-02-20-react-hooks.md
  └── 2024-03-10-daily-life.md
```

## ✅ 체크리스트

포스트 작성 전 확인사항:
- [ ] 파일명이 `YYYY-MM-DD-제목.md` 형식인가?
- [ ] Front Matter가 올바르게 작성되었는가?
- [ ] 날짜 형식이 `YYYY-MM-DD`인가?
- [ ] 제목이 따옴표로 감싸져 있는가?
- [ ] 본문이 Markdown 형식으로 작성되었는가?

이제 멋진 포스트를 작성해보세요! 🚀

