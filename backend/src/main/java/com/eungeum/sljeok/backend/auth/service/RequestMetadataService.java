package com.eungeum.sljeok.backend.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class RequestMetadataService {
  private final SecurityTokenService securityTokenService;

  public RequestMetadataService(SecurityTokenService securityTokenService) {
    this.securityTokenService = securityTokenService;
  }

  public String resolveClientIp(HttpServletRequest request) {
    String forwarded = request.getHeader("X-Forwarded-For");
    if (forwarded != null && !forwarded.isBlank()) {
      return forwarded.split(",")[0].trim();
    }
    return request.getRemoteAddr();
  }

  public String ipHash(HttpServletRequest request) {
    return securityTokenService.sha256(resolveClientIp(request));
  }

  public String userAgentHash(HttpServletRequest request) {
    String userAgent = request.getHeader("User-Agent");
    return securityTokenService.sha256(userAgent == null ? "unknown" : userAgent);
  }
}
