package com.eungeum.sljeok.backend.auth.config;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "auth")
public class AuthProperties {
  private String publicBaseUrl;
  private String sessionCookieName;
  private Duration sessionTtl;
  private Duration oauthStateTtl;
  private boolean cookieSecure;
  private String requiredTermsVersion;
  private List<String> allowedOrigins = new ArrayList<>();
  private Map<String, ProviderProperties> providers = new HashMap<>();

  public String getPublicBaseUrl() {
    return publicBaseUrl;
  }

  public void setPublicBaseUrl(String publicBaseUrl) {
    this.publicBaseUrl = publicBaseUrl;
  }

  public String getSessionCookieName() {
    return sessionCookieName;
  }

  public void setSessionCookieName(String sessionCookieName) {
    this.sessionCookieName = sessionCookieName;
  }

  public Duration getSessionTtl() {
    return sessionTtl;
  }

  public void setSessionTtl(Duration sessionTtl) {
    this.sessionTtl = sessionTtl;
  }

  public Duration getOauthStateTtl() {
    return oauthStateTtl;
  }

  public void setOauthStateTtl(Duration oauthStateTtl) {
    this.oauthStateTtl = oauthStateTtl;
  }

  public boolean isCookieSecure() {
    return cookieSecure;
  }

  public void setCookieSecure(boolean cookieSecure) {
    this.cookieSecure = cookieSecure;
  }

  public String getRequiredTermsVersion() {
    return requiredTermsVersion;
  }

  public void setRequiredTermsVersion(String requiredTermsVersion) {
    this.requiredTermsVersion = requiredTermsVersion;
  }

  public List<String> getAllowedOrigins() {
    return allowedOrigins;
  }

  public void setAllowedOrigins(List<String> allowedOrigins) {
    this.allowedOrigins = allowedOrigins;
  }

  public Map<String, ProviderProperties> getProviders() {
    return providers;
  }

  public void setProviders(Map<String, ProviderProperties> providers) {
    this.providers = providers;
  }

  public ProviderProperties provider(String key) {
    return providers.get(key);
  }

  public static class ProviderProperties {
    private String clientId;
    private String clientSecret;
    private String authorizationUri;
    private String tokenUri;
    private String userInfoUri;

    public String getClientId() {
      return clientId;
    }

    public void setClientId(String clientId) {
      this.clientId = clientId;
    }

    public String getClientSecret() {
      return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
      this.clientSecret = clientSecret;
    }

    public String getAuthorizationUri() {
      return authorizationUri;
    }

    public void setAuthorizationUri(String authorizationUri) {
      this.authorizationUri = authorizationUri;
    }

    public String getTokenUri() {
      return tokenUri;
    }

    public void setTokenUri(String tokenUri) {
      this.tokenUri = tokenUri;
    }

    public String getUserInfoUri() {
      return userInfoUri;
    }

    public void setUserInfoUri(String userInfoUri) {
      this.userInfoUri = userInfoUri;
    }
  }
}
