package com.eungeum.sljeok.backend.content.repository;

import com.eungeum.sljeok.backend.content.domain.CommunityCategory;
import com.eungeum.sljeok.backend.content.entity.CommunityPostEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommunityPostRepository extends JpaRepository<CommunityPostEntity, String> {
  boolean existsBySlug(String slug);

  @Query(
      """
      select p
      from CommunityPostEntity p
      where (:category is null or p.category = :category)
        and (
          :query is null
          or lower(p.title) like lower(concat('%', :query, '%'))
          or lower(p.excerpt) like lower(concat('%', :query, '%'))
          or lower(p.body) like lower(concat('%', :query, '%'))
          or lower(coalesce(p.authorDisplayName, '')) like lower(concat('%', :query, '%'))
        )
      """)
  Page<CommunityPostEntity> search(
      @Param("category") CommunityCategory category,
      @Param("query") String query,
      Pageable pageable);

  Optional<CommunityPostEntity> findBySlug(String slug);

  List<CommunityPostEntity> findTop5ByOrderByCreatedAtDesc();

  List<CommunityPostEntity> findTop2BySlugNotOrderByCreatedAtDesc(String slug);
}
