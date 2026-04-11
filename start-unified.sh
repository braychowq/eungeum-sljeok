#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -f /app/backend/app.jar ]; then
  BACKEND_JAR="/app/backend/app.jar"
  FRONTEND_DIR="/app/frontend"
  FRONTEND_MODE="standalone"
else
  BACKEND_JAR="$ROOT_DIR/backend/target/backend-0.0.1-SNAPSHOT.jar"
  FRONTEND_DIR="$ROOT_DIR/frontend"
  FRONTEND_MODE="dev"
fi

require_env() {
  local name="$1"
  if [ -z "${!name:-}" ]; then
    echo "Missing required environment variable: ${name}" >&2
    exit 1
  fi
}

if [ "$FRONTEND_MODE" = "standalone" ]; then
  export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-production}"

  if [ "$SPRING_PROFILES_ACTIVE" = "production" ]; then
    require_env DB_URL
    require_env DB_USERNAME
    require_env DB_PASSWORD
    require_env AUTH_PUBLIC_BASE_URL
    require_env AUTH_ALLOWED_ORIGINS

    if [[ "${AUTH_PUBLIC_BASE_URL}" == http://localhost* ]] || [[ "${AUTH_PUBLIC_BASE_URL}" == http://127.0.0.1* ]]; then
      echo "AUTH_PUBLIC_BASE_URL must point to the public production domain." >&2
      exit 1
    fi

    if [ -z "${NAVER_CLIENT_ID:-}" ] && [ -z "${KAKAO_CLIENT_ID:-}" ]; then
      echo "At least one social login provider must be configured for production." >&2
      exit 1
    fi
  fi
else
  export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-local}"
fi

java -Dserver.port="${BACKEND_PORT:-8081}" -jar "$BACKEND_JAR" &
backend_pid=$!

cd "$FRONTEND_DIR"
if [ "$FRONTEND_MODE" = "standalone" ]; then
  PORT="${PORT:-3000}" HOSTNAME="${HOSTNAME:-0.0.0.0}" node server.js &
else
  PORT="${PORT:-3000}" npm run dev -- -H "${HOSTNAME:-0.0.0.0}" -p "${PORT:-3000}" &
fi
frontend_pid=$!

cleanup() {
  kill "$backend_pid" "$frontend_pid" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

exit_code=0
while true; do
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    wait "$backend_pid" || exit_code=$?
    break
  fi

  if ! kill -0 "$frontend_pid" 2>/dev/null; then
    wait "$frontend_pid" || exit_code=$?
    break
  fi

  sleep 1
done

exit "$exit_code"
