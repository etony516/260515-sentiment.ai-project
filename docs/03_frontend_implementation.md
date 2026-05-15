# 03_frontend_implementation.md — 프론트엔드 구현 지침

## 1. 사용 파일
```txt
public/index.html
public/styles.css
public/app.js
```

## 2. HTML 요구사항
`index.html`에는 아래 요소가 있어야 한다.

- 헤더 영역
- 큰 제목 영역
- 텍스트 입력 textarea
- 분석하기 버튼
- 로딩 메시지 영역
- 결과 표시 영역
- 오류 메시지 영역

## 3. JavaScript 동작 흐름
```txt
사용자가 텍스트 입력
↓
분석하기 버튼 클릭
↓
입력값 trim 처리
↓
빈 값이면 오류 표시
↓
/api/analyze 로 POST 요청
↓
로딩 상태 표시
↓
응답 성공 시 결과 표시
↓
응답 실패 시 오류 표시
```

## 4. API 요청 예시
```js
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ text })
});
```

## 5. 프론트엔드 표시 규칙
서버 응답은 아래 형태를 기대한다.

```json
{
  "sentiment": "positive",
  "confidence": 87,
  "reason": "문장에 긍정적인 표현이 많습니다."
}
```

화면 표시 변환:

| 서버값 | 화면 표시 |
|---|---|
| positive | 긍정 |
| negative | 부정 |
| neutral | 중립 |

## 6. 오류 처리
아래 상황에서 오류 메시지를 표시한다.

- 입력값이 비어 있음
- 서버 응답 실패
- 네트워크 오류
- 응답 JSON 형식 오류
- 감성 값이 예상 범위를 벗어남

## 7. 완료 기준
- 버튼 클릭 시 중복 요청을 막는다.
- 로딩 중에는 버튼 텍스트를 `분석 중...`으로 바꾼다.
- 결과가 없을 때 빈 카드가 보이지 않게 한다.
- 오류 발생 시 이전 결과를 숨긴다.
