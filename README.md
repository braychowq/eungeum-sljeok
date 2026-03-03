# eungeum-sljeok monorepo (single-app deploy)

하나의 Railway 서비스에서 Next.js(frontend) + Spring Boot(backend)를 함께 실행하는 구조입니다.

## Stack
- Frontend: Next.js 16 + React 19 + TypeScript
- Backend: Spring Boot 4.0.x (Java 21)
- Deploy: Single Docker image (root `Dockerfile`)

## Folder structure

```text
.
├─ backend/
├─ frontend/
├─ Dockerfile
├─ railway.toml
├─ start-unified.sh
└─ docker-compose.yml
```

## Runtime architecture
- 컨테이너 내부에서 backend는 `8081` 포트로 실행됩니다.
- frontend(Next standalone)는 Railway `PORT`(기본 `3000`)로 실행됩니다.
- frontend의 `/api/*`는 내부 `http://127.0.0.1:8081/api/*`로 rewrite 됩니다.

## Local run

```bash
docker compose up --build
```

- App: `http://localhost:3000/community`
- Health: `http://localhost:3000/api/health` (backend로 프록시됨)

## Railway deploy (single service)
- 이 레포를 Railway에 연결하고 서비스 1개만 생성합니다.
- Root Directory는 `/`(기본값) 사용.
- root `railway.toml` + root `Dockerfile`이 자동 사용됩니다.

상세 절차는 [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)를 참고하세요.
