package com.eungeum.sljeok.backend.content.domain;

public enum CommunityCategory {
  FREE,
  QA,
  MARKET;

  public static CommunityCategory from(String value) {
    if (value == null) {
      throw new IllegalArgumentException("카테고리가 비어 있습니다.");
    }

    String normalized = value.trim().toLowerCase();
    return switch (normalized) {
      case "free", "아무말" -> FREE;
      case "qa", "q/a" -> QA;
      case "market", "장터" -> MARKET;
      default -> throw new IllegalArgumentException("지원하지 않는 카테고리입니다.");
    };
  }

  public String label() {
    return switch (this) {
      case FREE -> "아무말";
      case QA -> "Q/A";
      case MARKET -> "장터";
    };
  }

  public String code() {
    return name().toLowerCase();
  }
}
