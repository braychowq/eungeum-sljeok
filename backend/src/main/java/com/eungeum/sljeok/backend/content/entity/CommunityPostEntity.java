package com.eungeum.sljeok.backend.content.entity;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.content.domain.CommunityCategory;
import com.eungeum.sljeok.backend.content.persistence.CommunityCategoryConverter;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Convert;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "community_posts")
public class CommunityPostEntity {
  @Id private String id;

  @Column(nullable = false, unique = true, length = 160)
  private String slug;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_user_id")
  private UserEntity authorUser;

  @Column(length = 80)
  private String authorDisplayName;

  @Convert(converter = CommunityCategoryConverter.class)
  @Column(nullable = false, length = 20)
  private CommunityCategory category;

  @Column(nullable = false, length = 180)
  private String title;

  @Column(nullable = false, length = 255)
  private String excerpt;

  @Column(nullable = false, columnDefinition = "text")
  private String body;

  @Column(nullable = false)
  private int viewCount;

  @Column(nullable = false)
  private int commentCount;

  @Column(nullable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortOrder asc")
  private List<CommunityPostImageEntity> images = new ArrayList<>();

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("createdAt asc")
  private List<CommunityCommentEntity> comments = new ArrayList<>();

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

  public void addComment(CommunityCommentEntity comment) {
    comment.setPost(this);
    comments.add(comment);
  }

  public String getId() {
    return id;
  }

  public String getSlug() {
    return slug;
  }

  public void setSlug(String slug) {
    this.slug = slug;
  }

  public UserEntity getAuthorUser() {
    return authorUser;
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

  public CommunityCategory getCategory() {
    return category;
  }

  public void setCategory(CommunityCategory category) {
    this.category = category;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getExcerpt() {
    return excerpt;
  }

  public void setExcerpt(String excerpt) {
    this.excerpt = excerpt;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public int getViewCount() {
    return viewCount;
  }

  public void setViewCount(int viewCount) {
    this.viewCount = viewCount;
  }

  public int getCommentCount() {
    return commentCount;
  }

  public void setCommentCount(int commentCount) {
    this.commentCount = commentCount;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public List<CommunityCommentEntity> getComments() {
    return comments;
  }
}
