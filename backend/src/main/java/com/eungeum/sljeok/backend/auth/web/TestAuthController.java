package com.eungeum.sljeok.backend.auth.web;

import com.eungeum.sljeok.backend.auth.domain.UserRole;
import com.eungeum.sljeok.backend.auth.domain.UserStatus;
import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.repository.UserRepository;
import com.eungeum.sljeok.backend.auth.service.AuthCookieService;
import com.eungeum.sljeok.backend.auth.service.AuthSessionService;
import com.eungeum.sljeok.backend.common.api.ApiEnvelope;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.net.URI;
import java.util.Map;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("local")
@RestController
@RequestMapping("/api/test-auth")
public class TestAuthController {
  private final UserRepository userRepository;
  private final AuthSessionService authSessionService;
  private final AuthCookieService authCookieService;

  public TestAuthController(
      UserRepository userRepository,
      AuthSessionService authSessionService,
      AuthCookieService authCookieService) {
    this.userRepository = userRepository;
    this.authSessionService = authSessionService;
    this.authCookieService = authCookieService;
  }

  @PostMapping("/login")
  public ResponseEntity<ApiEnvelope<Map<String, String>>> login(
      @Valid @RequestBody TestLoginRequest requestBody, HttpServletRequest request) {
    UserEntity user =
        requestBody.userId() == null || requestBody.userId().isBlank()
            ? null
            : userRepository.findById(requestBody.userId().trim()).orElse(null);

    if (user == null) {
      user = new UserEntity();
      user.setRole(UserRole.USER);
      user.setStatus(UserStatus.ACTIVE);
      user.setDisplayName(
          requestBody.displayName() == null || requestBody.displayName().isBlank()
              ? "테스트 회원"
              : requestBody.displayName().trim());
      user.setActivityField("주얼리 디자이너");
      user.setRegion("서울");
      user.setOnboardingCompleted(true);
      userRepository.save(user);
    }

    String rawToken = authSessionService.create(user, request);
    HttpHeaders headers = new HttpHeaders();
    authCookieService.writeSessionCookie(headers, rawToken);
    headers.setLocation(URI.create("/"));
    return new ResponseEntity<>(
        ApiEnvelope.ok(Map.of("displayName", user.getDisplayName())), headers, HttpStatus.OK);
  }

  public record TestLoginRequest(@Size(max = 80) String displayName, @Size(max = 36) String userId) {}
}
