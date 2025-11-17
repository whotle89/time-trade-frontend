# Time Trade Front 프로젝트 분석

## 📊 프로젝트 개요

**Time Trade Front**는 시간 거래 서비스의 프론트엔드 애플리케이션입니다.

## 🛠️ 기술 스택

### Core
- **프레임워크**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Node**: 20+

### 스타일링
- **CSS 프레임워크**: Tailwind CSS v4
- **UI 컴포넌트**: Radix UI (Accordion, Dialog, Dropdown, Select, etc.)
- **유틸리티**: class-variance-authority, clsx, tailwind-merge
- **애니메이션**: Framer Motion 12.23.24
- **반응형 기준**: 1000px (모바일 < 1000px, PC ≥ 1000px)

### 백엔드 & 데이터
- **BaaS**: Supabase (@supabase/supabase-js ^2.81.1)
- **폼 관리**: React Hook Form ^7.66.0
- **폼 검증**: Zod ^4.1.12
- **폼 리졸버**: @hookform/resolvers ^5.2.2

### UI/UX 라이브러리
- **아이콘**: Lucide React ^0.553.0
- **날짜 선택**: react-day-picker ^9.11.1
- **날짜 유틸**: date-fns ^4.1.0
- **캐러셀**: embla-carousel-react ^8.6.0
- **차트**: Recharts ^2.15.4
- **토스트**: Sonner ^2.0.7
- **커맨드 팔레트**: cmdk ^1.1.1
- **패널**: react-resizable-panels ^3.0.6
- **드로어**: vaul ^1.1.2

## 📁 프로젝트 구조

```
time_trade_front/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 홈페이지
│   ├── login/                    # 로그인 페이지
│   │   └── page.tsx
│   └── slots/                    # 슬롯 관련 페이지
│       ├── page.tsx              # 슬롯 목록
│       └── create/               # 슬롯 생성
│           └── page.tsx
├── components/
│   ├── common/                   # 공통 컴포넌트
│   │   ├── banner-carousel.tsx  # 배너 캐러셀
│   │   ├── BottomNav.tsx        # 하단 네비게이션
│   │   ├── floating-button.tsx  # 플로팅 버튼
│   │   ├── header.tsx           # 헤더
│   │   ├── HomeHeader.tsx       # 홈 헤더
│   │   ├── menu-card.tsx        # 메뉴 카드
│   │   └── slot-card.tsx        # 슬롯 카드
│   ├── home/                     # 홈 관련 컴포넌트
│   │   ├── FloatingAddButton.tsx # 추가 플로팅 버튼
│   │   └── TodayReminders.tsx   # 오늘의 리마인더
│   └── ui/                       # Radix UI 기반 재사용 컴포넌트
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       └── ... (기타 UI 컴포넌트들)
├── lib/                          # 유틸리티 함수 & 설정
├── public/                       # 정적 파일
├── .env.local                    # 환경 변수 (Supabase 키 등)
├── components.json               # ShadcN UI 설정
├── next.config.ts               # Next.js 설정
├── tailwind.config.ts           # Tailwind 설정
└── tsconfig.json                # TypeScript 설정
```

## 🎯 주요 기능

### 1. 인증 시스템
- **로그인**: `/login` 페이지
- **백엔드**: Supabase Authentication

### 2. 슬롯 관리
- **슬롯 목록**: `/slots` - 등록된 슬롯 조회
- **슬롯 생성**: `/slots/create` - 새로운 슬롯 등록
- **슬롯 카드**: 슬롯 정보 표시 컴포넌트

### 3. 홈 화면
- **배너 캐러셀**: 메인 배너 표시
- **오늘의 리마인더**: 오늘 해야 할 일 표시
- **플로팅 추가 버튼**: 빠른 액션 버튼
- **하단 네비게이션**: 주요 메뉴 탐색

### 4. UI 컴포넌트 시스템
- **ShadcN UI 패턴**: Radix UI + Tailwind CSS 조합
- **재사용 가능한 컴포넌트**: 일관된 디자인 시스템

## ⚙️ 설정 및 구성

### TypeScript 설정
- **타겟**: ES2017
- **엄격 모드**: 활성화
- **경로 별칭**: `@/*` → 프로젝트 루트
- **JSX**: react-jsx

