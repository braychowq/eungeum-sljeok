package com.eungeum.sljeok.backend.auth.service;

import com.eungeum.sljeok.backend.auth.config.AuthProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class AuthCookieService {
  private final AuthProperties authProperties;

  public AuthCookieService(AuthProperties authProperties) {
    this.authProperties = authProperties;
  }

  public void writeSessionCookie(HttpHeaders headers, String rawToken) {
    ResponseCookie cookie =
        ResponseCookie.from(authProperties.getSessionCookieName(), rawToken)
            .httpOnly(true)
            .secure(authProperties.isCookieSecure())
            .sameSite("Lax")
            .path("/")
            .maxAge(authProperties.getSessionTtl())
            .build();
    headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  public void clearSessionCookie(HttpHeaders headers) {
    ResponseCookie cookie =
        ResponseCookie.from(authProperties.getSessionCookieName(), "")
            .httpOnly(true)
            .secure(authProperties.isCookieSecure())
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build();
    headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
  }
}
