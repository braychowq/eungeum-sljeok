#!/usr/bin/env bash
set -euo pipefail

java -Dserver.port="${BACKEND_PORT:-8081}" -jar /app/backend/app.jar &
backend_pid=$!

cd /app/frontend
PORT="${PORT:-3000}" HOSTNAME="${HOSTNAME:-0.0.0.0}" node server.js &
frontend_pid=$!

cleanup() {
  kill "$backend_pid" "$frontend_pid" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

wait -n "$backend_pid" "$frontend_pid"
