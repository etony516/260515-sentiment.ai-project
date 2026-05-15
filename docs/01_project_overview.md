# 01_project_overview.md — 프로젝트 개요

## 1. 프로젝트 목적
이 프로젝트는 HTML, CSS, JavaScript, Node.js를 이용해 AI 감성 분석 웹 서비스를 만드는 학습용/실습용 프로젝트다.

## 2. 핵심 구현 범위
- 정적 웹 화면 구현
- 텍스트 입력 UI 구현
- Node.js API 서버 구현
- OpenAI API를 이용한 감성 분석
- 결과 카드 표시
- 오류 메시지 표시
- Supabase 분석 기록 저장
- Vercel 배포

## 3. 구현하지 않는 범위
초기 버전에서는 아래 기능을 구현하지 않는다.

- 회원가입 / 로그인
- 관리자 페이지
- 결제 기능
- 다국어 번역 기능
- 파일 업로드 분석
- 대량 CSV 분석
- 차트 대시보드

## 4. 기본 실행 명령어
```bash
npm install
npm run dev
```

## 5. 개발 순서
1. 폴더 구조 생성
2. `package.json` 작성
3. 프론트엔드 HTML/CSS/JS 작성
4. Express 서버 작성
5. `/api/analyze` API 구현
6. OpenAI API 연결
7. 오류 처리 구현
8. Supabase 저장 기능 구현
9. Vercel 배포 설정
10. 최종 테스트

## 6. 완료 기준
- 로컬 실행 가능
- 분석 요청 가능
- 결과 표시 가능
- 오류 표시 가능
- 배포 환경변수 설정 가능
