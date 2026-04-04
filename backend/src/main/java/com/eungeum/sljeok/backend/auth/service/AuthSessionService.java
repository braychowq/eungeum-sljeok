package com.eungeum.sljeok.backend.auth.service;

import com.eungeum.sljeok.backend.auth.config.AuthProperties;
import com.eungeum.sljeok.backend.auth.entity.AuthSessionEntity;
import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.repository.AuthSessionRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthSessionService {
  private final AuthProperties authProperties;
  private final AuthSessionRepository authSessionRepository;
  private final SecurityTokenService securityTokenService;
  private final RequestMetadataService requestMetadataService;

  public AuthSessionService(
      AuthProperties authProperties,
      AuthSessionRepository authSessionRepository,
      SecurityTokenService securityTokenService,
      RequestMetadataService requestMetadataService) {
    this.authProperties = authProperties;
    this.authSessionRepository = authSessionRepository;
    this.securityTokenService = securityTokenService;
    this.requestMetadataService = requestMetadataService;
  }

  @Transactional
  public String create(UserEntity user, HttpServletRequest request) {
    authSessionRepository.deleteByExpiresAtBefore(Instant.now());
    String rawToken = securityTokenService.randomToken();
    AuthSessionEntity session = new AuthSessionEntity();
    session.setUser(user);
    session.setSessionTokenHash(securityTokenService.sha256(rawToken));
    session.setIpHash(requestMetadataService.ipHash(request));
    session.setUserAgentHash(requestMetadataService.userAgentHash(request));
    session.setExpiresAt(Instant.now().plus(authProperties.getSessionTtl()));
    session.setLastSeenAt(Instant.now());
    authSessionRepository.save(session);
    return rawToken;
  }

  @Transactional(readOnly = true)
  public Optional<AuthenticatedUser> resolve(HttpServletRequest request) {
    String rawToken = extractRawToken(request);
    if (rawToken == null || rawToken.isBlank()) {
      return Optional.empty();
    }

    return authSessionRepository
        .findBySessionTokenHashAndRevokedAtIsNull(securityTokenService.sha256(rawToken))
        .filter(session -> session.getExpiresAt().isAfter(Instant.now()))
        .map(AuthSessionEntity::getUser)
        .map(this::toPrincipal);
  }

  @Transactional
  public void revokeCurrent(HttpServletRequest request) {
    String rawToken = extractRawToken(request);
    if (rawToken == null || rawToken.isBlank()) {
      return;
    }

    authSessionRepository
        .findBySessionTokenHashAndRevokedAtIsNull(securityTokenService.sha256(rawToken))
        .ifPresent(
            session -> {
              session.setRevokedAt(Instant.now());
              authSessionRepository.save(session);
            });
  }

  @Transactional
  public void revokeAllForUser(String userId) {
    authSessionRepository.findAllByUser_IdAndRevokedAtIsNull(userId).forEach(
        session -> {
          session.setRevokedAt(Instant.now());
          authSessionRepository.save(session);
        });
  }

  private AuthenticatedUser toPrincipal(UserEntity user) {
    return new AuthenticatedUser(
        user.getId(),
        user.getDisplayName() == null || user.getDisplayName().isBlank()
            ? "메이커"
            : user.getDisplayName(),
        user.getRole(),
        user.getStatus(),
        user.isOnboardingCompleted());
  }

  private String extractRawToken(HttpServletRequest request) {
    if (request.getCookies() == null) {
      return null;
    }

    return Arrays.stream(request.getCookies())
        .filter(cookie -> authProperties.getSessionCookieName().equals(cookie.getName()))
        .map(Cookie::getValue)
        .findFirst()
        .orElse(null);
  }
}