### Next.js 설정
- **App Router**: 사용
- **기본 설정**: 최소 구성

### 환경 변수
- `.env.local` 파일에 Supabase 관련 키 저장

## 📜 스크립트

```bash
npm run dev    # 개발 서버 실행 (localhost:3000)
npm run build  # 프로덕션 빌드
npm start      # 프로덕션 서버 실행
npm run lint   # ESLint 실행
```

## 🔑 주요 특징

1. **모던 스택**: Next.js 16 + React 19 최신 버전 사용
2. **타입 안전성**: TypeScript strict 모드
3. **컴포넌트 기반**: Radix UI를 활용한 접근성 높은 UI
4. **백엔드 통합**: Supabase로 간편한 인증/DB 관리
5. **반응형 디자인**: Tailwind CSS 기반
6. **폼 관리**: React Hook Form + Zod로 강력한 폼 검증

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📝 개발 가이드

### 새 페이지 추가
- `app/` 디렉토리에 폴더 생성 후 `page.tsx` 추가

### 새 컴포넌트 추가
- 공통 컴포넌트: `components/common/`
- 페이지별 컴포넌트: `components/[페이지명]/`
- UI 컴포넌트: `components/ui/` (ShadcN)

### Supabase 사용
- `lib/` 디렉토리에서 Supabase 클라이언트 설정 확인
- `.env.local`에 API 키 설정 필요

## 🎨 디자인 시스템

- **UI 라이브러리**: Radix UI (헤드리스 컴포넌트)
- **스타일링**: Tailwind CSS v4
- **아이콘**: Lucide React
- **애니메이션**: Framer Motion
- **컬러/테마**: Tailwind 설정 참조

## 📱 반응형 디자인

### 브레이크포인트 설정
- **모바일**: `< 1000px`
- **PC**: `≥ 1000px`

Tailwind CSS v4의 커스텀 미디어 쿼리를 사용하여 설정:
```css
/* globals.css */
@custom-media --pc (width >= 1000px);
@custom-media --mobile (width < 1000px);
```

### 반응형 클래스 사용
Tailwind의 `lg:` 접두사를 사용하여 1000px 이상에서 스타일 적용:
```tsx
// 예시: 모바일 2열, PC 4열 그리드
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {/* ... */}
</div>

// 예시: PC에서 숨김
<nav className="lg:hidden">
  {/* 모바일 전용 네비게이션 */}
</nav>
```

### 주요 반응형 컴포넌트

#### 1. ResponsiveContainer
모바일과 PC 화면에서 콘텐츠의 최대 너비를 제어하는 컨테이너:
- **모바일**: 전체 너비 사용
- **PC**: 최대 1000px, 중앙 정렬

```tsx
import { ResponsiveContainer } from "@/components/common/ResponsiveContainer"

<ResponsiveContainer>
  <main>{children}</main>
</ResponsiveContainer>
```

#### 2. BottomNav
하단 네비게이션 바:
- **모바일**: 고정 표시 (`fixed bottom-0`)
- **PC**: 숨김 (`lg:hidden`)

#### 3. FloatingHeader
상단 헤더:
- **모바일**: 전체 너비
- **PC**: 최대 1000px, 중앙 정렬

#### 4. FloatingAddButton
플로팅 액션 버튼:
- **모바일**: `bottom-24` (하단 네비 위)
- **PC**: `bottom-10` (하단 네비 없음)

### 레이아웃 구조

```
┌─────────────────────────────────┐
│      FloatingHeader (헤더)       │
├─────────────────────────────────┤
│                                 │
│   ResponsiveContainer           │
│   ├─ 모바일: 100% width         │
│   └─ PC: max-width 1000px       │
│                                 │
├─────────────────────────────────┤
│   BottomNav (모바일만 표시)      │
└─────────────────────────────────┘
```

### 반응형 페이지 예시

**HomePage** ([app/page.tsx](app/page.tsx)):
- 메뉴 카드: 모바일 2열 → PC 4열
- 플로팅 버튼: 위치 조정

**레이아웃** ([app/layout.tsx](app/layout.tsx)):
- PC에서 하단 패딩 감소 (`pb-40 lg:pb-20`)

---

**최종 업데이트**: 2025-11-17
