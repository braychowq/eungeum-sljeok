package com.eungeum.sljeok.backend.content.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "community_post_images")
public class CommunityPostImageEntity {
  @Id private String id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "post_id", nullable = false)
  private CommunityPostEntity post;

  @Column(nullable = false, length = 512)
  private String imageUrl;

  @Column(nullable = false)
  private int sortOrder;

  @Column(nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    if (id == null) {
      id = UUID.randomUUID().toString();
    }
    createdAt = Instant.now();
  }

  public void setPost(CommunityPostEntity post) {
    this.post = post;
  }
}
