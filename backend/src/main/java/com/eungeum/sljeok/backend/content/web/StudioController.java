package com.eungeum.sljeok.backend.content.web;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.service.OriginValidationService;
import com.eungeum.sljeok.backend.auth.service.RateLimitService;
import com.eungeum.sljeok.backend.common.api.ApiEnvelope;
import com.eungeum.sljeok.backend.content.entity.StudioAmenityEntity;
import com.eungeum.sljeok.backend.content.entity.StudioEntity;
import com.eungeum.sljeok.backend.content.entity.StudioImageEntity;
import com.eungeum.sljeok.backend.content.service.RequestUserService;
import com.eungeum.sljeok.backend.content.service.StudioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Duration;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/studios")
public class StudioController {
  private static final DateTimeFormatter DATE_FORMATTER =
      DateTimeFormatter.ofPattern("yyyy.MM.dd").withZone(ZoneId.of("Asia/Seoul"));

  private final StudioService studioService;
  private final OriginValidationService originValidationService;
  private final RequestUserService requestUserService;
  private final RateLimitService rateLimitService;

  public StudioController(
      StudioService studioService,
      OriginValidationService originValidationService,
      RequestUserService requestUserService,
      RateLimitService rateLimitService) {
    this.studioService = studioService;
    this.originValidationService = originValidationService;
    this.requestUserService = requestUserService;
    this.rateLimitService = rateLimitService;
  }

  @GetMapping
  public ApiEnvelope<StudioListPayload> list(
      @RequestParam(name = "limit", required = false) Integer limit) {
    List<StudioSummaryItem> items =
        (limit != null && limit > 0 ? studioService.listFeatured() : studioService.listAll()).stream()
            .limit(limit != null && limit > 0 ? limit : Integer.MAX_VALUE)
            .map(this::toSummary)
            .toList();
    return ApiEnvelope.ok(new StudioListPayload(items));
  }

  @GetMapping("/{slug}")
  public ApiEnvelope<StudioDetailItem> detail(@PathVariable String slug) {
    return ApiEnvelope.ok(toDetail(studioService.getBySlug(slug)));
  }

  @PostMapping
  public ApiEnvelope<StudioCreatedPayload> create(
      @Valid @RequestBody CreateStudioRequest requestBody, HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    rateLimitService.check("studio:create:" + currentUser.getId(), 12, Duration.ofHours(1));
    StudioEntity studio =
        studioService.create(
            currentUser,
            requestBody.category().trim(),
            requestBody.name().trim(),
            requestBody.location().trim(),
            requestBody.description().trim(),
            requestBody.price(),
            "월",
            requestBody.contact().trim(),
            requestBody.capacity(),
            requestBody.amenities());
    return ApiEnvelope.ok(
        new StudioCreatedPayload(
            studio.getId(), studio.getSlug(), studio.getName(), "/market/studio/" + studio.getSlug()),
        "공방을 올렸어요.");
  }

  private StudioSummaryItem toSummary(StudioEntity studio) {
    return new StudioSummaryItem(
        studio.getId(),
        studio.getSlug(),
        studio.getName(),
        studio.getLocation(),
        studio.getDescription(),
        studio.getPriceAmount(),
        studio.getPriceUnit(),
        studio.getOwnerDisplayName(),
        studio.getImages().stream().map(StudioImageEntity::getImageUrl).toList(),
        studio.getAmenities().stream().map(StudioAmenityEntity::getAmenityName).limit(3).toList(),
        DATE_FORMATTER.format(studio.getCreatedAt()));
  }

  private StudioDetailItem toDetail(StudioEntity studio) {
    return new StudioDetailItem(
        studio.getId(),
        studio.getSlug(),
        studio.getName(),
        studio.getCategory(),
        studio.getLocation(),
        studio.getDescription(),
        studio.getPriceAmount(),
        studio.getPriceUnit(),
        studio.getOwnerDisplayName(),
        studio.getCapacity() == null ? 1 : studio.getCapacity(),
        studio.getImages().stream().map(StudioImageEntity::getImageUrl).toList(),
        studio.getAmenities().stream().map(StudioAmenityEntity::getAmenityName).toList(),
        DATE_FORMATTER.format(studio.getCreatedAt()));
  }

  public record StudioListPayload(List<StudioSummaryItem> items) {}

  public record StudioSummaryItem(
      String id,
      String slug,
      String name,
      String location,
      String description,
      long priceAmount,
      String priceUnit,
      String ownerDisplayName,
      List<String> imageUrls,
      List<String> amenities,
      String createdAt) {}

  public record StudioDetailItem(
      String id,
      String slug,
      String name,
      String category,
      String location,
      String description,
      long priceAmount,
      String priceUnit,
      String ownerDisplayName,
      int capacity,
      List<String> imageUrls,
      List<String> amenities,
      String createdAt) {}

  public record StudioCreatedPayload(String id, String slug, String name, String detailPath) {}

  public record CreateStudioRequest(
      @NotBlank(message = "공방 이름을 적어주세요.")
      @Size(max = 120, message = "공방 이름이 조금 길어요.")
      String name,
      @NotBlank(message = "주소를 적어주세요.")
      @Size(max = 160, message = "주소가 조금 길어요.")
      String location,
      @NotBlank(message = "공간을 소개해 주세요.")
      @Size(min = 10, max = 4000, message = "소개를 조금 더 적어주세요.")
      String description,
      @NotNull(message = "대여료를 적어주세요.")
      @Min(value = 1, message = "대여료를 다시 확인해 주세요.")
      int price,
      @NotBlank(message = "연락처를 남겨주세요.")
      @Size(max = 120, message = "연락처가 조금 길어요.")
      String contact,
      @NotBlank(message = "분야를 골라주세요.")
      @Size(max = 80, message = "분야를 다시 확인해 주세요.")
      String category,
      @Min(value = 1, message = "인원은 1명부터 적을 수 있어요.")
      @Max(value = 100, message = "인원을 다시 확인해 주세요.")
      Integer capacity,
      List<@Size(max = 80, message = "항목이 조금 길어요.") String> amenities) {}
}
