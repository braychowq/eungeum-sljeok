package com.eungeum.sljeok.backend.auth.web;

import com.eungeum.sljeok.backend.auth.domain.SocialProvider;
import com.eungeum.sljeok.backend.auth.domain.UserStatus;
import com.eungeum.sljeok.backend.auth.service.AuthCookieService;
import com.eungeum.sljeok.backend.auth.service.AuthFlowService;
import com.eungeum.sljeok.backend.auth.service.AuthFlowService.LoginResult;
import com.eungeum.sljeok.backend.auth.service.AuthSessionService;
import com.eungeum.sljeok.backend.auth.service.AuthenticatedUser;
import com.eungeum.sljeok.backend.auth.service.OriginValidationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private static final Logger log = LoggerFactory.getLogger(AuthController.class);
  private final AuthFlowService authFlowService;
  private final AuthSessionService authSessionService;
  private final AuthCookieService authCookieService;
  private final OriginValidationService originValidationService;

  public AuthController(
      AuthFlowService authFlowService,
      AuthSessionService authSessionService,
      AuthCookieService authCookieService,
      OriginValidationService originValidationService) {
    this.authFlowService = authFlowService;
    this.authSessionService = authSessionService;
    this.authCookieService = authCookieService;
    this.originValidationService = originValidationService;
  }

  @GetMapping("/oauth/{provider}/start")
  public ResponseEntity<Void> start(
      @PathVariable String provider,
      @RequestParam(name = "next", required = false) String next,
      HttpServletRequest request) {
    try {
      URI location = authFlowService.begin(SocialProvider.from(provider), next, request);
      return ResponseEntity.status(HttpStatus.FOUND).location(location).build();
    } catch (RuntimeException exception) {
      log.warn(
          "Social login start failed provider={} type={}",
          provider,
          exception.getClass().getSimpleName());
      return ResponseEntity.status(HttpStatus.FOUND)
          .location(URI.create("/login?error=social_login_failed"))
          .build();
    }
  }

  @GetMapping("/oauth/{provider}/callback")
  public ResponseEntity<Void> callback(
      @PathVariable String provider,
      @RequestParam(required = false) String code,
      @RequestParam(required = false) String state,
      @RequestParam(required = false) String error,
      HttpServletRequest request) {
    try {
      if (code == null || state == null) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "로그인을 완료하지 못했습니다.");
      }

      LoginResult result = authFlowService.finish(SocialProvider.from(provider), code, state, error, request);
      String rawSessionToken = authSessionService.create(result.user(), request);

      HttpHeaders headers = new HttpHeaders();
      authCookieService.writeSessionCookie(headers, rawSessionToken);
      headers.setLocation(URI.create(result.redirectPath()));
      return new ResponseEntity<>(headers, HttpStatus.FOUND);
    } catch (RuntimeException exception) {
      log.warn(
          "Social login callback failed provider={} type={}",
          provider,
          exception.getClass().getSimpleName());
      HttpHeaders headers = new HttpHeaders();
      headers.setLocation(URI.create("/login?error=social_login_failed"));
      return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
  }

  @GetMapping("/me")
  public Map<String, Object> me(HttpServletRequest request) {
    return authSessionService
        .resolve(request)
        .<Map<String, Object>>map(
            user ->
                Map.of(
                    "authenticated", true,
                    "user",
                        Map.of(
                            "id", user.userId(),
                            "displayName", user.displayName(),
                            "role", user.role().name(),
                            "status", user.status().name(),
                            "onboardingCompleted", user.onboardingCompleted(),
                            "accountPath", "/account",
                            "requiresOnboarding", !user.onboardingCompleted())))
        .orElseGet(() -> Map.of("authenticated", false));
  }

  @PostMapping("/logout")
  public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    authSessionService.revokeCurrent(request);
    HttpHeaders headers = new HttpHeaders();
    authCookieService.clearSessionCookie(headers);
    return new ResponseEntity<>(Map.of("message", "로그아웃되었습니다."), headers, HttpStatus.OK);
  }

  @PostMapping("/onboarding")
  public Map<String, Object> onboarding(
      @Valid @RequestBody AuthFlowService.OnboardingRequest requestBody, HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    AuthenticatedUser user = requireAuthenticated(request);
    requestBody.validate();
    authFlowService.completeOnboarding(user, requestBody);
    return Map.of("status", "ok", "message", "추가 정보가 저장되었습니다.", "redirectTo", "/");
  }

  @DeleteMapping("/account")
  public ResponseEntity<Map<String, String>> deleteAccount(HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    AuthenticatedUser user = requireAuthenticated(request);
    authFlowService.softDelete(user);
    authSessionService.revokeAllForUser(user.userId());
    HttpHeaders headers = new HttpHeaders();
    authCookieService.clearSessionCookie(headers);
    return new ResponseEntity<>(Map.of("message", "탈퇴 처리되었습니다."), headers, HttpStatus.OK);
  }

  private AuthenticatedUser requireAuthenticated(HttpServletRequest request) {
    return authSessionService
        .resolve(request)
        .filter(user -> user.status() != UserStatus.DELETED)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증이 필요합니다."));
  }
}
