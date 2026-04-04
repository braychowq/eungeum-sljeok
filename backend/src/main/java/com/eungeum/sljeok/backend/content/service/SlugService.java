package com.eungeum.sljeok.backend.content.service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.function.Predicate;
import org.springframework.stereotype.Service;

@Service
public class SlugService {
  public String uniqueSlug(String source, Predicate<String> exists) {
    String base = slugify(source);
    if (!exists.test(base)) {
      return base;
    }

    for (int index = 2; index < 1000; index += 1) {
      String candidate = base + "-" + index;
      if (!exists.test(candidate)) {
        return candidate;
      }
    }

    return base + "-" + System.currentTimeMillis();
  }

  public String slugify(String value) {
    String normalized =
        Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFKD)
            .replaceAll("[^\\p{IsAlphabetic}\\p{IsDigit}]+", "-")
            .replaceAll("(^-|-$)", "")
            .toLowerCase(Locale.ROOT);

    if (normalized.isBlank()) {
      return "item";
    }

    return normalized.length() > 150 ? normalized.substring(0, 150) : normalized;
  }
}
