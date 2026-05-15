# FROM TEXT TO FEELING

사용자가 입력한 문장을 AI로 분석하여 감성(긍정, 부정, 중립)을 판별해주는 웹 서비스입니다.

## 주요 기능
- **텍스트 분석:** OpenAI API를 사용하여 문장의 감성을 분석합니다.
- **결과 표시:** 감성 결과, 신뢰도(%), 분석 이유를 시각적으로 보여줍니다.
- **기록 저장:** 분석된 결과는 Supabase 데이터베이스에 로그로 저장됩니다.
- **반응형 디자인:** 모바일과 데스크톱 모두에서 최적화된 UI를 제공합니다.

## 프로젝트 구조
```
sentiment-analysis-service/
├─ server/
│  └─ index.js      # Express 백엔드 서버
├─ public/
│  ├─ index.html    # 메인 화면
│  ├─ styles.css    # 디자인 스타일 (Awwwards 컨셉)
│  └─ app.js        # 프론트엔드 로직
├─ docs/            # 프로젝트 가이드 및 지침
├─ .env.example     # 환경변수 예시
└─ package.json     # 의존성 관리
```

## 시작하기

### 1. 환경변수 설정
`.env` 파일을 생성하고 아래 항목들을 입력합니다.
```env
OPENAI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
PORT=3000
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`에 접속하여 확인할 수 있습니다.

## DB 테이블 생성 (Supabase)
Supabase SQL Editor에서 아래 쿼리를 실행하여 테이블을 생성하세요.
```sql
create table sentiment_logs (
  id uuid primary key default gen_random_uuid(),
  input_text text not null,
  sentiment text not null check (sentiment in ('positive', 'negative', 'neutral')),
  confidence integer not null check (confidence >= 0 and confidence <= 100),
  reason text not null,
  created_at timestamptz not null default now()
);
```
