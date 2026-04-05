package com.eungeum.sljeok.backend.content.repository;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.content.entity.ConversationEntity;
import com.eungeum.sljeok.backend.content.entity.StudioEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConversationRepository extends JpaRepository<ConversationEntity, String> {
  @EntityGraph(attributePaths = {"workshop", "workshop.images"})
  Optional<ConversationEntity> findByUserAndWorkshop(UserEntity user, StudioEntity workshop);

  @EntityGraph(attributePaths = {"workshop", "workshop.images"})
  @Query(
      """
      select c
      from ConversationEntity c
      join c.workshop w
      where c.user = :user or w.ownerUser = :user
      order by c.updatedAt desc
      """)
  List<ConversationEntity> findAccessible(@Param("user") UserEntity user);
}
