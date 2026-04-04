package com.eungeum.sljeok.backend.auth.service;

import com.eungeum.sljeok.backend.auth.config.AuthProperties;
import com.eungeum.sljeok.backend.auth.domain.ConsentType;
import com.eungeum.sljeok.backend.auth.domain.SocialProvider;
import com.eungeum.sljeok.backend.auth.domain.UserRole;
import com.eungeum.sljeok.backend.auth.domain.UserStatus;
import com.eungeum.sljeok.backend.auth.entity.OAuthLoginStateEntity;
import com.eungeum.sljeok.backend.auth.entity.SocialAccountEntity;
import com.eungeum.sljeok.backend.auth.entity.UserConsentEntity;
import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.repository.OAuthLoginStateRepository;
import com.eungeum.sljeok.backend.auth.repository.SocialAccountRepository;
import com.eungeum.sljeok.backend.auth.repository.UserConsentRepository;
import com.eungeum.sljeok.backend.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotBlank;
import java.net.URI;
import java.net.URLEncoder;
import java.time.Duration;
import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthFlowService {
  private static final Logger log = LoggerFactory.getLogger(AuthFlowService.class);

  private final AuthProperties authProperties;
  private final RedirectValidator redirectValidator;
  private final RateLimitService rateLimitService;
  private final RequestMetadataService requestMetadataService;
  private final SecurityTokenService securityTokenService;
  private final OAuthLoginStateRepository oAuthLoginStateRepository;
  private final OAuthProviderClient oAuthProviderClient;
  private final UserRepository userRepository;
  private final SocialAccountRepository socialAccountRepository;
  private final UserConsentRepository userConsentRepository;

  public AuthFlowService(
      AuthProperties authProperties,
      RedirectValidator redirectValidator,
      RateLimitService rateLimitService,
      RequestMetadataService requestMetadataService,
      SecurityTokenService securityTokenService,
      OAuthLoginStateRepository oAuthLoginStateRepository,
      OAuthProviderClient oAuthProviderClient,
      UserRepository userRepository,
      SocialAccountRepository socialAccountRepository,
      UserConsentRepository userConsentRepository) {
    this.authProperties = authProperties;
    this.redirectValidator = redirectValidator;
    this.rateLimitService = rateLimitService;
    this.requestMetadataService = requestMetadataService;
    this.securityTokenService = securityTokenService;
    this.oAuthLoginStateRepository = oAuthLoginStateRepository;
    this.oAuthProviderClient = oAuthProviderClient;
    this.userRepository = userRepository;
    this.socialAccountRepository = socialAccountRepository;
    this.userConsentRepository = userConsentRepository;
  }

  @Transactional
  public URI begin(SocialProvider provider, String next, HttpServletRequest request) {
    rateLimitService.check(
        "oauth:start:" + requestMetadataService.ipHash(request) + ":" + provider.value(),
        20,
        Duration.ofMinutes(1));

    oAuthLoginStateRepository.deleteByExpiresAtBefore(Instant.now());
    String state = securityTokenService.randomToken();
    OAuthLoginStateEntity entity = new OAuthLoginStateEntity();
    entity.setProvider(provider);
    entity.setStateToken(state);
    entity.setRedirectPath(redirectValidator.sanitizeNext(next));
    entity.setRequesterIpHash(requestMetadataService.ipHash(request));
    entity.setRequesterUserAgentHash(requestMetadataService.userAgentHash(request));
    entity.setExpiresAt(Instant.now().plus(authProperties.getOauthStateTtl()));
    oAuthLoginStateRepository.save(entity);
    return oAuthProviderClient.authorizationUri(provider, state);
  }

  @Transactional
  public LoginResult finish(
      SocialProvider provider, String code, String state, String error, HttpServletRequest request) {
    rateLimitService.check(
        "oauth:callback:" + requestMetadataService.ipHash(request) + ":" + provider.value(),
        40,
        Duration.ofMinutes(1));

    if (error != null && !error.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "다시 시도해 주세요.");
    }

    OAuthLoginStateEntity loginState =
        oAuthLoginStateRepository
            .findByStateToken(state)
            .filter(item -> item.getProvider() == provider)
            .filter(item -> item.getUsedAt() == null)
            .filter(item -> item.getExpiresAt().isAfter(Instant.now()))
            .filter(
                item ->
                    item.getRequesterUserAgentHash() == null
                        || item.getRequesterUserAgentHash()
                            .equals(requestMetadataService.userAgentHash(request)))
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 요청입니다."));
    loginState.setUsedAt(Instant.now());
    oAuthLoginStateRepository.save(loginState);

    ProviderUserProfile profile = oAuthProviderClient.fetchProfile(provider, code, state);
    if (profile.providerUserId() == null || profile.providerUserId().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "다시 시도해 주세요.");
    }

    UserEntity user = upsertUser(provider, profile);
    if (user.getStatus() == UserStatus.DELETED || user.getStatus() == UserStatus.SUSPENDED) {
      log.warn("Blocked login for status={} provider={}", user.getStatus(), provider.value());
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "다시 시도해 주세요.");
    }

    user.setLastLoginAt(Instant.now());
    userRepository.save(user);

    String redirectPath =
        user.isOnboardingCompleted()
            ? loginState.getRedirectPath()
            : "/onboarding?next="
                + URLEncoder.encode(loginState.getRedirectPath(), StandardCharsets.UTF_8);
    log.info(
        "Social login success provider={} userId={} onboardingCompleted={}",
        provider.value(),
        user.getId(),
        user.isOnboardingCompleted());
    return new LoginResult(user, redirectPath);
  }

  @Transactional
  protected UserEntity upsertUser(SocialProvider provider, ProviderUserProfile profile) {
    Optional<SocialAccountEntity> existingAccount =
        socialAccountRepository.findByProviderAndProviderUserId(provider, profile.providerUserId());

    if (existingAccount.isPresent()) {
      SocialAccountEntity account = existingAccount.get();
      if (account.getUser().getStatus() == UserStatus.DELETED
          || account.getUser().getStatus() == UserStatus.SUSPENDED) {
        return account.getUser();
      }
      account.setProviderEmail(profile.email());
      account.setEmailVerified(profile.emailVerified());
      account.setProviderNickname(profile.nickname());
      account.setLastLoginAt(Instant.now());
      socialAccountRepository.save(account);
      return account.getUser();
    }

    UserEntity user = new UserEntity();
    user.setRole(UserRole.USER);
    user.setStatus(UserStatus.PENDING_PROFILE);
    user.setDisplayName(profile.nickname());
    user.setOnboardingCompleted(false);
    user.setLastLoginAt(Instant.now());
    userRepository.save(user);

    SocialAccountEntity account = new SocialAccountEntity();
    account.setUser(user);
    account.setProvider(provider);
    account.setProviderUserId(profile.providerUserId());
    account.setProviderEmail(profile.email());
    account.setEmailVerified(profile.emailVerified());
    account.setProviderNickname(profile.nickname());
    account.setLinkedAt(Instant.now());
    account.setLastLoginAt(Instant.now());

    try {
      socialAccountRepository.save(account);
      return user;
    } catch (DataIntegrityViolationException exception) {
      return socialAccountRepository
          .findByProviderAndProviderUserId(provider, profile.providerUserId())
          .map(SocialAccountEntity::getUser)
          .orElseThrow(() -> exception);
    }
  }

  @Transactional
  public void completeOnboarding(AuthenticatedUser authenticatedUser, OnboardingRequest request) {
    UserEntity user =
        userRepository
            .findById(authenticatedUser.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

    user.setDisplayName(request.displayName().trim());
    user.setActivityField(request.activityField().trim());
    user.setRegion(request.region().trim());
    user.setOnboardingCompleted(true);
    user.setStatus(UserStatus.ACTIVE);
    userRepository.save(user);

    saveConsent(user, ConsentType.TERMS_OF_SERVICE, true);
    saveConsent(user, ConsentType.PRIVACY_POLICY, true);
    saveConsent(user, ConsentType.MARKETING, request.marketingOptIn());
  }

  @Transactional
  public void softDelete(AuthenticatedUser authenticatedUser) {
    UserEntity user =
        userRepository
            .findById(authenticatedUser.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    user.setStatus(UserStatus.DELETED);
    user.setDeletedAt(Instant.now());
    user.setOnboardingCompleted(false);
    userRepository.save(user);
  }

  private void saveConsent(UserEntity user, ConsentType type, boolean agreed) {
    UserConsentEntity consent =
        userConsentRepository
            .findByUserAndConsentTypeAndVersion(
                user, type, authProperties.getRequiredTermsVersion())
            .orElseGet(
                () -> {
                  UserConsentEntity entity = new UserConsentEntity();
                  entity.setUser(user);
                  entity.setConsentType(type);
                  entity.setVersion(authProperties.getRequiredTermsVersion());
                  return entity;
                });
    consent.setAgreed(agreed);
    consent.setAgreedAt(agreed ? Instant.now() : null);
    userConsentRepository.save(consent);
  }

  public record LoginResult(UserEntity user, String redirectPath) {}

  public record OnboardingRequest(
      @NotBlank String displayName,
      @NotBlank String activityField,
      @NotBlank String region,
      boolean marketingOptIn,
      boolean agreedTerms,
      boolean agreedPrivacy) {
    public void validate() {
      if (!agreedTerms || !agreedPrivacy) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "필수 동의가 필요해요.");
      }
    }
  }
}
