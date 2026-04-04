package com.eungeum.sljeok.backend.auth.service;

import com.eungeum.sljeok.backend.auth.config.AuthProperties;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Component
public class OriginValidationService {
  private final List<String> allowedOrigins;

  public OriginValidationService(AuthProperties authProperties) {
    this.allowedOrigins = authProperties.getAllowedOrigins();
  }

  public void validateSameOrigin(HttpServletRequest request) {
    String origin = request.getHeader("Origin");
    if (origin != null && allowedOrigins.stream().noneMatch(origin::equalsIgnoreCase)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "허용되지 않은 요청입니다.");
    }
  }
}
