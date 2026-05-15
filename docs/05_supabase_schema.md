# 05_supabase_schema.md — Supabase DB 설계 지침

## 1. DB 사용 목적
사용자가 입력한 텍스트와 감성 분석 결과를 저장한다. 저장된 데이터는 추후 분석 기록, 통계, 관리자 기능에 활용할 수 있다.

## 2. 테이블명
```txt
sentiment_logs
```

## 3. 컬럼 설계
| 컬럼명 | 타입 | 설명 |
|---|---|---|
| id | uuid | 기본키 |
| input_text | text | 사용자가 입력한 원문 |
| sentiment | text | positive / negative / neutral |
| confidence | integer | 0~100 신뢰도 |
| reason | text | 분석 이유 |
| created_at | timestamptz | 생성 시간 |

## 4. SQL 예시
```sql
create table if not exists sentiment_logs (
  id uuid primary key default gen_random_uuid(),
  input_text text not null,
  sentiment text not null check (sentiment in ('positive', 'negative', 'neutral')),
  confidence integer not null check (confidence >= 0 and confidence <= 100),
  reason text not null,
  created_at timestamptz not null default now()
);
```

## 5. 저장 시점
OpenAI 분석이 성공한 뒤 Supabase에 저장한다.

```txt
사용자 요청
↓
OpenAI 분석 성공
↓
응답 데이터 정규화
↓
Supabase 저장
↓
프론트엔드에 결과 반환
```

## 6. 저장 실패 처리
Supabase 저장 실패는 사용자 분석 결과 표시를 막지 않는다.

- OpenAI 분석 성공: 사용자에게 결과 표시
- Supabase 저장 실패: 서버 콘솔에만 기록
- 프론트엔드에는 일반 결과를 반환

## 7. 보안 규칙
- `SUPABASE_SERVICE_ROLE_KEY`는 서버에서만 사용한다.
- 프론트엔드에는 절대 노출하지 않는다.
- 공개 조회 기능이 없는 초기 버전에서는 RLS 정책을 보수적으로 설정한다.

## 8. 완료 기준
- 테이블 생성 SQL이 Supabase SQL Editor에서 실행된다.
- 분석 성공 시 row가 1개 생성된다.
- sentiment 값은 3가지 중 하나만 저장된다.
- confidence는 0~100 사이로 저장된다.
