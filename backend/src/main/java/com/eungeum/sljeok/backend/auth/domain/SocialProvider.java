package com.eungeum.sljeok.backend.auth.domain;

public enum SocialProvider {
  NAVER("naver"),
  KAKAO("kakao");

  private final String value;

  SocialProvider(String value) {
    this.value = value;
  }

  public String value() {
    return value;
  }

  public static SocialProvider from(String raw) {
    for (SocialProvider provider : values()) {
      if (provider.value.equalsIgnoreCase(raw)) {
        return provider;
      }
    }
    throw new IllegalArgumentException("Unsupported provider");
  }
}
