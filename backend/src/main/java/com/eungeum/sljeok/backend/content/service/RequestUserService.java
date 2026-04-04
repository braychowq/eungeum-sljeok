package com.eungeum.sljeok.backend.content.service;

import com.eungeum.sljeok.backend.auth.domain.UserStatus;
import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.repository.UserRepository;
import com.eungeum.sljeok.backend.auth.service.AuthSessionService;
import com.eungeum.sljeok.backend.auth.service.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RequestUserService {
  private final AuthSessionService authSessionService;
  private final UserRepository userRepository;

  public RequestUserService(AuthSessionService authSessionService, UserRepository userRepository) {
    this.authSessionService = authSessionService;
    this.userRepository = userRepository;
  }

  public UserEntity requireActiveUser(HttpServletRequest request) {
    AuthenticatedUser principal =
        authSessionService
            .resolve(request)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요해요."));

    if (principal.status() == UserStatus.DELETED || principal.status() == UserStatus.SUSPENDED) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "지금은 사용할 수 없는 계정이에요.");
    }

    if (!principal.onboardingCompleted() || principal.status() != UserStatus.ACTIVE) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "먼저 정보를 마저 적어주세요.");
    }

    return userRepository
        .findById(principal.userId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요해요."));
  }
}
