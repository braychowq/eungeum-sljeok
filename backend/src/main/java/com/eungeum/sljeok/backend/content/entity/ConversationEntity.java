package com.eungeum.sljeok.backend.content.entity;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
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
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "conversations")
public class ConversationEntity {
  @Id private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "workshop_id", nullable = false)
  private StudioEntity workshop;

  @Column(nullable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @Column private Instant inquirerLastReadAt;

  @Column private Instant ownerLastReadAt;

  @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("createdAt asc")
  private List<ConversationMessageEntity> messages = new ArrayList<>();

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

  public void addMessage(ConversationMessageEntity message) {
    message.setConversation(this);
    messages.add(message);
    touch();
  }

  public void markReadFor(UserEntity actor) {
    if (actor == null || actor.getId() == null) {
      return;
    }

    String actorId = actor.getId();
    Instant latestIncomingAt = latestIncomingAtFor(actorId);
    if (latestIncomingAt == null) {
      return;
    }

    if (user != null && actorId.equals(user.getId())) {
      if (inquirerLastReadAt == null || latestIncomingAt.isAfter(inquirerLastReadAt)) {
        inquirerLastReadAt = latestIncomingAt;
      }
      return;
    }

    String ownerId = workshop == null || workshop.getOwnerUser() == null ? null : workshop.getOwnerUser().getId();
    if (ownerId != null && ownerId.equals(actorId)) {
      if (ownerLastReadAt == null || latestIncomingAt.isAfter(ownerLastReadAt)) {
        ownerLastReadAt = latestIncomingAt;
      }
    }
  }

  public Instant lastReadAtFor(UserEntity actor) {
    if (actor == null || actor.getId() == null) {
      return null;
    }

    String actorId = actor.getId();
    if (user != null && actorId.equals(user.getId())) {
      return inquirerLastReadAt;
    }

    String ownerId = workshop == null || workshop.getOwnerUser() == null ? null : workshop.getOwnerUser().getId();
    if (ownerId != null && ownerId.equals(actorId)) {
      return ownerLastReadAt;
    }

    return null;
  }

  public long unreadCountFor(UserEntity actor) {
    if (actor == null || actor.getId() == null) {
      return 0;
    }

    Instant readAt = lastReadAtFor(actor);
    String actorId = actor.getId();

    return messages.stream()
        .filter(message -> message.getSender() != null && message.getSender().getId() != null)
        .filter(message -> !actorId.equals(message.getSender().getId()))
        .filter(message -> readAt == null || (message.getCreatedAt() != null && message.getCreatedAt().isAfter(readAt)))
        .count();
  }

  private Instant latestIncomingAtFor(String actorId) {
    Instant latest = null;
    for (ConversationMessageEntity message : messages) {
      if (message.getSender() == null || message.getSender().getId() == null) {
        continue;
      }
      if (actorId.equals(message.getSender().getId()) || message.getCreatedAt() == null) {
        continue;
      }
      if (latest == null || message.getCreatedAt().isAfter(latest)) {
        latest = message.getCreatedAt();
      }
    }
    return latest;
  }

  public void touch() {
    updatedAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public StudioEntity getWorkshop() {
    return workshop;
  }

  public void setWorkshop(StudioEntity workshop) {
    this.workshop = workshop;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public Instant getInquirerLastReadAt() {
    return inquirerLastReadAt;
  }

  public Instant getOwnerLastReadAt() {
    return ownerLastReadAt;
  }

  public List<ConversationMessageEntity> getMessages() {
    return messages;
  }
}
