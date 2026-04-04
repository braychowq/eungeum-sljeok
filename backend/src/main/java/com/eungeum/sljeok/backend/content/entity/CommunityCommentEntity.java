package com.eungeum.sljeok.backend.content.entity;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "community_comments")
public class CommunityCommentEntity {
  @Id private String id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "post_id", nullable = false)
  private CommunityPostEntity post;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_user_id")
  private UserEntity authorUser;

  @Column(length = 80)
  private String authorDisplayName;

  @Column(nullable = false, columnDefinition = "text")
  private String body;

  @Column(nullable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @PrePersist
  void onCreate() {
    if (id == null) {
      id = UUID.randomUUID().toString();
    }
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }

  public void setPost(CommunityPostEntity post) {
    this.post = post;
  }

  public void setAuthorUser(UserEntity authorUser) {
    this.authorUser = authorUser;
  }

  public String getAuthorDisplayName() {
    return authorDisplayName;
  }

  public void setAuthorDisplayName(String authorDisplayName) {
    this.authorDisplayName = authorDisplayName;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
