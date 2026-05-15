# 04_backend_api.md — 백엔드 API 구현 지침

## 1. 사용 파일
```txt
server/index.js
```

## 2. 서버 기술
- Node.js
- Express
- dotenv
- OpenAI Node SDK
- Supabase JS SDK

## 3. API 엔드포인트
### POST `/api/analyze`
사용자가 보낸 텍스트를 감성 분석한다.

요청 예시:
```json
{
  "text": "오늘 서비스가 정말 만족스러웠어요."
}
```

응답 예시:
```json
{
  "sentiment": "positive",
  "confidence": 92,
  "reason": "만족스럽다는 긍정 표현이 포함되어 있습니다."
}
```

## 4. 서버 검증 규칙
- `text`가 없으면 400 응답
- `text`가 문자열이 아니면 400 응답
- `text.trim()`이 빈 문자열이면 400 응답
- 너무 긴 입력은 제한한다. 권장 최대 길이: 1000자

## 5. OpenAI 응답 형식
OpenAI 응답은 서버에서 아래 구조로 정규화한다.

```json
{
  "sentiment": "positive | negative | neutral",
  "confidence": 0,
  "reason": "string"
}
```

OpenAI API는 Responses API를 사용하고, 가능하면 JSON Schema 기반의 구조화된 출력을 사용한다. 구조화된 출력은 모델 응답을 지정한 스키마에 맞추는 데 도움이 된다.

## 6. 프롬프트 요구사항
시스템 지시문에는 아래 내용을 포함한다.

```txt
너는 한국어 텍스트 감성 분석기다.
사용자 텍스트를 positive, negative, neutral 중 하나로 분류한다.
confidence는 0부터 100 사이의 정수로 작성한다.
reason은 한국어로 한 문장만 작성한다.
과장하지 말고 텍스트 근거만 사용한다.
```

## 7. 오류 응답 형식
```json
{
  "error": "분석 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
}
```

## 8. 완료 기준
- `/api/analyze`가 정상 응답한다.
- 잘못된 요청에 400 응답을 보낸다.
- OpenAI 오류 발생 시 500 응답을 보낸다.
- API Key가 없을 때 서버 시작 또는 요청 단계에서 명확한 오류를 출력한다.
