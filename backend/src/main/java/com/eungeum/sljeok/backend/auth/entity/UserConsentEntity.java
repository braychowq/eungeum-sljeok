package com.eungeum.sljeok.backend.auth.entity;

import com.eungeum.sljeok.backend.auth.domain.ConsentType;
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
@Table(name = "user_terms_consents")
public class UserConsentEntity {
  @Id private String id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 40)
  private ConsentType consentType;

  @Column(nullable = false, length = 40)
  private String version;

  @Column(nullable = false)
  private boolean agreed;

  private Instant agreedAt;

  @Column(nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    if (id == null) {
      id = UUID.randomUUID().toString();
    }
    createdAt = Instant.now();
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public void setConsentType(ConsentType consentType) {
    this.consentType = consentType;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public void setAgreed(boolean agreed) {
    this.agreed = agreed;
  }

  public void setAgreedAt(Instant agreedAt) {
    this.agreedAt = agreedAt;
  }
}
