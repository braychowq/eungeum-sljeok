package com.eungeum.sljeok.backend.content.service;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.content.domain.StudioStatus;
import com.eungeum.sljeok.backend.content.entity.StudioAmenityEntity;
import com.eungeum.sljeok.backend.content.entity.StudioEntity;
import com.eungeum.sljeok.backend.content.entity.StudioImageEntity;
import com.eungeum.sljeok.backend.content.repository.StudioRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudioService {
  private final StudioRepository studioRepository;
  private final SlugService slugService;
  private final InlineImageService inlineImageService;

  public StudioService(
      StudioRepository studioRepository,
      SlugService slugService,
      InlineImageService inlineImageService) {
    this.studioRepository = studioRepository;
    this.slugService = slugService;
    this.inlineImageService = inlineImageService;
  }

  @Transactional(readOnly = true)
  public List<StudioEntity> listAll() {
    List<StudioEntity> studios = studioRepository.findAllByStatusOrderByCreatedAtDesc(StudioStatus.ACTIVE);
    studios.forEach(this::initializeCollections);
    return studios;
  }

  @Transactional(readOnly = true)
  public List<StudioEntity> listFeatured() {
    List<StudioEntity> studios = studioRepository.findTop3ByStatusOrderByCreatedAtDesc(StudioStatus.ACTIVE);
    studios.forEach(this::initializeCollections);
    return studios;
  }

  @Transactional(readOnly = true)
  public StudioEntity getBySlug(String slug) {
    StudioEntity studio =
        studioRepository
            .findBySlugAndStatus(slug, StudioStatus.ACTIVE)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공방을 찾을 수 없습니다."));
    initializeCollections(studio);
    return studio;
  }

  @Transactional
  public StudioEntity create(
      UserEntity owner,
      String category,
      String name,
      String location,
      String description,
      int priceAmount,
      String priceUnit,
      String contact,
      Integer capacity,
      List<String> amenities,
      List<String> imageDataUrls) {
    StudioEntity studio = new StudioEntity();
    studio.setSlug(slugService.uniqueSlug(name, studioRepository::existsBySlug));
    studio.setOwnerUser(owner);
    studio.setOwnerDisplayName(owner.getDisplayName());
    studio.setCategory(category);
    studio.setName(name);
    studio.setLocation(location);
    studio.setDescription(description);
    studio.setPriceAmount(priceAmount);
    studio.setPriceUnit(priceUnit == null || priceUnit.isBlank() ? "월" : priceUnit);
    studio.setContact(contact);
    studio.setCapacity(capacity == null || capacity < 1 ? 1 : capacity);
    studio.setStatus(StudioStatus.ACTIVE);

    List<String> normalizedAmenities = amenities == null ? List.of() : amenities;
    int amenityIndex = 0;
    for (String amenity : normalizedAmenities) {
      if (amenity == null || amenity.isBlank()) {
        continue;
      }
      StudioAmenityEntity entity = new StudioAmenityEntity();
      entity.setAmenityName(amenity.trim());
      entity.setSortOrder(amenityIndex++);
      studio.addAmenity(entity);
    }
    attachImages(studio, imageDataUrls);

    return studioRepository.save(studio);
  }

  private void initializeCollections(StudioEntity studio) {
    studio.getImages().size();
    studio.getAmenities().size();
  }

  private StudioImageEntity newStudioImage(String imageUrl, int sortOrder) {
    StudioImageEntity entity = new StudioImageEntity();
    entity.setImageUrl(imageUrl);
    entity.setSortOrder(sortOrder);
    return entity;
  }

  private void attachImages(StudioEntity studio, List<String> imageDataUrls) {
    List<String> normalizedImages = inlineImageService.normalize(imageDataUrls, 3);
    for (int index = 0; index < normalizedImages.size(); index += 1) {
      studio.addImage(newStudioImage(normalizedImages.get(index), index));
    }
  }
}
