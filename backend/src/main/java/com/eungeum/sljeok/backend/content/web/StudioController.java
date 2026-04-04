package com.eungeum.sljeok.backend.content.web;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.service.OriginValidationService;
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

  public StudioController(
      StudioService studioService,
      OriginValidationService originValidationService,
      RequestUserService requestUserService) {
    this.studioService = studioService;
    this.originValidationService = originValidationService;
    this.requestUserService = requestUserService;
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
        "공방이 등록되었습니다.");
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
        studio.getContact(),
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
      String contact,
      int capacity,
      List<String> imageUrls,
      List<String> amenities,
      String createdAt) {}

  public record StudioCreatedPayload(String id, String slug, String name, String detailPath) {}

  public record CreateStudioRequest(
      @NotBlank(message = "공방 이름을 입력해주세요.")
      @Size(max = 120, message = "공방 이름이 너무 깁니다.")
      String name,
      @NotBlank(message = "주소를 입력해주세요.")
      @Size(max = 160, message = "주소가 너무 깁니다.")
      String location,
      @NotBlank(message = "공방 소개를 입력해주세요.")
      @Size(min = 10, max = 4000, message = "공방 소개는 10자 이상 4000자 이하로 입력해주세요.")
      String description,
      @NotNull(message = "가격을 입력해주세요.")
      @Min(value = 1, message = "가격은 0보다 커야 합니다.")
      int price,
      @NotBlank(message = "연락처를 입력해주세요.")
      @Size(max = 120, message = "연락처가 너무 깁니다.")
      String contact,
      @NotBlank(message = "카테고리를 선택해주세요.")
      @Size(max = 80, message = "카테고리가 너무 깁니다.")
      String category,
      @Min(value = 1, message = "수용 인원은 1명 이상이어야 합니다.")
      @Max(value = 100, message = "수용 인원이 너무 큽니다.")
      Integer capacity,
      List<@Size(max = 80, message = "장비/편의시설 항목이 너무 깁니다.") String> amenities) {}
}
