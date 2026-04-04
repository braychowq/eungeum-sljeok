package com.eungeum.sljeok.backend.auth.entity;

import com.eungeum.sljeok.backend.auth.domain.SocialProvider;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "social_accounts")
public class SocialAccountEntity {
  @Id private String id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private SocialProvider provider;

  @Column(nullable = false, length = 191)
  private String providerUserId;

  @Column(length = 191)
  private String providerEmail;

  @Column(nullable = false)
  private boolean emailVerified;

  @Column(length = 120)
  private String providerNickname;

  @Column(nullable = false)
  private Instant linkedAt;

  @Column(nullable = false)
  private Instant lastLoginAt;

  @PrePersist
  void onCreate() {
    if (id == null) {
      id = UUID.randomUUID().toString();
    }
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public SocialProvider getProvider() {
    return provider;
  }

  public void setProvider(SocialProvider provider) {
    this.provider = provider;
  }

  public String getProviderUserId() {
    return providerUserId;
  }

  public void setProviderUserId(String providerUserId) {
    this.providerUserId = providerUserId;
  }

  public String getProviderEmail() {
    return providerEmail;
  }

  public void setProviderEmail(String providerEmail) {
    this.providerEmail = providerEmail;
  }

  public boolean isEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  public String getProviderNickname() {
    return providerNickname;
  }

  public void setProviderNickname(String providerNickname) {
    this.providerNickname = providerNickname;
  }

  public Instant getLinkedAt() {
    return linkedAt;
  }

  public void setLinkedAt(Instant linkedAt) {
    this.linkedAt = linkedAt;
  }

  public Instant getLastLoginAt() {
    return lastLoginAt;
  }

  public void setLastLoginAt(Instant lastLoginAt) {
    this.lastLoginAt = lastLoginAt;
  }
}
