package com.eungeum.sljeok.backend.common.api;

import java.util.Map;

public record ApiErrorEnvelope(
    String status,
    String code,
    String message,
    Map<String, String> fieldErrors) {
  public static ApiErrorEnvelope of(String code, String message) {
    return new ApiErrorEnvelope("error", code, message, Map.of());
  }

  public static ApiErrorEnvelope of(String code, String message, Map<String, String> fieldErrors) {
    return new ApiErrorEnvelope(
        "error", code, message, fieldErrors == null ? Map.of() : fieldErrors);
  }
}
