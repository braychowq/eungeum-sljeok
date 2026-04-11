package com.eungeum.sljeok.backend.content.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InlineImageService {
  private static final Pattern DATA_URL_PATTERN =
      Pattern.compile("^data:(image/(png|jpeg|jpg|webp));base64,([A-Za-z0-9+/=]+)$");
  private static final int MAX_IMAGE_BYTES = 750 * 1024;

  public List<String> normalize(List<String> rawImages, int maxCount) {
    if (rawImages == null || rawImages.isEmpty()) {
      return List.of();
    }

    List<String> normalized = new ArrayList<>();
    for (String rawImage : rawImages) {
      if (rawImage == null || rawImage.isBlank()) {
        continue;
      }
      normalized.add(normalizeOne(rawImage));
    }

    if (normalized.size() > maxCount) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "이미지는 최대 " + maxCount + "장까지 올릴 수 있어요.");
    }

    return normalized;
  }

  private String normalizeOne(String rawImage) {
    Matcher matcher = DATA_URL_PATTERN.matcher(rawImage.trim());
    if (!matcher.matches()) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "PNG, JPG, WEBP 이미지만 올릴 수 있어요.");
    }

    String mimeType = matcher.group(1).toLowerCase(Locale.ROOT);
    if ("image/jpg".equals(mimeType)) {
      mimeType = "image/jpeg";
    }

    byte[] decoded;
    try {
      decoded = Base64.getDecoder().decode(matcher.group(3));
    } catch (IllegalArgumentException exception) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "이미지 형식을 다시 확인해 주세요.");
    }

    if (decoded.length < 32) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "이미지를 다시 골라주세요.");
    }

    if (decoded.length > MAX_IMAGE_BYTES) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "이미지는 750KB 이하로 올려주세요.");
    }

    return "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(decoded);
  }
}
