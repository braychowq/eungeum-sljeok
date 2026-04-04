package com.eungeum.sljeok.backend.auth.service;

import org.springframework.stereotype.Component;

@Component
public class RedirectValidator {
  public String sanitizeNext(String requestedPath) {
    if (requestedPath == null || requestedPath.isBlank()) {
      return "/";
    }

    String trimmed = requestedPath.trim();
    if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.contains("\\"))
      return "/";
    return trimmed;
  }
}
