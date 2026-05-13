# Portfolio Website

원페이지 포트폴리오 사이트 프로젝트

## 🛠 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS 4
- **애니메이션**: Framer Motion
- **아이콘**: Lucide React
- **스크린샷**: Playwright

## 📁 프로젝트 구조

```
portfolio/
├── public/
│   └── images/
│       └── projects/        # 프로젝트 썸네일 이미지
├── scripts/
│   └── capture-screenshots.ts  # Playwright 캡처 스크립트
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ProjectCard.tsx    # 프로젝트 카드 컴포넌트
│   │   └── ProjectModal.tsx   # 프로젝트 상세보기 모달
│   ├── data/
│   │   ├── projects.ts        # 프로젝트 데이터
│   │   └── contact.ts         # 연락처 및 기술 스택 데이터
│   └── types/
│       └── project.ts         # TypeScript 타입 정의
└── package.json
```

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 📸 스크린샷 캡처

Playwright를 사용해서 운영 중인 사이트의 스크린샷을 자동으로 캡처할 수 있습니다.

### 모든 프로젝트 캡처 (demoUrl이 있는 프로젝트만)

```bash
npm run capture
```

### 특정 URL 캡처

```bash
npm run capture <URL> <파일명>
```

예시:
```bash
npm run capture https://example.com example-screenshot.png
```

캡처된 이미지는 `public/images/projects/` 폴더에 저장됩니다.

## ✏️ 콘텐츠 수정

### 프로젝트 정보 수정

`src/data/projects.ts` 파일에서 프로젝트 정보를 수정할 수 있습니다.

```typescript
export const projects: Project[] = [
  {
    id: '01',
    title: '프로젝트 제목',
    description: '프로젝트 설명',
    thumbnail: '/images/projects/thumbnail.png',
    images: ['/images/projects/image1.png'],
    tags: ['#React', '#TypeScript'],
    techStack: ['React', 'TypeScript'],
    duration: '2024.01 - 2024.03',
    role: 'Frontend Developer',
    detailDescription: '상세 설명',
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/username/repo',
  },
  // ...
];
```

### 연락처 정보 수정

`src/data/contact.ts` 파일에서 연락처 정보를 수정할 수 있습니다.

```typescript
export const contactInfo: ContactInfo = {
  email: 'ponykit@gmail.com',
  phone: '010-1234-5678',
  instagram: '@yourname_official',
  github: 'github.com/yourname',
};
```

### 기술 스택 수정

`src/data/contact.ts` 파일에서 기술 스택을 수정할 수 있습니다.

```typescript
export const techStack = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  // ...
];
```

### 개인 정보 수정

`src/app/page.tsx` 파일에서 이름, 직함, 소개 등을 수정할 수 있습니다.

## 🎨 디자인 커스터마이징

### 색상 변경

Tailwind CSS를 사용하므로 컴포넌트에서 직접 클래스를 수정하거나, `tailwind.config.ts` 파일에서 커스텀 색상을 추가할 수 있습니다.

현재 사용 중인 주요 색상:
- Primary: `purple-500`, `purple-600`
- Background: `gray-900`, `gray-800`
- Text: `white`, `gray-300`, `gray-400`

### 애니메이션 조정

Framer Motion을 사용하므로 각 컴포넌트에서 애니메이션을 수정할 수 있습니다.

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* 콘텐츠 */}
</motion.div>
```

## 📝 라이센스

이 프로젝트는 개인 포트폴리오 용도로 제작되었습니다.

## 👤 제작자

Your Name - [ponykit@gmail.com](mailto:ponykit@gmail.com)
