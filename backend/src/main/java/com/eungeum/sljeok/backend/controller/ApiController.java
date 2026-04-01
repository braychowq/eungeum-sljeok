package com.eungeum.sljeok.backend.controller;

import com.eungeum.sljeok.backend.model.CommunityPost;
import com.eungeum.sljeok.backend.model.Studio;
import com.eungeum.sljeok.backend.store.SampleData;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
