package com.eungeum.sljeok.backend.common.api;

import jakarta.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
  private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorEnvelope> handleValidation(
      MethodArgumentNotValidException exception) {
    Map<String, String> fieldErrors = new LinkedHashMap<>();
    for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
      fieldErrors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
    }

    return ResponseEntity.badRequest()
        .body(ApiErrorEnvelope.of("validation_failed", "입력값을 다시 확인해주세요.", fieldErrors));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiErrorEnvelope> handleConstraintViolation(
      ConstraintViolationException exception) {
    return ResponseEntity.badRequest()
        .body(ApiErrorEnvelope.of("validation_failed", "입력값을 다시 확인해주세요."));
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiErrorEnvelope> handleNotReadable(
      HttpMessageNotReadableException exception) {
    return ResponseEntity.badRequest()
        .body(ApiErrorEnvelope.of("invalid_request", "잘못된 요청 형식입니다."));
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ApiErrorEnvelope> handleStatus(ResponseStatusException exception) {
    String reason =
        exception.getReason() == null || exception.getReason().isBlank()
            ? "요청을 처리할 수 없습니다."
            : exception.getReason();

    String code = exception.getStatusCode().value() >= 500 ? "server_error" : "request_failed";
    return ResponseEntity.status(exception.getStatusCode()).body(ApiErrorEnvelope.of(code, reason));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorEnvelope> handleUnexpected(Exception exception) {
    log.error(
        "Unhandled application exception type={}",
        exception.getClass().getSimpleName(),
        exception);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(
            ApiErrorEnvelope.of(
                "server_error", "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요."));
  }
}
