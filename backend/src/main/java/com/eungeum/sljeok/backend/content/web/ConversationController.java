package com.eungeum.sljeok.backend.content.web;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.service.OriginValidationService;
import com.eungeum.sljeok.backend.auth.service.RateLimitService;
import com.eungeum.sljeok.backend.common.api.ApiEnvelope;
import com.eungeum.sljeok.backend.content.entity.ConversationEntity;
import com.eungeum.sljeok.backend.content.entity.ConversationMessageEntity;
import com.eungeum.sljeok.backend.content.service.ConversationService;
import com.eungeum.sljeok.backend.content.service.RequestUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api")
public class ConversationController {
  private static final DateTimeFormatter ROOM_TIME_FORMATTER =
      DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.of("Asia/Seoul"));
  private static final DateTimeFormatter LIST_TIME_FORMATTER =
      DateTimeFormatter.ofPattern("M.d").withZone(ZoneId.of("Asia/Seoul"));

  private final ConversationService conversationService;
  private final RequestUserService requestUserService;
  private final OriginValidationService originValidationService;
  private final RateLimitService rateLimitService;

  public ConversationController(
      ConversationService conversationService,
      RequestUserService requestUserService,
      OriginValidationService originValidationService,
      RateLimitService rateLimitService) {
    this.conversationService = conversationService;
    this.requestUserService = requestUserService;
    this.originValidationService = originValidationService;
    this.rateLimitService = rateLimitService;
  }

  @PostMapping("/conversations")
  public ApiEnvelope<ConversationCreatedPayload> createConversation(
      @Valid @RequestBody CreateConversationRequest requestBody, HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    rateLimitService.check("conversation:create:" + currentUser.getId(), 40, Duration.ofHours(1));

    ConversationEntity conversation =
        conversationService.createOrGet(currentUser, requestBody.workshopSlug().trim());

    return ApiEnvelope.ok(
        new ConversationCreatedPayload(
            conversation.getId(),
            conversation.getWorkshop().getName(),
            "/messages/" + conversation.getId()),
        "대화를 열었어요.");
  }

  @GetMapping("/conversations")
  public ApiEnvelope<ConversationListPayload> listConversations(HttpServletRequest request) {
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    List<ConversationSummaryItem> items =
        conversationService.list(currentUser).stream().map(this::toSummary).toList();
    return ApiEnvelope.ok(new ConversationListPayload(items));
  }

  @GetMapping("/conversations/{id}/messages")
  public ApiEnvelope<ConversationDetailPayload> getMessages(
      @PathVariable("id") String conversationId, HttpServletRequest request) {
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    ConversationEntity conversation = conversationService.getAccessible(currentUser, conversationId);
    return ApiEnvelope.ok(toDetail(conversation));
  }

  @PostMapping("/messages")
  public ApiEnvelope<MessageCreatedPayload> sendMessage(
      @Valid @RequestBody CreateMessageRequest requestBody, HttpServletRequest request) {
    originValidationService.validateSameOrigin(request);
    UserEntity currentUser = requestUserService.requireActiveUser(request);
    rateLimitService.check("message:create:" + currentUser.getId(), 120, Duration.ofMinutes(10));

    ConversationMessageEntity message =
        conversationService.sendMessage(
            currentUser, requestBody.conversationId().trim(), requestBody.content().trim());

    return ApiEnvelope.ok(
        new MessageCreatedPayload(
            message.getId(),
            message.getConversation().getId(),
            currentUser.getId(),
            message.getContent(),
            ROOM_TIME_FORMATTER.format(
                message.getCreatedAt() == null ? Instant.now() : message.getCreatedAt())),
        "메시지를 남겼어요.");
  }

  private ConversationSummaryItem toSummary(ConversationEntity conversation) {
    List<ConversationMessageEntity> messages = conversation.getMessages();
    ConversationMessageEntity latest = messages.isEmpty() ? null : messages.get(messages.size() - 1);
    String preview =
        latest == null
            ? "대화를 시작해보세요."
            : compact(latest.getContent(), 42);

    Instant latestTime =
        latest == null
            ? conversation.getUpdatedAt()
            : latest.getCreatedAt() == null ? conversation.getUpdatedAt() : latest.getCreatedAt();

    String imageUrl =
        conversation.getWorkshop().getImages().isEmpty()
            ? ""
            : conversation.getWorkshop().getImages().get(0).getImageUrl();

    return new ConversationSummaryItem(
        conversation.getId(),
        conversation.getWorkshop().getName(),
        conversation.getWorkshop().getSlug(),
        preview,
        LIST_TIME_FORMATTER.format(latestTime),
        imageUrl,
        "/messages/" + conversation.getId());
  }

  private ConversationDetailPayload toDetail(ConversationEntity conversation) {
    String imageUrl =
        conversation.getWorkshop().getImages().isEmpty()
            ? ""
            : conversation.getWorkshop().getImages().get(0).getImageUrl();

    return new ConversationDetailPayload(
        conversation.getId(),
        conversation.getWorkshop().getName(),
        conversation.getWorkshop().getSlug(),
        imageUrl,
        conversation.getMessages().stream()
            .map(
                message ->
                    new MessageItem(
                        message.getId(),
                        message.getSender().getId(),
                        message.getContent(),
                        ROOM_TIME_FORMATTER.format(
                            message.getCreatedAt() == null ? Instant.now() : message.getCreatedAt())))
            .toList());
  }

  private String compact(String value, int maxLength) {
    String normalized = value == null ? "" : value.replaceAll("\\s+", " ").trim();
    if (normalized.length() <= maxLength) {
      return normalized;
    }
    return normalized.substring(0, maxLength) + "…";
  }

  public record CreateConversationRequest(
      @NotBlank(message = "공방을 다시 골라주세요.")
      @Size(max = 160, message = "공방 정보를 다시 확인해 주세요.")
      String workshopSlug) {}

  public record CreateMessageRequest(
      @NotBlank(message = "대화를 다시 확인해 주세요.")
      @Size(max = 36, message = "대화를 다시 확인해 주세요.")
      String conversationId,
      @NotBlank(message = "메시지를 적어주세요.")
      @Size(max = 2000, message = "메시지가 조금 길어요.")
      String content) {}

  public record ConversationCreatedPayload(String id, String workshopName, String detailPath) {}

  public record ConversationListPayload(List<ConversationSummaryItem> items) {}

  public record ConversationSummaryItem(
      String id,
      String workshopName,
      String workshopSlug,
      String lastMessagePreview,
      String timestamp,
      String imageUrl,
      String detailPath) {}

  public record ConversationDetailPayload(
      String id,
      String workshopName,
      String workshopSlug,
      String imageUrl,
      List<MessageItem> messages) {}

  public record MessageItem(String id, String senderId, String content, String timestamp) {}

  public record MessageCreatedPayload(
      String id, String conversationId, String senderId, String content, String timestamp) {}
}
