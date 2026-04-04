package com.eungeum.sljeok.backend.common.api;

public record ApiEnvelope<T>(String status, T data, String message) {
  public static <T> ApiEnvelope<T> ok(T data) {
    return new ApiEnvelope<>("ok", data, null);
  }

  public static <T> ApiEnvelope<T> ok(T data, String message) {
    return new ApiEnvelope<>("ok", data, message);
  }
}
