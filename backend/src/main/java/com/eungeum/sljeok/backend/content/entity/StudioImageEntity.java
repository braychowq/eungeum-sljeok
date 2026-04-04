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
@Table(name = "studio_images")
public class StudioImageEntity {
  @Id private String id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "studio_id", nullable = false)
  private StudioEntity studio;

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

  public void setStudio(StudioEntity studio) {
    this.studio = studio;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public int getSortOrder() {
    return sortOrder;
  }

  public void setSortOrder(int sortOrder) {
    this.sortOrder = sortOrder;
  }
}
