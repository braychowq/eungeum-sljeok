package com.eungeum.sljeok.backend.auth.entity;

import com.eungeum.sljeok.backend.auth.domain.SocialProvider;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "oauth_login_states")
public class OAuthLoginStateEntity {
  @Id private String id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private SocialProvider provider;

  @Column(nullable = false, length = 128, unique = true)
  private String stateToken;

  @Column(nullable = false, length = 512)
  private String redirectPath;

  @Column(length = 128)
  private String requesterIpHash;

  @Column(length = 128)
  private String requesterUserAgentHash;

  @Column(nullable = false)
  private Instant expiresAt;

  private Instant usedAt;

  @Column(nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    if (id == null) {
      id = UUID.randomUUID().toString();
    }
    createdAt = Instant.now();
  }

  public SocialProvider getProvider() {
    return provider;
  }

  public void setProvider(SocialProvider provider) {
    this.provider = provider;
  }

  public String getStateToken() {
    return stateToken;
  }

  public void setStateToken(String stateToken) {
    this.stateToken = stateToken;
  }

  public String getRedirectPath() {
    return redirectPath;
  }

  public void setRedirectPath(String redirectPath) {
    this.redirectPath = redirectPath;
  }

  public String getRequesterIpHash() {
    return requesterIpHash;
  }

  public void setRequesterIpHash(String requesterIpHash) {
    this.requesterIpHash = requesterIpHash;
  }

  public String getRequesterUserAgentHash() {
    return requesterUserAgentHash;
  }

  public void setRequesterUserAgentHash(String requesterUserAgentHash) {
    this.requesterUserAgentHash = requesterUserAgentHash;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }

  public Instant getUsedAt() {
    return usedAt;
  }

  public void setUsedAt(Instant usedAt) {
    this.usedAt = usedAt;
  }
}
