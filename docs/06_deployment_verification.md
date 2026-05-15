# 06_deployment_verification.md — 배포 및 검증 지침

## 1. 배포 대상
Vercel에 배포한다.

## 2. 배포 전 준비
- GitHub 저장소 생성
- 프로젝트 코드 업로드
- Vercel 프로젝트 연결
- 환경변수 등록

## 3. Vercel 환경변수
Vercel Dashboard의 Project Settings → Environment Variables에 아래 값을 등록한다.

```env
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 4. 배포 후 검증 체크리스트
| 항목 | 확인 방법 | 통과 기준 |
|---|---|---|
| 메인 화면 | 배포 URL 접속 | 화면이 정상 표시됨 |
| 입력 검증 | 빈 값으로 분석 클릭 | 오류 메시지 표시 |
| 정상 분석 | 긍정 문장 입력 | 긍정 결과 표시 |
| 부정 분석 | 불만 문장 입력 | 부정 결과 표시 |
| 중립 분석 | 사실 문장 입력 | 중립 결과 표시 |
| DB 저장 | Supabase 테이블 확인 | 로그 row 생성 |
| 모바일 화면 | 개발자도구 모바일 모드 | 레이아웃 깨짐 없음 |

## 5. 테스트 문장 예시
긍정:
```txt
오늘 서비스가 정말 친절하고 만족스러웠어요.
```

부정:
```txt
응답이 너무 느리고 결과도 마음에 들지 않았어요.
```

중립:
```txt
오늘 오후 3시에 회의가 예정되어 있습니다.
```

## 6. 자주 발생하는 오류
### `supabaseKey is required`
Supabase 환경변수가 비어 있을 때 발생한다.

확인할 값:
```env
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### OpenAI API 오류
확인할 값:
```env
OPENAI_API_KEY
```

### Vercel에서만 동작하지 않는 경우
- Vercel 환경변수 등록 여부 확인
- 배포 후 재배포 여부 확인
- 서버 API 경로가 올바른지 확인

## 7. 최종 완료 기준
- 로컬과 배포 환경 모두에서 분석이 가능하다.
- 오류 상황에서 사용자에게 친절한 메시지가 표시된다.
- 민감한 API Key가 브라우저 코드에 노출되지 않는다.
