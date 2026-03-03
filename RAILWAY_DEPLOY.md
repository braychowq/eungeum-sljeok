# Railway 단일 서비스 배포 가이드 (`은금슬쩍`)

이 문서는 `2026-03-03` 기준으로, 모노레포(`frontend` + `backend`)를 Railway 서비스 1개로 배포하는 절차입니다.

## 1) Git 연결

1. 현재 레포를 GitHub에 push 합니다.
2. [Railway Dashboard](https://railway.com/dashboard)에서 `New Project`를 누릅니다.
3. `Deploy from GitHub repo`를 선택하고 이 레포를 연결합니다.
4. 프로젝트 이름을 `은금슬쩍`으로 설정합니다.

## 2) 단일 서비스 생성/설정

1. 프로젝트 내 서비스 1개(예: `app`)를 생성합니다.
2. 서비스 `Settings`에서 `Root Directory`를 비워두거나 `/`로 둡니다.
3. `Deploy`를 실행합니다.

참고:
- 빌드 설정은 root `railway.toml` 사용
- 이미지 빌드는 root `Dockerfile` 사용
- 헬스체크 경로: `/api/health`

## 3) 내부 동작 방식

1. 컨테이너에서 backend는 `8081`으로 실행됩니다.
2. frontend는 Railway가 주는 `PORT`로 실행됩니다.
3. frontend `/api/*` 요청은 내부 backend로 rewrite 됩니다.
   - `http://127.0.0.1:8081/api/*`

## 4) 배포 검증

1. 헬스체크:
   - `https://<service-domain>/api/health`
   - `status: UP` 응답 확인
2. 앱 접속:
   - `https://<service-domain>/community`

## 5) 운영 시 권장 체크

1. 서비스 로그에서 backend 부팅 완료 여부 확인
2. `/api/health` 실패 시 backend 프로세스 종료 로그 확인
3. 프론트 페이지는 열리는데 API만 실패하면 rewrite 설정(`frontend/next.config.ts`) 확인
