package com.eungeum.sljeok.backend.content.repository;

import com.eungeum.sljeok.backend.content.domain.StudioStatus;
import com.eungeum.sljeok.backend.content.entity.StudioEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudioRepository extends JpaRepository<StudioEntity, String> {
  boolean existsBySlug(String slug);

  @EntityGraph(attributePaths = {"images"})
  List<StudioEntity> findAllByStatusOrderByCreatedAtDesc(StudioStatus status);

  @EntityGraph(attributePaths = {"images"})
  Optional<StudioEntity> findBySlugAndStatus(String slug, StudioStatus status);

  @EntityGraph(attributePaths = {"images"})
  List<StudioEntity> findTop3ByStatusOrderByCreatedAtDesc(StudioStatus status);
}
