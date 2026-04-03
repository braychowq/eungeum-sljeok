package com.eungeum.sljeok.backend.controller;

import com.eungeum.sljeok.backend.model.CommunityPost;
import com.eungeum.sljeok.backend.model.Studio;
import com.eungeum.sljeok.backend.store.SampleData;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ApiController {
  @GetMapping("/api/health")
  public Map<String, String> health() {
    return Map.of("status", "ok", "timestamp", Instant.now().toString());
  }

  @GetMapping("/api/studios")
  public List<Studio> studios() {
    return SampleData.studios();
  }

  @GetMapping("/api/community/posts")
  public List<CommunityPost> posts() {
    return SampleData.posts();
  }

  @PostMapping("/api/studios")
  public Map<String, Object> createStudio(@RequestBody Map<String, Object> payload) {
    String name = stringValue(payload.get("name"));
    String location = stringValue(payload.get("location"));
    String description = stringValue(payload.get("description"));
    String price = stringValue(payload.get("price"));
    String contact = stringValue(payload.get("contact"));
    String category = stringValue(payload.get("category"));
    String capacity = stringValue(payload.get("capacity"));
    List<String> amenities = stringList(payload.get("amenities"));
    List<String> imageNames = stringList(payload.get("imageNames"));
    Object imageCount = payload.get("imageCount");
    String platform = stringValue(payload.get("platform"));

    List<String> missingFields = new ArrayList<>();
    if (name.isBlank()) missingFields.add("name");
    if (location.isBlank()) missingFields.add("location");
    if (description.isBlank()) missingFields.add("description");
    if (price.isBlank()) missingFields.add("price");
    if (contact.isBlank()) missingFields.add("contact");

    if (!missingFields.isEmpty()) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "필수 항목이 누락되었습니다: " + String.join(", ", missingFields));
    }

    String studioId = slugify(name) + "-" + Instant.now().toEpochMilli();

    Map<String, Object> response = new LinkedHashMap<>();
    response.put("status", "created");
    response.put("id", studioId);
    response.put("name", name);
    response.put("location", location);
    response.put("description", description);
    response.put("price", price);
    response.put("contact", contact);
    response.put("category", category.isBlank() ? "주얼리 공방" : category);
    response.put("capacity", capacity);
    response.put("amenities", amenities);
    response.put("imageNames", imageNames);
    response.put("imageCount", imageCount instanceof Number ? imageCount : imageNames.size());
    response.put("platform", platform.isBlank() ? "web" : platform);
    response.put("submittedAt", Instant.now().toString());
    response.put("message", "공방 등록 요청이 접수되었습니다.");
    return response;
  }

  private static String stringValue(Object value) {
    return value == null ? "" : String.valueOf(value).trim();
  }

  private static List<String> stringList(Object value) {
    if (!(value instanceof List<?> rawList)) {
      return List.of();
    }

    return rawList.stream().map(ApiController::stringValue).filter(item -> !item.isBlank()).toList();
  }

  private static String slugify(String value) {
    String normalized =
        value.toLowerCase().replaceAll("[^a-z0-9가-힣\\s-]", "").trim().replaceAll("\\s+", "-");
    return normalized.isBlank() ? "studio" : normalized;
  }
}
