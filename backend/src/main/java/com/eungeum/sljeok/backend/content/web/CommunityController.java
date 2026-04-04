package com.eungeum.sljeok.backend.content.web;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.service.OriginValidationService;
import com.eungeum.sljeok.backend.auth.service.RateLimitService;
import com.eungeum.sljeok.backend.common.api.ApiEnvelope;
import com.eungeum.sljeok.backend.content.domain.CommunityCategory;
import com.eungeum.sljeok.backend.content.entity.CommunityCommentEntity;
import com.eungeum.sljeok.backend.content.entity.CommunityPostEntity;
import com.eungeum.sljeok.backend.content.service.CommunityService;
import com.eungeum.sljeok.backend.content.service.RequestUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@Validated
@RestController
@RequestMapping("/api/community/posts")
public class CommunityController {
  private static final DateTimeFormatter DATE_FORMATTER =
      DateTimeFormatter.ofPattern("MM.dd").withZone(ZoneId.of("Asia/Seoul"));

  private final CommunityService communityService;
  private final OriginValidationService originValidationService;
  private final RequestUserService requestUserService;
  private final RateLimitService rateLimitService;

  public CommunityController(
      CommunityService communityService,
      OriginValidationService originValidationService,
      RequestUserService requestUserService,
      RateLimitService rateLimitService) {
    this.communityService = communityService;
    this.originValidationService = originValidationService;
    this.requestUserService = requestUserService;
    this.rateLimitService = rateLimitService;
  }

  @GetMapping
  public ApiEnvelope<CommunityPostListPayload> list(
      @RequestParam(name = "q", required = false) String query,
      @RequestParam(name = "category", required = false) String category,
      @RequestParam(name = "page", defaultValue = "1") @Min(1) int page,
      @RequestParam(name = "pageSize", defaultValue = "10") @Min(1) @Max(30) int pageSize) {
    CommunityCategory resolvedCategory = null;
    if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
      resolvedCategory = parseCategory(category);
    }

