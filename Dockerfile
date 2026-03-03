# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS frontend-build
WORKDIR /workspace/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
ENV BACKEND_INTERNAL_URL=http://127.0.0.1:8081
RUN npm run build

FROM maven:3.9.11-eclipse-temurin-21 AS backend-build
WORKDIR /workspace/backend
COPY backend/pom.xml ./
COPY backend/mvnw ./
COPY backend/.mvn ./.mvn
COPY backend/src ./src
RUN chmod +x mvnw
RUN ./mvnw -B -DskipTests package

FROM node:22-bookworm-slim AS node-runtime

FROM eclipse-temurin:21-jre
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV BACKEND_PORT=8081

COPY --from=node-runtime /usr/local/ /usr/local/
COPY --from=frontend-build /workspace/frontend/.next/standalone /app/frontend
COPY --from=frontend-build /workspace/frontend/.next/static /app/frontend/.next/static
COPY --from=frontend-build /workspace/frontend/public /app/frontend/public
COPY --from=backend-build /workspace/backend/target/backend-0.0.1-SNAPSHOT.jar /app/backend/app.jar
COPY start-unified.sh /app/start-unified.sh

RUN chmod +x /app/start-unified.sh

EXPOSE 3000
CMD ["/app/start-unified.sh"]
