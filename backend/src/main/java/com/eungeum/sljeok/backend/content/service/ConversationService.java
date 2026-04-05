package com.eungeum.sljeok.backend.content.service;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.content.entity.ConversationEntity;
import com.eungeum.sljeok.backend.content.entity.ConversationMessageEntity;
import com.eungeum.sljeok.backend.content.entity.StudioEntity;
import com.eungeum.sljeok.backend.content.repository.ConversationRepository;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ConversationService {
  private final ConversationRepository conversationRepository;
  private final StudioService studioService;

  public ConversationService(
      ConversationRepository conversationRepository, StudioService studioService) {
    this.conversationRepository = conversationRepository;
    this.studioService = studioService;
  }

  @Transactional(readOnly = true)
  public List<ConversationEntity> list(UserEntity actor) {
    List<ConversationEntity> conversations = conversationRepository.findAccessible(actor);
    conversations.forEach(this::initialize);
    return conversations;
  }

  @Transactional(readOnly = true)
  public long unreadCount(UserEntity actor) {
    return list(actor).stream().mapToLong(conversation -> conversation.unreadCountFor(actor)).sum();
  }

  @Transactional
  public ConversationEntity createOrGet(UserEntity actor, String workshopSlug) {
    StudioEntity workshop = studioService.getBySlug(workshopSlug);
    String ownerUserId = workshop.getOwnerUser() == null ? null : workshop.getOwnerUser().getId();

    if (ownerUserId != null && ownerUserId.equals(actor.getId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "내 공방에는 메시지를 남길 수 없어요.");
    }

    return conversationRepository
        .findByUserAndWorkshop(actor, workshop)
        .map(
            conversation -> {
              initialize(conversation);
              return conversation;
            })
        .orElseGet(
            () -> {
              ConversationEntity conversation = new ConversationEntity();
              conversation.setUser(actor);
              conversation.setWorkshop(workshop);

              try {
                ConversationEntity saved = conversationRepository.saveAndFlush(conversation);
                initialize(saved);
                return saved;
              } catch (DataIntegrityViolationException duplicate) {
                ConversationEntity existing =
                    conversationRepository
                        .findByUserAndWorkshop(actor, workshop)
                        .orElseThrow(() -> duplicate);
                initialize(existing);
                return existing;
              }
            });
  }

  @Transactional
  public ConversationEntity getAccessibleAndMarkRead(UserEntity actor, String conversationId) {
    ConversationEntity conversation =
        conversationRepository
            .findById(conversationId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "대화를 찾을 수 없어요."));

    ensureAccessible(actor, conversation);
    conversation.markReadFor(actor);
    initialize(conversation);
    return conversation;
  }

  @Transactional
  public ConversationMessageEntity sendMessage(
      UserEntity actor, String conversationId, String content) {
    ConversationEntity conversation = getAccessibleAndMarkRead(actor, conversationId);

    ConversationMessageEntity message = new ConversationMessageEntity();
    message.setSender(actor);
    message.setContent(content);
    conversation.addMessage(message);
    conversation.markReadFor(actor);
    conversationRepository.saveAndFlush(conversation);
    return message;
  }

  private void ensureAccessible(UserEntity actor, ConversationEntity conversation) {
    String inquirerId = conversation.getUser() == null ? null : conversation.getUser().getId();
    String ownerUserId =
        conversation.getWorkshop() == null || conversation.getWorkshop().getOwnerUser() == null
            ? null
            : conversation.getWorkshop().getOwnerUser().getId();

    if (actor.getId().equals(inquirerId) || actor.getId().equals(ownerUserId)) {
      return;
    }

    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "이 대화는 볼 수 없어요.");
  }

  private void initialize(ConversationEntity conversation) {
    conversation.getWorkshop().getName();
    conversation.getWorkshop().getImages().size();
    conversation.getMessages().forEach(message -> message.getSender().getId());
  }
}
