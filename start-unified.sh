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
