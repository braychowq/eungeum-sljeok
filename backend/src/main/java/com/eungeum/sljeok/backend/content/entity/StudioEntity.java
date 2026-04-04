package com.eungeum.sljeok.backend.content.entity;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.content.domain.StudioStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "studios")
public class StudioEntity {
  @Id private String id;

  @Column(nullable = false, unique = true, length = 160)
  private String slug;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_user_id")
  private UserEntity ownerUser;

  @Column(length = 80)
  private String ownerDisplayName;

  @Column(nullable = false, length = 60)
  private String category;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, length = 160)
  private String location;

  @Column(nullable = false, columnDefinition = "text")
  private String description;

  @Column(nullable = false)
  private int priceAmount;

  @Column(nullable = false, length = 20)
  private String priceUnit;

  @Column(nullable = false, length = 80)
  private String contact;

  private Integer capacity;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private StudioStatus status;

  @Column(nullable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortOrder asc")
  private List<StudioImageEntity> images = new ArrayList<>();

  @OneToMany(mappedBy = "studio", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortOrder asc")
  private List<StudioAmenityEntity> amenities = new ArrayList<>();

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

  public void addImage(StudioImageEntity image) {
    image.setStudio(this);
    images.add(image);
  }

  public void addAmenity(StudioAmenityEntity amenity) {
    amenity.setStudio(this);
    amenities.add(amenity);
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

  public UserEntity getOwnerUser() {
    return ownerUser;
  }

  public void setOwnerUser(UserEntity ownerUser) {
    this.ownerUser = ownerUser;
  }

  public String getOwnerDisplayName() {
    return ownerDisplayName;
  }

  public void setOwnerDisplayName(String ownerDisplayName) {
    this.ownerDisplayName = ownerDisplayName;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public int getPriceAmount() {
    return priceAmount;
  }

  public void setPriceAmount(int priceAmount) {
    this.priceAmount = priceAmount;
  }

  public String getPriceUnit() {
    return priceUnit;
  }

  public void setPriceUnit(String priceUnit) {
    this.priceUnit = priceUnit;
  }

  public String getContact() {
    return contact;
  }

  public void setContact(String contact) {
    this.contact = contact;
  }

  public Integer getCapacity() {
    return capacity;
  }

  public void setCapacity(Integer capacity) {
    this.capacity = capacity;
  }

  public StudioStatus getStatus() {
    return status;
  }

  public void setStatus(StudioStatus status) {
    this.status = status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public List<StudioImageEntity> getImages() {
    return images;
  }

  public List<StudioAmenityEntity> getAmenities() {
    return amenities;
  }
}
