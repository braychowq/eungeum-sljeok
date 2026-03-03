# eungeun-sljeok monorepo starter

Railway 단일 레포에서 FE/BE를 분리 배포하기 위한 기본 구조입니다.

## Stack
- Frontend: Next.js 16 + React 19 + TypeScript
- Backend: Spring Boot 4.0.x (Java 21)
- Container: Docker (서비스별 Dockerfile)

## Folder structure

```text
.
├─ frontend/
│  ├─ app/
│  ├─ Dockerfile
│  └─ railway.toml
├─ backend/
│  ├─ src/
│  ├─ Dockerfile
│  └─ railway.toml
└─ docker-compose.yml
```

## Local run

### Docker compose run

```bash
docker compose up --build
```

`docker compose`가 없는 환경이면:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8080/api/health`

## Railway deploy (single repo, two services)

1. Railway에서 이 레포를 연결합니다.
2. `backend` 서비스 생성:
   - Root Directory: `backend`
   - Dockerfile: `backend/Dockerfile` 또는 root를 backend로 잡으면 `Dockerfile`
3. `frontend` 서비스 생성:
   - Root Directory: `frontend`
   - Dockerfile: `frontend/Dockerfile` 또는 root를 frontend로 잡으면 `Dockerfile`
4. `frontend` 환경변수 설정:
   - `BACKEND_URL=https://<backend-service-domain>`
   - `NEXT_PUBLIC_API_BASE_URL=https://<backend-service-domain>`
5. `backend`는 Railway가 제공하는 `PORT` 환경변수를 자동 사용합니다.

## API
- `GET /api/health`
  - sample response

```json
{
  "status": "UP",
  "service": "backend",
  "timestamp": "2026-03-03T00:00:00Z"
}
```
