# 은금슬쩍 소셜 로그인 설계

## 1. 선택한 인증 방식

- **방식**: 서버 세션 + HttpOnly 쿠키
- **이유**
  - 은금슬쩍은 브라우저 기반 웹서비스이고, OAuth 콜백도 서버가 직접 받는다.
  - 소셜 로그인 이후 **로그아웃/탈퇴/관리자 정지**를 즉시 반영하기 쉽다.
  - JWT + Refresh Token보다 브라우저 노출면이 작고, 프런트가 토큰 원문을 다룰 필요가 없다.
  - soft delete, 관리자 차단, 세션 강제 만료 같은 운영 기능을 단순하게 유지할 수 있다.

## 2. 핵심 정책

- 이메일 회원가입 없음
- 지원 공급자: **네이버 / 카카오**
- 최초 로그인 시 자동 회원 생성
- `provider + provider_user_id` 기준 유니크 매핑
- 탈퇴는 **soft delete**
- soft delete 사용자는 같은 공급자로 다시 로그인해도 자동 복구하지 않음
- 신규 사용자는 로그인 직후 필요 시 `/onboarding`으로 보내 추가 정보를 1회 입력

## 3. DB 스키마

### users
- `id`
- `role` (`USER`, 추후 `ADMIN`)
- `status` (`PENDING_PROFILE`, `ACTIVE`, `SUSPENDED`, `DELETED`)
- `display_name`
- `activity_field`
- `region`
- `onboarding_completed`
- `deleted_at`
- `last_login_at`
- `created_at`
- `updated_at`

### social_accounts
- `id`
- `user_id`
- `provider`
- `provider_user_id`
- `provider_email`
- `email_verified`
- `provider_nickname`
- `linked_at`
- `last_login_at`

**유니크 제약**
- `(provider, provider_user_id)`

### user_terms_consents
- `id`
- `user_id`
- `consent_type`
- `version`
- `agreed`
- `agreed_at`
- `created_at`

**유니크 제약**
- `(user_id, consent_type, version)`

### auth_sessions
- `id`
- `user_id`
- `session_token_hash`
- `user_agent_hash`
- `ip_hash`
- `expires_at`
- `revoked_at`
- `last_seen_at`
- `created_at`

**유니크 제약**
- `session_token_hash`

### oauth_login_states
- `id`
- `provider`
- `state_token`
- `redirect_path`
- `requester_ip_hash`
- `requester_user_agent_hash`
- `expires_at`
- `used_at`
- `created_at`

## 4. 인증 플로우

### 로그인 시작
1. 사용자가 `/login`에서 네이버/카카오 버튼 클릭
2. 프런트는 `/api/auth/oauth/{provider}/start?next=/...`로 이동
3. 서버는
   - `state` 생성
   - redirect path 저장
   - IP/UA 해시 저장
   - 공급자 인가 페이지로 리다이렉트

### 콜백
1. 공급자가 `/api/auth/oauth/{provider}/callback` 호출
2. 서버는
   - `state` 일치/만료/1회 사용 여부 검증
   - 공급자 토큰 교환
   - 공급자 사용자 정보 조회
   - `provider + provider_user_id`로 계정 조회/생성
3. 서버는 세션 레코드를 만들고 **세션 원문 대신 해시만 저장**
4. HttpOnly 쿠키 발급 후
   - 기존 회원: `next` 또는 `/`
   - 신규 회원: `/onboarding?next=...`

### 온보딩
1. `/api/auth/me`로 현재 세션 확인
2. 추가 정보 저장
3. `users.status=ACTIVE`, `onboarding_completed=true`
4. 약관 동의 저장
5. 원래 진입 페이지 또는 메인으로 이동

### 로그아웃
- 현재 세션만 revoke

### 탈퇴
- `users.status=DELETED`
- `deleted_at` 기록
- 해당 사용자의 모든 활성 세션 revoke

## 5. 보안 고려사항

- OAuth `state` 저장 및 1회 사용 처리
- redirect path는 **상대 경로만 허용**
- POST/DELETE 인증 관련 API는 same-origin 검증
- 쿠키 옵션
  - `HttpOnly`
  - `Secure` (prod)
  - `SameSite=Lax`
- 공급자 토큰 원문/개인정보 원문을 로그에 남기지 않음
- 인증 실패 시 사용자에게는 **일반화된 메시지**만 노출
- `provider + provider_user_id` 유니크 제약으로 중복 가입 방지
- 동의 이력은 버전 단위 업서트
- soft delete 계정은 자동 복구 금지
- 기본 rate limit 포함
  - OAuth 시작
  - OAuth 콜백
- 운영에서는 in-memory limit을 Redis/edge rate limit으로 대체 권장

## 6. 프런트 구조

- `/login`: 네이버/카카오 로그인 진입
- `/onboarding`: 최초 1회 추가 정보 입력
- `/account`: 로그아웃 / 탈퇴
- 공통 HTML 렌더러가 `/api/auth/me`를 호출해
  - 로그인 버튼 ↔ 마이페이지 버튼 전환
  - 보호 페이지 접근 제어
  - 로그인 후 리다이렉트

## 7. 백엔드 API

- `GET /api/auth/oauth/{provider}/start`
- `GET /api/auth/oauth/{provider}/callback`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/onboarding`
- `DELETE /api/auth/account`

## 8. 운영 체크리스트

- 프로덕션은 HTTPS 필수
- Spring 프로파일
  - `local`: H2 기반 로컬 실행
  - `production`: PostgreSQL 기반 운영 실행
- `AUTH_PUBLIC_BASE_URL`은 실제 서비스 도메인으로 설정
- 네이버/카카오 콘솔 Redirect URI에 아래 등록
  - `https://your-domain.example/api/auth/oauth/naver/callback`
  - `https://your-domain.example/api/auth/oauth/kakao/callback`
- `AUTH_ALLOWED_ORIGINS`는 실제 프론트 origin만 허용
- `AUTH_COOKIE_SECURE=true`
- DB는 PostgreSQL 사용 권장
