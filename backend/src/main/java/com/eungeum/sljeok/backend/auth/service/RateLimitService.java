package com.eungeum.sljeok.backend.auth.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class RateLimitService {
  private final Map<String, Window> windows = new ConcurrentHashMap<>();

  public void check(String key, int limit, Duration windowSize) {
    Instant now = Instant.now();
    Window window =
        windows.compute(
            key,
            (ignored, existing) -> {
              if (existing == null || existing.expiresAt().isBefore(now)) {
                return new Window(new AtomicInteger(1), now.plus(windowSize));
              }
              existing.counter().incrementAndGet();
              return existing;
            });

    if (window.counter().get() > limit) {
      throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "요청이 너무 많습니다.");
    }
  }

  private record Window(AtomicInteger counter, Instant expiresAt) {}
}
