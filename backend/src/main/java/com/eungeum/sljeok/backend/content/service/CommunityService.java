package com.eungeum.sljeok.backend.content.service;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.domain.UserRole;
import com.eungeum.sljeok.backend.content.domain.CommunityCategory;
import com.eungeum.sljeok.backend.content.entity.CommunityCommentEntity;
import com.eungeum.sljeok.backend.content.entity.CommunityPostEntity;
import com.eungeum.sljeok.backend.content.repository.CommunityPostRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CommunityService {
  private final CommunityPostRepository communityPostRepository;
  private final SlugService slugService;

  public CommunityService(
      CommunityPostRepository communityPostRepository, SlugService slugService) {
    this.communityPostRepository = communityPostRepository;
    this.slugService = slugService;
  }

  @Transactional(readOnly = true)
  public Page<CommunityPostEntity> list(
      String query, CommunityCategory category, int page, int pageSize) {
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    String normalizedQuery = query == null || query.isBlank() ? null : query.trim();
    return communityPostRepository.search(category, normalizedQuery, pageable);
  }

  @Transactional(readOnly = true)
  public List<CommunityPostEntity> latest(int limit) {
    return communityPostRepository.findTop5ByOrderByCreatedAtDesc().stream().limit(limit).toList();
  }

  @Transactional
  public CommunityPostEntity getDetail(String slug) {
    CommunityPostEntity post =
        communityPostRepository
            .findBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

    post.getComments().size();
    post.setViewCount(post.getViewCount() + 1);
    return communityPostRepository.saveAndFlush(post);
  }

  @Transactional(readOnly = true)
  public List<CommunityPostEntity> related(String slug) {
    return communityPostRepository.findTop2BySlugNotOrderByCreatedAtDesc(slug);
  }

  @Transactional
  public CommunityPostEntity create(
      UserEntity author, CommunityCategory category, String title, String body) {
    CommunityPostEntity post = new CommunityPostEntity();
    post.setSlug(slugService.uniqueSlug(title, communityPostRepository::existsBySlug));
    post.setAuthorUser(author);
    post.setAuthorDisplayName(author.getDisplayName());
    post.setCategory(category);
    post.setTitle(title);
    post.setExcerpt(excerpt(body));
    post.setBody(body);
    post.setViewCount(0);
    post.setCommentCount(0);
    return communityPostRepository.save(post);
  }

  @Transactional
  public CommunityPostEntity update(
      UserEntity actor, String slug, CommunityCategory category, String title, String body) {
    CommunityPostEntity post = findOwnedOrAdminPost(actor, slug);
    post.setCategory(category);
    post.setTitle(title);
    post.setExcerpt(excerpt(body));
    post.setBody(body);
    return communityPostRepository.save(post);
  }

  @Transactional
  public CommunityCommentEntity addComment(UserEntity author, String slug, String body) {
    CommunityPostEntity post =
        communityPostRepository
            .findBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

    post.getComments().size();
    CommunityCommentEntity comment = new CommunityCommentEntity();
    comment.setAuthorUser(author);
    comment.setAuthorDisplayName(author.getDisplayName());
    comment.setBody(body);
    post.addComment(comment);
    post.setCommentCount(post.getCommentCount() + 1);
    communityPostRepository.saveAndFlush(post);
    return comment;
  }

  @Transactional
  public void delete(UserEntity actor, String slug) {
    CommunityPostEntity post = findOwnedOrAdminPost(actor, slug);
    communityPostRepository.delete(post);
  }

  private CommunityPostEntity findOwnedOrAdminPost(UserEntity actor, String slug) {
    CommunityPostEntity post =
        communityPostRepository
            .findBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

    String authorUserId = post.getAuthorUser() == null ? null : post.getAuthorUser().getId();
    boolean isAdmin = actor.getRole() == UserRole.ADMIN;
    boolean isOwner = authorUserId != null && authorUserId.equals(actor.getId());
    if (!isAdmin && !isOwner) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성한 사람만 바꿀 수 있어요.");
    }

    post.getComments().size();
    return post;
  }

  private String excerpt(String body) {
    String compact = body == null ? "" : body.replaceAll("\\s+", " ").trim();
    if (compact.length() <= 96) {
      return compact;
    }
    return compact.substring(0, 96) + "…";
  }
}
