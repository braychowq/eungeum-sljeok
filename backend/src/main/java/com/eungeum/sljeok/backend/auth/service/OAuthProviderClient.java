package com.eungeum.sljeok.backend.auth.service;

import com.eungeum.sljeok.backend.auth.config.AuthProperties;
import com.eungeum.sljeok.backend.auth.domain.SocialProvider;
import com.fasterxml.jackson.databind.JsonNode;
import java.net.URI;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class OAuthProviderClient {
  private final AuthProperties authProperties;
  private final RestClient restClient = RestClient.builder().build();

  public OAuthProviderClient(AuthProperties authProperties) {
    this.authProperties = authProperties;
  }

  public URI authorizationUri(SocialProvider provider, String state) {
    AuthProperties.ProviderProperties config = providerConfig(provider);
    UriComponentsBuilder builder =
        UriComponentsBuilder.fromUriString(config.getAuthorizationUri())
            .queryParam("response_type", "code")
            .queryParam("client_id", config.getClientId())
            .queryParam("redirect_uri", callbackUri(provider))
            .queryParam("state", state);
    return builder.build(true).toUri();
  }

  public ProviderUserProfile fetchProfile(SocialProvider provider, String code, String state) {
    String accessToken = exchangeForToken(provider, code, state);
    JsonNode profileNode =
        restClient
            .get()
            .uri(providerConfig(provider).getUserInfoUri())
            .header("Authorization", "Bearer " + accessToken)
            .retrieve()
            .body(JsonNode.class);

    return switch (provider) {
      case NAVER -> parseNaver(profileNode);
      case KAKAO -> parseKakao(profileNode);
    };
  }

  private String exchangeForToken(SocialProvider provider, String code, String state) {
    AuthProperties.ProviderProperties config = providerConfig(provider);
    MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
    form.add("grant_type", "authorization_code");
    form.add("client_id", config.getClientId());
    if (config.getClientSecret() != null && !config.getClientSecret().isBlank()) {
      form.add("client_secret", config.getClientSecret());
    }
    form.add("redirect_uri", callbackUri(provider));
    form.add("code", code);
    form.add("state", state);

    JsonNode response =
        restClient.post().uri(config.getTokenUri()).body(form).retrieve().body(JsonNode.class);
    String accessToken = response.path("access_token").asText();
    if (accessToken == null || accessToken.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "공급자 토큰 교환에 실패했습니다.");
    }
    return accessToken;
  }

  private ProviderUserProfile parseNaver(JsonNode node) {
    JsonNode response = node.path("response");
    return new ProviderUserProfile(
        response.path("id").asText(),
        response.path("email").asText(null),
        response.path("email").asText(null) != null,
        response.path("nickname").asText(response.path("name").asText("네이버 사용자")));
  }

  private ProviderUserProfile parseKakao(JsonNode node) {
    JsonNode account = node.path("kakao_account");
    JsonNode profile = account.path("profile");
    return new ProviderUserProfile(
        node.path("id").asText(),
        account.path("email").asText(null),
        account.path("email_verified").asBoolean(false),
        profile.path("nickname").asText("카카오 사용자"));
  }

  private AuthProperties.ProviderProperties providerConfig(SocialProvider provider) {
    AuthProperties.ProviderProperties config = authProperties.provider(provider.value());
    if (config == null || config.getClientId() == null || config.getClientId().isBlank()) {
      throw new IllegalStateException(provider.value() + " provider is not configured");
    }
    return config;
  }

  private String callbackUri(SocialProvider provider) {
    return authProperties.getPublicBaseUrl() + "/api/auth/oauth/" + provider.value() + "/callback";
  }
}
