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
  private static final List<String> FALLBACK_STUDIO_IMAGES =
      List.of(
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC3rg3F2p-W5Vfxw7-FTEux-_7G6FtrAgMUcjrQ15Qa7BQ6cUxwBKakk89QWwobbTWSKlRnFs1BBIbE__CZCp9pYf3kHjZLQiIOFleCZoV3HDXbvxpjxHg_e-moBufkgRZAgneaH1vxRWjcW-glX4crTiTV3Dclx30yG50IKlimWl7fndpDvMtTDRvyd4SmCATywwUXxpyeAIdwm_05U3nNYIFjISpnoFvwCZxG7QUWjCZxh4jzwwF1p_7rEbEnLpBgct00kz6Gm1Y",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCoS1F5DlOtIZaawuruVX2_fQqugectv32be0hyYWf77M7N1sfPcWdejYVDtzd4-HypdmAGLO7CCTLQ8PFyFcf0hD8ZS6vzoILMTaZksEHCNo3P47MTn6Em6qoYhgC0LsM_15MLHgg_m1IgHi3qVFo8Pit11-jKQK5oYNH-3JI3qfDLLdIDKaNVsRBMpMObcoivXrBu7EryGi9rSM7WOnNttBimV12GHWSAFnC9uUXit8DTOfbeHiJ7q0ILlu6yOtgN1ob6jymnWRQ",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBn_ThTR4-Dogo3ToH5j6gjVhWcvyomGk5dXkPanGGa4zG8vqQUvteIeYqh9os8avXy7AXt79gIN02CtphjYpCi9LXYni67eK6QcxV-xws7SxnuftldpGeeIzwjNaoJYzuiwOpVgNmHQXQqDFzmfgsTm6csC312zEUaKotrFs5FYz1y7yZ7x8558AZNVJIVrDqjR6zr4hqxHAHd4HwYdnafvOE7k_a_8tO9hMZIs3Z6_FpygCXOP251qnZMp-Jspt9E4308Pajk_b0");

  private final StudioRepository studioRepository;
  private final SlugService slugService;

  public StudioService(StudioRepository studioRepository, SlugService slugService) {
    this.studioRepository = studioRepository;
    this.slugService = slugService;
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
      List<String> amenities) {
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

    String heroImage = fallbackImageFor(category, 0);
    String galleryImage = fallbackImageFor(category, 1);
    String detailImage = fallbackImageFor(category, 2);

    studio.addImage(newStudioImage(heroImage, 0));
    studio.addImage(newStudioImage(galleryImage, 1));
    studio.addImage(newStudioImage(detailImage, 2));

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

  private String fallbackImageFor(String category, int offset) {
    int baseIndex =
        switch ((category == null ? "" : category).toLowerCase()) {
          case "도예", "ceramics" -> 2;
          case "목공", "wood", "woodwork" -> 1;
          default -> 0;
        };

    return FALLBACK_STUDIO_IMAGES.get((baseIndex + offset) % FALLBACK_STUDIO_IMAGES.size());
  }
}