    Page<CommunityPostEntity> result =
        communityService.list(query, resolvedCategory, page - 1, pageSize);
    List<CommunityPostSummaryItem> items = result.getContent().stream().map(this::toSummary).toList();
    return ApiEnvelope.ok(
        new CommunityPostListPayload(
            items,
            result.getNumber() + 1,
            result.getSize(),
            result.getTotalPages(),
            result.getTotalElements()));
  }

  @GetMapping("/{slug}")
  public ApiEnvelope<CommunityPostDetailItem> detail(@PathVariable String slug) {
    CommunityPostEntity post = communityService.getDetail(slug);
    List<CommunityPostSummaryItem> related =
        communityService.related(slug).stream().map(this::toSummary).toList();
    return ApiEnvelope.ok(toDetail(post, related));
  }

  @PostMapping
  public ApiEnvelope<CommunityPostCreatedPayload> create(
      @Valid @RequestBody CreateCommunityPostRequest requestBody, HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    rateLimitService.check("community:create:" + currentUser.getId(), 20, Duration.ofMinutes(10));
    CommunityPostEntity post =
        communityService.create(
            currentUser,
            parseCategory(requestBody.category()),
            requestBody.title().trim(),
            requestBody.body().trim());
    return ApiEnvelope.ok(
        new CommunityPostCreatedPayload(post.getId(), post.getSlug(), "/community/post/" + post.getSlug()),
        "게시물이 등록되었습니다.");
  }

  @PutMapping("/{slug}")
  public ApiEnvelope<CommunityPostCreatedPayload> update(
      @PathVariable String slug,
      @Valid @RequestBody CreateCommunityPostRequest requestBody,
      HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    rateLimitService.check("community:update:" + currentUser.getId(), 30, Duration.ofMinutes(10));
    CommunityPostEntity post =
        communityService.update(
            currentUser,
            slug,
            parseCategory(requestBody.category()),
            requestBody.title().trim(),
            requestBody.body().trim());
    return ApiEnvelope.ok(
        new CommunityPostCreatedPayload(post.getId(), post.getSlug(), "/community/post/" + post.getSlug()),
        "게시물이 수정되었습니다.");
  }

  @DeleteMapping("/{slug}")
  public ApiEnvelope<CommunityPostDeletedPayload> delete(
      @PathVariable String slug, HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    rateLimitService.check("community:delete:" + currentUser.getId(), 30, Duration.ofMinutes(10));
    communityService.delete(currentUser, slug);
    return ApiEnvelope.ok(new CommunityPostDeletedPayload(slug), "게시물이 삭제되었습니다.");
  }

  @PostMapping("/{slug}/comments")
  public ApiEnvelope<CommentCreatedPayload> addComment(
      @PathVariable String slug,
      @Valid @RequestBody CreateCommentRequest requestBody,
      HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    rateLimitService.check("community:comment:" + currentUser.getId(), 40, Duration.ofMinutes(10));
    CommunityCommentEntity comment =
        communityService.addComment(currentUser, slug, requestBody.body().trim());
    return ApiEnvelope.ok(
        new CommentCreatedPayload(
            comment.getAuthorDisplayName(),
            DATE_FORMATTER.format(
                comment.getCreatedAt() == null ? Instant.now() : comment.getCreatedAt())),
        "댓글이 등록되었습니다.");
  }

  private CommunityCategory parseCategory(String value) {
    try {
      return CommunityCategory.from(value);
    } catch (IllegalArgumentException exception) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "카테고리를 다시 선택해주세요.");
    }
  }

  private CommunityPostSummaryItem toSummary(CommunityPostEntity post) {
    return new CommunityPostSummaryItem(
        post.getId(),
        post.getSlug(),
        post.getCategory().code(),
        post.getCategory().label(),
        post.getTitle(),
        post.getExcerpt(),
        post.getAuthorDisplayName() == null || post.getAuthorDisplayName().isBlank()
            ? "은금슬쩍 회원"
            : post.getAuthorDisplayName(),
        DATE_FORMATTER.format(post.getCreatedAt()),
        post.getViewCount(),
        post.getCommentCount());
  }

  private CommunityPostDetailItem toDetail(
      CommunityPostEntity post, List<CommunityPostSummaryItem> relatedPosts) {
    return new CommunityPostDetailItem(
        post.getId(),
        post.getSlug(),
        post.getCategory().code(),
        post.getCategory().label(),
        post.getTitle(),
        post.getExcerpt(),
        post.getBody(),
        post.getAuthorUser() == null ? null : post.getAuthorUser().getId(),
        post.getAuthorDisplayName() == null || post.getAuthorDisplayName().isBlank()
            ? "은금슬쩍 회원"
            : post.getAuthorDisplayName(),
        DATE_FORMATTER.format(post.getCreatedAt()),
        post.getViewCount(),
        post.getCommentCount(),
        post.getComments().stream()
            .map(
                comment ->
                    new CommentItem(
                        comment.getAuthorDisplayName() == null || comment.getAuthorDisplayName().isBlank()
                            ? "은금슬쩍 회원"
                            : comment.getAuthorDisplayName(),
                        comment.getBody(),
                        DATE_FORMATTER.format(comment.getCreatedAt())))
            .toList(),
        relatedPosts);
  }

  public record CommunityPostListPayload(
      List<CommunityPostSummaryItem> items,
      int page,
      int pageSize,
      int totalPages,
      long totalItems) {}

  public record CommunityPostSummaryItem(
      String id,
      String slug,
      String category,
      String categoryLabel,
      String title,
      String excerpt,
      String author,
      String date,
      long views,
      long comments) {}

  public record CommunityPostDetailItem(
      String id,
      String slug,
      String category,
      String categoryLabel,
      String title,
      String excerpt,
      String body,
      String authorUserId,
      String author,
      String date,
      long views,
      long comments,
      List<CommentItem> commentList,
      List<CommunityPostSummaryItem> relatedPosts) {}

  public record CommentItem(String author, String body, String date) {}

  public record CommunityPostCreatedPayload(String id, String slug, String detailPath) {}

  public record CommunityPostDeletedPayload(String slug) {}

  public record CommentCreatedPayload(String author, String date) {}

  public record CreateCommunityPostRequest(
      @NotBlank(message = "카테고리를 선택해주세요.") String category,
      @NotBlank(message = "제목을 입력해주세요.")
      @Size(min = 2, max = 160, message = "제목은 2자 이상 160자 이하로 입력해주세요.")
      String title,
      @NotBlank(message = "내용을 입력해주세요.")
      @Size(min = 2, max = 10000, message = "내용은 2자 이상 10000자 이하로 입력해주세요.")
      String body) {}

  public record CreateCommentRequest(
      @NotBlank(message = "댓글 내용을 입력해주세요.")
      @Size(min = 1, max = 2000, message = "댓글은 2000자 이하로 입력해주세요.")
      String body) {}
}
